import os
import json
import re
import requests
import logging
from django.conf import settings

def clean_json_response(text: str) -> str:
    """Removes markdown code blocks, reasoning think tags, double braces, and conversational headers/thinking processes around JSON."""
    if not text:
        return ""
    # Strip <think>...</think> tags produced by reasoning models
    text = re.sub(r'<think>[\s\S]*?</think>', '', text, flags=re.IGNORECASE)

    # 1. First preference: extract content inside ```json ... ``` code fence if present
    match = re.search(r'```(?:json|javascript)?\s*([\s\S]*?)\s*(?:```|$)', text, flags=re.IGNORECASE)
    if match and match.group(1).strip():
        inner = match.group(1).strip()
        indices = [i for i in [inner.find('{'), inner.find('[')] if i != -1]
        if indices:
            text = inner[min(indices):]
        else:
            text = inner
    else:
        # 2. If no valid code fence, strip preamble headers and find first '{' or '['
        text = re.sub(r'^(?:Here\'s a thinking process:|Here is a thinking process:|Thinking Process:)[\s\S]*?\n\n', '', text, flags=re.IGNORECASE)
        idx_brace = text.find('{')
        idx_bracket = text.find('[')

        if idx_brace != -1 or idx_bracket != -1:
            if idx_brace != -1 and (idx_bracket == -1 or idx_brace < idx_bracket):
                start_idx = idx_brace
            else:
                start_idx = idx_bracket
            text = text[start_idx:]

    # Fix double opening braces "{\n{" -> "{"
    text = re.sub(r'^\s*\{\s*\{', '{', text)
    # Fix double closing braces "}\n}" at end -> "}"
    text = re.sub(r'\}\s*\}\s*$', '}', text)

    return text.strip()

def repair_json(text: str):
    """Strips leading prose before '{' or '[', cleans markdown/think tags, fixes double braces, and repairs unclosed/truncated JSON objects."""
    if not text:
        return None

    text = clean_json_response(text)

    # Find first '{' or '['
    idx_brace = text.find('{')
    idx_bracket = text.find('[')

    if idx_brace == -1 and idx_bracket == -1:
        return None

    if idx_brace != -1 and (idx_bracket == -1 or idx_brace < idx_bracket):
        start_idx = idx_brace
    else:
        start_idx = idx_bracket

    json_str = text[start_idx:].strip()
    json_str = re.sub(r'```\s*$', '', json_str).strip()

    # 1. Direct parse
    try:
        parsed = json.loads(json_str)
        if isinstance(parsed, (dict, list)):
            return parsed
    except Exception:
        pass

    # 2. Progressively balance braces/brackets to repair truncated JSON
    s = json_str
    for _ in range(100):
        # Fix unclosed string quote if needed
        quote_count = len(re.findall(r'(?<!\\)"', s))
        s_clean = s
        if quote_count % 2 != 0:
            s_clean += '"'

        s_clean = s_clean.rstrip()
        if s_clean.endswith(','):
            s_clean = s_clean[:-1]

        open_braces = s_clean.count('{') - s_clean.count('}')
        open_brackets = s_clean.count('[') - s_clean.count(']')

        s_fixed = s_clean + (']' * max(0, open_brackets)) + ('}' * max(0, open_braces))
        try:
            parsed = json.loads(s_fixed)
            if isinstance(parsed, (dict, list)):
                return parsed
        except Exception:
            pass

        last_break = max(s.rfind(','), s.rfind('{'), s.rfind('['), s.rfind('"'))
        if last_break <= 0:
            break
        s = s[:last_break]

    return None

AVAILABLE_MODELS = [
    "nvidia/nemotron-3.5-lightning:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "openrouter/free",
]

def validate_schema_keys(data, expected_format):
    """Verifies that parsed JSON contains expected top-level schema keys if expected_format is provided."""
    if not expected_format or not isinstance(expected_format, dict):
        return True
    if not isinstance(data, dict):
        return False
    expected_keys = set(expected_format.keys())
    if not expected_keys:
        return True
    present_keys = set(data.keys())
    matching = expected_keys.intersection(present_keys)
    if not matching:
        return False
    return True

def call_gemini_direct(prompt: str, system_instruction: str = None, expected_format: dict = None) -> dict:
    """
    Direct Google Gemini REST API Integration with native JSON mode.
    Uses GEMINI_API_KEY_1 or GOOGLE_API_KEY from environment or Django settings.
    Tries gemini-2.5-flash, gemini-1.5-flash-latest with native JSON schema enforcement.
    """
    api_key = (
        getattr(settings, 'GEMINI_API_KEY_1', None) or 
        getattr(settings, 'GOOGLE_API_KEY', None) or 
        os.environ.get('GEMINI_API_KEY_1') or 
        os.environ.get('GOOGLE_API_KEY')
    )
    if not api_key:
        raise Exception("GEMINI_API_KEY_1 / GOOGLE_API_KEY is not set in environment or Django settings")

    models = [
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemma-4-31b-it",
        "gemma-4-26b-a4b-it",
    ]
    last_err = None

    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.7,
                "maxOutputTokens": 4000
            }
        }

        sys_text = system_instruction or (
            "You are Lumora AI. Output ONLY valid, raw JSON. "
            "Do not include markdown code block fences, reasoning text, or explanations."
        )
        payload["systemInstruction"] = {
            "parts": [{"text": sys_text}]
        }

        try:
            logging.info(f"[GEMINI DIRECT] Attempting direct Google API call model={model}")
            resp = requests.post(url, headers=headers, json=payload, timeout=45)
            if resp.status_code == 200:
                res_data = resp.json()
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        raw_text = parts[0].get("text", "")
                        cleaned = clean_json_response(raw_text)
                        parsed = None
                        try:
                            parsed = json.loads(cleaned)
                        except Exception:
                            parsed = repair_json(raw_text)
                            
                        if parsed and isinstance(parsed, (dict, list)):
                            if validate_schema_keys(parsed, expected_format):
                                logging.info(f"[GEMINI DIRECT] Direct Gemini API call model={model} successful!")
                                return parsed
                            else:
                                last_err = f"Gemini model {model} returned JSON missing required keys"
                                logging.warning(f"[GEMINI DIRECT] {last_err}")
                        else:
                            last_err = f"Gemini model {model} returned unparseable output"
                            logging.warning(f"[GEMINI DIRECT] {last_err}")
            else:
                last_err = f"Gemini direct model={model} status={resp.status_code}: {resp.text[:150]}"
                logging.warning(f"[GEMINI DIRECT] {last_err}")
        except Exception as e:
            last_err = str(e)
            logging.warning(f"[GEMINI DIRECT] Model {model} request failed: {e}")

    raise Exception(f"All direct Gemini models failed: {last_err}")

def generate_gemini_content(prompt: str, expected_format: dict = None) -> dict:
    """Shared generation pipeline: Direct Google Gemini first, OpenRouter fallback."""

    last_error = None

    # ============================================================
    # 1. PRIMARY: Direct Google Gemini
    # ============================================================
    try:
        logging.info("[AI PIPELINE] Attempting Direct Google Gemini as PRIMARY.")
        return call_gemini_direct(
            prompt,
            expected_format=expected_format
        )
    except Exception as gem_err:
        logging.warning(
            f"[GEMINI DIRECT] Primary Gemini failed: {gem_err}. "
            "Falling back to OpenRouter."
        )
        last_error = f"Gemini Primary Error: {gem_err}"

    # ============================================================
    # 2. FALLBACK: OpenRouter
    # ============================================================
    api_key = getattr(
        settings,
        'OPENROUTER_API_KEY',
        os.environ.get('OPENROUTER_API_KEY')
    )

    if api_key:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        openrouter_rate_limited = False

        for model in AVAILABLE_MODELS:
            if openrouter_rate_limited:
                break

            # Try response_format first, then without it
            for use_response_format in [True, False]:

                payload = {
                    "model": model,
                    "max_tokens": 4000,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a strict JSON generation API for Lumora. "
                                "You MUST return ONLY valid, raw JSON. "
                                "Do NOT include markdown formatting, code fences, "
                                "reasoning tags, or conversational text. "
                                "Your response must begin with '{' or '['."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                }

                if use_response_format:
                    payload["response_format"] = {
                        "type": "json_object"
                    }

                try:
                    logging.info(
                        f"[OPENROUTER FALLBACK] "
                        f"Attempting model={model} "
                        f"response_format={use_response_format}"
                    )

                    resp = requests.post(
                        url,
                        headers=headers,
                        json=payload,
                        timeout=45
                    )

                    if resp.status_code == 429:
                        last_error = (
                            f"OpenRouter model {model} "
                            f"status=429 (Rate Limit Exceeded)"
                        )

                        logging.warning(
                            f"[OPENROUTER] {last_error}. "
                            "Skipping remaining OpenRouter models."
                        )

                        openrouter_rate_limited = True
                        break

                    if resp.status_code == 400 and "response_format" in resp.text:
                        logging.warning(
                            f"[OPENROUTER] model={model} rejected "
                            "response_format, retrying without it"
                        )
                        continue

                    if resp.status_code == 200:
                        res_data = resp.json()
                        choices = res_data.get("choices", [])

                        if not choices:
                            last_error = (
                                f"Model {model} returned no choices"
                            )
                            logging.warning(
                                f"[OPENROUTER] {last_error}"
                            )

                            if use_response_format:
                                continue

                            break

                        msg = choices[0].get("message", {})
                        raw_text = msg.get("content")

                        if not raw_text or not raw_text.strip():
                            last_error = (
                                f"Model {model} returned empty content"
                            )

                            logging.warning(
                                f"[OPENROUTER] {last_error}"
                            )

                            if use_response_format:
                                continue

                            break

                        cleaned = clean_json_response(raw_text)

                        # Direct JSON parse
                        parsed = None

                        try:
                            parsed = json.loads(cleaned)
                        except Exception:
                            parsed = None

                        # Defensive JSON repair
                        if parsed is None:
                            parsed = repair_json(raw_text)

                        if parsed and isinstance(parsed, (dict, list)):

                            if validate_schema_keys(
                                parsed,
                                expected_format
                            ):
                                logging.info(
                                    f"[OPENROUTER] model={model} "
                                    f"response_format={use_response_format} "
                                    "generation successful"
                                )

                                return parsed

                            else:
                                last_error = (
                                    f"Model {model} returned JSON "
                                    "missing required schema keys"
                                )

                                logging.warning(
                                    f"[OPENROUTER] {last_error}"
                                )

                        else:
                            last_error = (
                                f"Model {model} returned "
                                f"unparseable text: {raw_text[:100]}"
                            )

                            logging.warning(
                                f"[OPENROUTER] {last_error}"
                            )

                        if use_response_format:
                            continue

                        break

                    else:
                        last_error = (
                            f"Model {model} status={resp.status_code}: "
                            f"{resp.text[:150]}"
                        )

                        logging.warning(
                            f"[OPENROUTER] {last_error}"
                        )

                        if (
                            use_response_format
                            and resp.status_code in (400, 422)
                        ):
                            continue

                        break

                except Exception as e:
                    last_error = str(e)

                    logging.warning(
                        f"[OPENROUTER] Model {model} request failed: {e}"
                    )

                    if use_response_format:
                        continue

                    break

    else:
        logging.warning(
            "[OPENROUTER] OPENROUTER_API_KEY is not configured."
        )

    # ============================================================
    # 3. Everything failed
    # ============================================================
    raise Exception(
        f"All AI generation attempts failed. "
        f"Last error: {last_error}"
    )


def strict_output(system_prompt: str, user_prompt: str, output_format: dict) -> dict:
    """Equivalent to strict_output in app-07/lib/gemini.ts"""
    output_format_prompt = (
        f"\nYou must return ONLY valid JSON matching this schema: {json.dumps(output_format)}.\n"
        "Do not include markdown code block fences (like ```json).\n"
        "Do not include explanations or conversational text before or after the JSON.\n"
        "Use valid JSON string quoting and escaping.\n"
        "The response must begin with '{' and end with '}'."
    )
    prompt = f"{system_prompt}\n{output_format_prompt}\n\n{user_prompt}"
    response_data = generate_gemini_content(prompt, expected_format=output_format)
    return {"response": {"body": json.dumps(response_data)}, "prompt": prompt}

def strict_output_chat(chat_history: list, user_prompt: str, output_format: dict) -> dict:
    """Equivalent to strict_output_chat in app-07/lib/gemini.ts"""
    output_format_prompt = (
        f"\nYou must return ONLY valid JSON matching this schema: {json.dumps(output_format)}.\n"
        "Do not include markdown code block fences (like ```json).\n"
        "Do not include explanations or conversational text before or after the JSON.\n"
        "Use valid JSON string quoting and escaping.\n"
        "The response must begin with '{' and end with '}'."
    )
    prompt = f"{user_prompt}\n{output_format_prompt}"
    response_data = generate_gemini_content(prompt, expected_format=output_format)
    return {"response": {"body": json.dumps(response_data)}, "prompt": prompt}
