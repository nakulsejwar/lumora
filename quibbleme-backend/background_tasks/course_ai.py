import os
import json
import re
import uuid
import logging
import requests
from openai import OpenAI
from django.conf import settings
from background_tasks.gemini import clean_json_response, repair_json, AVAILABLE_MODELS

def clean_course_text(text: str) -> str:
    """Strips conversational preambles like 'We need to output JSON only...' before parsing JSON."""
    if not text:
        return ""
    
    # Remove meta-commentary lines such as "We need to output JSON only..."
    text = re.sub(r'^(?:We need to output|Here\'s a thinking|Thinking Process:|Note:|\d+\.\s+\*\*).*?\n\n', '', text, flags=re.IGNORECASE)
    return clean_json_response(text)


def _call_course_openai_compatible_provider(
    provider_name: str,
    base_url: str,
    api_key: str,
    model: str,
    prompt: str,
    max_tokens: int = 6000,
    system_instruction: str = None,
) -> dict:
    """Reliable structured-JSON call for OpenAI-compatible providers."""
    if not api_key:
        raise Exception(f"{provider_name} API key is not configured")

    client = OpenAI(base_url=base_url, api_key=api_key)

    system_text = system_instruction or (
        "You are Lumora Course Studio AI. "
        "Return ONLY one valid JSON object. "
        "Do not include markdown code fences, explanations, preambles, or meta-commentary. "
        "Do not expose internal reasoning. "
        "Use valid JSON string quoting and escaping."
    )

    # JSON mode is supported by the current Groq GPT-OSS/Qwen stack and
    # by current Cerebras structured-output capable models.
    kwargs = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_text},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
    }

    # Groq reasoning models can return reasoning separately. Disable it so
    # the content channel remains clean JSON for our parser.
    if provider_name == "GROQ":
        kwargs["include_reasoning"] = False

    try:
        completion = client.chat.completions.create(**kwargs)
    except Exception as first_error:
        # Some provider/model combinations may reject response_format.
        # Retry the SAME model once without response_format rather than
        # immediately burning the next provider.
        msg = str(first_error).lower()
        if "response_format" not in msg and "json" not in msg and "400" not in msg:
            raise

        fallback_kwargs = dict(kwargs)
        fallback_kwargs.pop("response_format", None)
        try:
            completion = client.chat.completions.create(**fallback_kwargs)
        except Exception:
            raise first_error

    if not completion.choices:
        raise Exception(f"{provider_name} returned no choices")

    message = completion.choices[0].message
    raw_text = getattr(message, "content", None) or ""

    if not raw_text.strip():
        raise Exception(f"{provider_name} returned empty content")

    cleaned = clean_course_text(raw_text)

    try:
        parsed = json.loads(cleaned)
    except Exception:
        parsed = repair_json(raw_text)

    if parsed and isinstance(parsed, (dict, list)):
        logging.info(
            f"[COURSE_AI {provider_name}] model={model} generation successful"
        )
        return parsed

    raise Exception(f"{provider_name} returned unparseable JSON")

def call_course_cerebras_direct(
    prompt: str,
    system_instruction: str = None,
    max_tokens: int = 6000,
) -> dict:
    """Direct Cerebras fallback for Course AI."""
    api_key = (
        getattr(settings, "CEREBRAS_API_KEY", None)
        or os.environ.get("CEREBRAS_API_KEY")
    )
    configured_model = os.environ.get("CEREBRAS_MODEL")
    models = ([configured_model] if configured_model else []) + [
        "gemma-4-31b",
        "qwen-3.8-27b",
        "gpt-oss-120b",
    ]
    models = list(dict.fromkeys(models))
    last_err = None

    for model in models:
        try:
            return _call_course_openai_compatible_provider(
                provider_name="CEREBRAS",
                base_url="https://api.cerebras.ai/v1",
                api_key=api_key,
                model=model,
                prompt=prompt,
                max_tokens=max_tokens,
                system_instruction=system_instruction,
            )
        except Exception as e:
            last_err = e
            logging.warning(f"[COURSE_AI CEREBRAS] model={model} failed, trying next model: {e}")

    raise Exception(f"All Course AI Cerebras models failed: {last_err}")


def call_course_groq_direct(
    prompt: str,
    system_instruction: str = None,
    max_tokens: int = 6000,
) -> dict:
    """Direct Groq fallback for Course AI."""
    api_key = (
        getattr(settings, "GROQ_API_KEY", None)
        or os.environ.get("GROQ_API_KEY")
    )
    configured_model = os.environ.get("GROQ_MODEL")
    models = ([configured_model] if configured_model else []) + [
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen/qwen3.8-27b",
        "qwen/qwen3.6-27b",
    ]
    models = list(dict.fromkeys(models))
    last_err = None

    for model in models:
        try:
            return _call_course_openai_compatible_provider(
                provider_name="GROQ",
                base_url="https://api.groq.com/openai/v1",
                api_key=api_key,
                model=model,
                prompt=prompt,
                max_tokens=max_tokens,
                system_instruction=system_instruction,
            )
        except Exception as e:
            last_err = e
            logging.warning(f"[COURSE_AI GROQ] model={model} failed, trying next model: {e}")

    raise Exception(f"All Course AI Groq models failed: {last_err}")


def call_course_gemini_direct(prompt: str, system_instruction: str = None, max_tokens: int = 16000) -> dict:
    """
    Dedicated Direct Google Gemini API Engine specifically for Course AI (app-07).
    Uses GEMINI_API_KEY / GOOGLE_API_KEY directly with maxOutputTokens set to 16,000 for large course & game generation.
    Supports native JSON output schema enforcement.
    """
    api_key = (
        getattr(settings, 'GEMINI_API_KEY', None) or 
        getattr(settings, 'GOOGLE_API_KEY', None) or 
        os.environ.get('GEMINI_API_KEY') or 
        os.environ.get('GOOGLE_API_KEY')
    )
    if not api_key:
        raise Exception("GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment or settings")

    models = [
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash-lite",
        "gemma-4-31b-it",
        "gemma-4-26b-a4b-it",
    ]
    last_err = None

    sys_text = system_instruction or (
        "You are Lumora Course Studio AI engine for app-07. "
        "Output ONLY valid, raw JSON. Do NOT include markdown code block fences, thinking process, or explanations."
    )

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
            "systemInstruction": {
                "parts": [{"text": sys_text}]
            },
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.7,
                "maxOutputTokens": max_tokens
            }
        }

        try:
            logging.info(f"[COURSE_AI DIRECT GEMINI] Requesting model={model} max_tokens={max_tokens}")
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            if resp.status_code in (400, 422) and "response_format" in resp.text.lower():
                logging.warning(
                    f"[COURSE_AI OPENROUTER] Model {model} rejected response_format. "
                    "Retrying same model without JSON mode."
                )
                payload.pop("response_format", None)
                retry_resp = requests.post(url, headers=headers, json=payload, timeout=30)
                if retry_resp.status_code == 200:
                    resp = retry_resp
                elif retry_resp.status_code == 429:
                    last_error = f"Model {model} rate limited (429) on retry"
                    continue
                else:
                    last_error = (
                        f"Model {model} retry status={retry_resp.status_code}: "
                        f"{retry_resp.text[:150]}"
                    )
                    continue

            if resp.status_code == 200:
                res_data = resp.json()
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        raw_text = parts[0].get("text", "")
                        cleaned = clean_course_text(raw_text)
                        parsed = None
                        try:
                            parsed = json.loads(cleaned)
                        except Exception:
                            parsed = repair_json(raw_text)

                        if parsed and isinstance(parsed, (dict, list)):
                            logging.info(f"[COURSE_AI DIRECT GEMINI] Successfully generated course/game JSON with model={model}")
                            return parsed
                        else:
                            last_err = f"Model {model} returned unparseable text: {raw_text[:100]}"
            else:
                last_err = f"Model {model} status={resp.status_code}: {resp.text[:150]}"
        except Exception as e:
            last_err = str(e)
            logging.warning(f"[COURSE_AI DIRECT GEMINI] Model {model} failed: {e}")

    raise Exception(f"Course Direct Gemini API failed: {last_err}")

def call_openrouter_raw(prompt: str, system_message: str = None) -> dict:
    """Helper to execute OpenRouter request with key rotation and error handling."""
    api_key = getattr(settings, 'OPENROUTER_API_KEY_1', os.environ.get('OPENROUTER_API_KEY_1'))
    if not api_key:
        raise Exception("OPENROUTER_API_KEY_1 is not set")
        
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    
    if not system_message:
        system_message = (
            "You are Lumora Course Studio AI. "
            "Output ONLY valid raw JSON without markdown code fences, reasoning text, or meta-comments. "
            "Your response must begin with '{' or '['."
        )

    last_error = None
    for model in AVAILABLE_MODELS:
        payload = {
            "model": model,
            "max_tokens": 10000,
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
        }
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=15)
            if resp.status_code == 429:
                logging.warning(
                    f"[COURSE_AI OPENROUTER] Model {model} rate limited 429. "
                    "Trying the next OpenRouter model."
                )
                last_error = f"Model {model} rate limited (429)"
                continue
            if resp.status_code == 200:
                res_data = resp.json()
                choices = res_data.get("choices", [])
                if choices:
                    raw_text = choices[0].get("message", {}).get("content", "")
                    cleaned = clean_course_text(raw_text)
                    parsed = None
                    try:
                        parsed = json.loads(cleaned)
                    except Exception:
                        parsed = repair_json(raw_text)
                        
                    if parsed and isinstance(parsed, (dict, list)):
                        logging.info(f"[COURSE_AI OPENROUTER] Successfully generated content using model={model}")
                        return parsed
                    else:
                        last_error = f"Model {model} returned unparseable text"
        except Exception as e:
            last_error = str(e)
            
    raise Exception(f"All OpenRouter models failed for Course AI. Last error: {last_error}")

def generate_course_ai_content(prompt: str, system_message: str = None, max_tokens: int = 16000) -> dict:
    """
    Central Course AI dispatcher.
    Keeps the existing Gemini -> OpenRouter flow, then adds direct
    Cerebras and Groq fallbacks with minimal changes.
    """
    try:
        logging.info("[COURSE_AI] Executing Direct Google Gemini API for app-07 course/game generation.")
        return call_course_gemini_direct(
            prompt,
            system_instruction=system_message,
            max_tokens=max_tokens,
        )
    except Exception as gem_err:
        logging.warning(
            f"[COURSE_AI] Direct Gemini failed: {gem_err}. "
            "Attempting OpenRouter fallback..."
        )

    try:
        return call_openrouter_raw(prompt, system_message=system_message)
    except Exception as openrouter_err:
        logging.warning(
            f"[COURSE_AI] OpenRouter failed: {openrouter_err}. "
            "Attempting Cerebras fallback..."
        )

    try:
        return call_course_cerebras_direct(
            prompt,
            system_instruction=system_message,
            max_tokens=max(6000, min(max_tokens, 12000)),
        )
    except Exception as cerebras_err:
        logging.warning(
            f"[COURSE_AI] Cerebras failed: {cerebras_err}. "
            "Attempting Groq fallback..."
        )

    try:
        return call_course_groq_direct(
            prompt,
            system_instruction=system_message,
            max_tokens=max(6000, min(max_tokens, 12000)),
        )
    except Exception as groq_err:
        logging.warning(
            f"[COURSE_AI] Groq failed: {groq_err}. "
            "All external Course AI providers failed."
        )
        raise Exception(
            f"All Course AI providers failed: Gemini={gem_err}; "
            f"OpenRouter={openrouter_err}; Cerebras={cerebras_err}; "
            f"Groq={groq_err}"
        )

def generate_course_app07(topic: str, module_count: int = 3) -> dict:
    """
    Dedicated Course Generation Engine for app-07.
    Generates structured, rich course data dynamically matching module_count without unparseable errors or placeholder strings.
    """
    topic_clean = topic.strip() or "Reading Comprehension Adventure"
    try:
        module_count = int(module_count)
    except Exception:
        module_count = 3
        
    if module_count < 1:
        module_count = 3
    if module_count > 15:
        module_count = 15

    # ---------------------------------------------------------
    # PASS 1: Generate High-Level Course Structure (Metadata + Titles)
    # ---------------------------------------------------------
    pass1_prompt = f"""
Create a structured reading-comprehension course outline for the topic: '{topic_clean}'.
Generate EXACTLY {module_count} modules. Do NOT generate more or fewer than {module_count} modules.
Each module must have at least 2 levels (lessons).

CRITICAL CONTENT DEPTH REQUIREMENTS:
- course_description: A rich, well-written 3 to 4 sentence paragraph (80-110 words) detailing the course theme, main story plot/mystery, reading comprehension focus (evidence, context clues, inference), and learning goals.
- module_description: A detailed 3 sentence paragraph (50-70 words) describing the specific narrative arc, clues introduced in this module, and key reading skills to apply.
- level_description: A clear 2 to 3 sentence overview (35-50 words) outlining the specific story passage focus, text evidence analysis, and vocabulary practice for this lesson.

Output JSON matching this EXACT format:
{{
  "course_name": "Engaging Course Title for {topic_clean}",
  "course_description": "Rich 3-4 sentence paragraph describing the story, reading comprehension focus, and key learning goals.",
  "modules": [
    {{
      "id": "mod_1",
      "module_name": "Module 1: Descriptive Module Title",
      "module_description": "Detailed 3 sentence overview of narrative setting, passage clues, and reading focus.",
      "levels": [
        {{
          "id": "lev_1",
          "level_name": "Level 1: Descriptive Lesson Title",
          "level_description": "Detailed 2-3 sentence overview of story passage, text evidence, and vocabulary."
        }},
        {{
          "id": "lev_2",
          "level_name": "Level 2: Descriptive Lesson Title",
          "level_description": "Detailed 2-3 sentence overview of story passage, text evidence, and vocabulary."
        }}
      ]
    }}
  ]
}}
"""

    course_data = None
    try:
        logging.info(f"[COURSE_AI] Starting Pass 1 course generation for topic='{topic_clean}' modules={module_count}")
        course_data = generate_course_ai_content(pass1_prompt, max_tokens=4000)
    except Exception as e:
        logging.warning(f"[COURSE_AI] Pass 1 AI call failed: {e}. Building clean fallback structure.")
        
    # Build fallback structure if AI call failed or returned incomplete structure
    if not course_data or not isinstance(course_data, dict) or not course_data.get("modules"):
        course_data = {
            "course_name": f"Mastering {topic_clean}",
            "course_description": f"Embark on a captivating reading comprehension journey into '{topic_clean}'. This course guides students through engaging narratives, developing their critical thinking and text analysis skills as they analyze clues, evaluate character motivations, and build key reading vocabulary.",
            "modules": []
        }

    # ---------------------------------------------------------
    # PASS 2: Post-Sanitize & Force Exact module_count Match
    # ---------------------------------------------------------
    c_name = course_data.get("course_name") or f"Mastering {topic_clean}"
    if "courseName" in c_name or "Placeholder" in c_name:
        c_name = f"Mastering {topic_clean}"
    course_data["course_name"] = c_name

    c_desc = course_data.get("course_description") or ""
    if len(c_desc) < 60 or "between 300-400 words" in c_desc or "courseDescription" in c_desc:
        course_data["course_description"] = (
            f"Embark on a captivating reading comprehension journey into '{topic_clean}'. "
            f"This course guides students through engaging narratives, developing their critical thinking "
            f"and text analysis skills as they analyze clues, evaluate character motivations, and build key reading vocabulary."
        )

    modules_list = course_data.get("modules", [])
    sanitized_modules = []

    for m_idx, mod in enumerate(modules_list, start=1):
        if not isinstance(mod, dict):
            continue
            
        m_id = str(mod.get("id") or f"mod_{m_idx}")
        m_name = mod.get("module_name") or f"Module {m_idx}: {topic_clean}"
        if "moduleName" in m_name or "String" in m_name:
            m_name = f"Module {m_idx}: Discovering {topic_clean} Part {m_idx}"
            
        m_desc = mod.get("module_description") or ""
        if len(m_desc) < 40 or "between 300-400 words" in m_desc or "moduleDescription" in m_desc:
            m_desc = (
                f"This module sets the stage for exploring key themes in {topic_clean}, introducing "
                f"the central narrative environment, key characters, and hidden evidence. Students will analyze "
                f"story passages to connect critical clues and master essential context vocabulary."
            )

        raw_levels = mod.get("levels", [])
        sanitized_levels = []
        
        if not isinstance(raw_levels, list) or len(raw_levels) == 0:
            raw_levels = [
                {
                    "id": f"lev_{m_idx}_1", 
                    "level_name": f"Lesson 1: Key Passages", 
                    "level_description": f"Read the story passage carefully to examine key evidence and context clues. Students will practice extracting text proof, defining vocabulary terms, and making logical inferences."
                },
                {
                    "id": f"lev_{m_idx}_2", 
                    "level_name": f"Lesson 2: Evidence & Vocabulary", 
                    "level_description": f"Analyze detailed evidence and vocabulary in the passage about {topic_clean}. Learners will connect facts to form logical conclusions."
                }
            ]

        for l_idx, lev in enumerate(raw_levels, start=1):
            if not isinstance(lev, dict):
                continue
            l_id = str(lev.get("id") or f"lev_{m_idx}_{l_idx}")
            l_name = lev.get("level_name") or f"Lesson {l_idx}: {topic_clean}"
            if "string" in l_name.lower() or "levelName" in l_name:
                l_name = f"Lesson {l_idx}: Reading Challenge {l_idx}"
                
            l_desc = lev.get("level_description") or ""
            if len(l_desc) < 30 or "between 300-400 words" in l_desc or "levelDescription" in l_desc:
                l_desc = (
                    f"Read the story passage carefully to examine key evidence and context clues. "
                    f"Students will practice extracting text proof, defining vocabulary terms, and making logical inferences."
                )

            sanitized_levels.append({
                "id": l_id,
                "level_name": l_name,
                "level_description": l_desc
            })

        sanitized_modules.append({
            "id": m_id,
            "module_name": m_name,
            "module_description": m_desc,
            "levels": sanitized_levels
        })

    module_theme_titles = [
        "Discovering the Foundations",
        "Key Passages & Evidence",
        "Exploration & Analysis",
        "Deepening Investigation",
        "Critical Clues & Context",
        "Advanced Concepts & Synthesis",
        "Mastery & Integration",
        "Complex Case Studies",
        "Final Reading Challenge",
        "Expert Comprehension"
    ]

    # Ensure EXACT module_count match
    while len(sanitized_modules) < module_count:
        idx = len(sanitized_modules) + 1
        theme_title = module_theme_titles[(idx - 1) % len(module_theme_titles)]
        sanitized_modules.append({
            "id": f"mod_{idx}",
            "module_name": f"Module {idx}: {topic_clean} – {theme_title}",
            "module_description": f"This module deepens the investigation into {topic_clean}, introducing advanced story passages, character motivations, and hidden evidence. Students will analyze narrative developments to connect critical clues and master essential context vocabulary.",
            "levels": [
                {
                    "id": f"lev_{idx}_1",
                    "level_name": f"Lesson 1: {theme_title} Part 1",
                    "level_description": f"Read the story passage carefully to examine key evidence and context clues. Students will practice extracting text proof and defining essential vocabulary terms."
                },
                {
                    "id": f"lev_{idx}_2",
                    "level_name": f"Lesson 2: {theme_title} Part 2",
                    "level_description": f"Analyze detailed evidence and vocabulary in the passage about {topic_clean}. Learners will connect facts to form logical inferences and solve reading challenges."
                }
            ]
        })
        
    if len(sanitized_modules) > module_count:
        sanitized_modules = sanitized_modules[:module_count]

    course_data["modules"] = sanitized_modules
    logging.info(f"[COURSE_AI] Final sanitized course structure built with EXACTLY {len(sanitized_modules)} modules")
    return course_data

def generate_games_app07(level_id: str, module_id: str, chat_history: list = None) -> dict:
    """Dedicated Fast Game Generation Engine for app-07 (Generates at least 5 questions per game)."""
    prompt = f"""
You are Lumora, an AI adaptive English reading coach.
Generate 1 high-quality reading-comprehension game for Level ID: {level_id}, Module ID: {module_id}.

CRITICAL RULE: The game MUST contain AT LEAST 5 questions (q1, q2, q3, q4, q5).

Return ONLY one valid JSON object matching this structure. Do not output reasoning, markdown, commentary, or any text outside the JSON object.
{{
  "games": [
    {{
      "id": "game_1",
      "game_name": "Reading Detective Challenge",
      "game_description": "1-2 sentence description of reading challenge",
      "passage_text": "Complete original 180-250 word reading passage suitable for Grade 5.",
      "grade_band": "Grade 5",
      "difficulty": "medium",
      "target_skill": "inference",
      "questions": [
        {{
          "id": "q1",
          "type": "mcq",
          "skill_tag": "main-idea",
          "question": "What is the central main idea of the reading passage?",
          "option1": "Option A",
          "option2": "Option B",
          "option3": "Option C",
          "option4": "Option D",
          "correct_answer": "Option A",
          "reason": "1-2 sentence explanation pointing to passage clue."
        }},
        {{
          "id": "q2",
          "type": "mcq",
          "skill_tag": "vocabulary",
          "question": "What does the key word mean as used in paragraph 2?",
          "option1": "Option A",
          "option2": "Option B",
          "option3": "Option C",
          "option4": "Option D",
          "correct_answer": "Option A",
          "reason": "1-2 sentence explanation of word context."
        }},
        {{
          "id": "q3",
          "type": "mcq",
          "skill_tag": "inference",
          "question": "What can the reader infer about the main character from their actions?",
          "option1": "Option A",
          "option2": "Option B",
          "option3": "Option C",
          "option4": "Option D",
          "correct_answer": "Option A",
          "reason": "1-2 sentence explanation of inference clue."
        }},
        {{
          "id": "q4",
          "type": "mcq",
          "skill_tag": "cause-effect",
          "question": "What caused the discovery described in the passage?",
          "option1": "Option A",
          "option2": "Option B",
          "option3": "Option C",
          "option4": "Option D",
          "correct_answer": "Option A",
          "reason": "1-2 sentence explanation of cause and effect."
        }},
        {{
          "id": "q5",
          "type": "mcq",
          "skill_tag": "evidence",
          "question": "Which sentence from the story best supports the main conclusion?",
          "option1": "Option A",
          "option2": "Option B",
          "option3": "Option C",
          "option4": "Option D",
          "correct_answer": "Option A",
          "reason": "1-2 sentence explanation pointing to exact text evidence."
        }}
      ]
    }}
  ]
}}
"""
    try:
        res = generate_course_ai_content(prompt, max_tokens=9000)
        if isinstance(res, dict) and "games" in res and res["games"]:
            g1 = res["games"][0]
            # Ensure questions has at least 5 elements
            if isinstance(g1.get("questions"), list) and len(g1["questions"]) >= 5:
                required_game_keys = {
                    "id", "game_name", "game_description", "passage_text",
                    "grade_band", "difficulty", "target_skill", "questions"
                }
                required_question_keys = {
                    "id", "type", "skill_tag", "question",
                    "option1", "option2", "option3", "option4",
                    "correct_answer", "reason"
                }
                valid_game = required_game_keys.issubset(g1.keys())
                valid_questions = all(
                    isinstance(q, dict) and required_question_keys.issubset(q.keys())
                    for q in g1["questions"][:5]
                )
                if valid_game and valid_questions:
                    g2 = json.loads(json.dumps(g1))
                    g2["id"] = "game_2"
                    g2["game_name"] = f"{g1.get('game_name', 'Reading Challenge')} - Part 2"
                    return {"games": [g1, g2]}
                logging.warning("[COURSE_AI] Generated game failed structural validation; trying fallback.")
    except Exception as e:
        logging.warning(f"[COURSE_AI] Fast game generation failed: {e}")

    # Rich Fallback Games structure with 5 complete questions per game
    return {
        "games": [
            {
                "id": "game_1",
                "game_name": "Reading Detective Challenge - Part 1",
                "game_description": "Read the passage carefully and solve 5 reading comprehension challenges.",
                "passage_text": "Early in the morning, detectives Maya and Leo arrived at the ancient museum entrance. Maya observed intricate, handwritten notes left inside a hidden stone desk, while Leo documented subtle footprints leading toward the inner chamber. By analyzing the date markings together, they realized the artifacts had been relocated long ago.",
                "grade_band": "Grade 5",
                "difficulty": "medium",
                "target_skill": "inference",
                "questions": [
                    {
                        "id": "q1",
                        "type": "mcq",
                        "skill_tag": "main-idea",
                        "question": "What is the main idea of the story passage?",
                        "option1": "Maya and Leo analyzed museum clues together to discover the truth about the artifacts.",
                        "option2": "Leo decided to abandon the investigation and leave.",
                        "option3": "Maya painted new pictures on the museum walls.",
                        "option4": "The museum was completely empty with no clues.",
                        "correct_answer": "Maya and Leo analyzed museum clues together to discover the truth about the artifacts.",
                        "reason": "The passage describes their joint investigation and clue analysis."
                    },
                    {
                        "id": "q2",
                        "type": "mcq",
                        "skill_tag": "vocabulary",
                        "question": "What does the word 'intricate' mean as used in the passage?",
                        "option1": "Very detailed and complex",
                        "option2": "Simple and plain",
                        "option3": "Loud and noisy",
                        "option4": "Heavy and rough",
                        "correct_answer": "Very detailed and complex",
                        "reason": "Intricate describes something made with detailed or complicated parts."
                    },
                    {
                        "id": "q3",
                        "type": "mcq",
                        "skill_tag": "inference",
                        "question": "What can you infer about Maya's role in the investigation?",
                        "option1": "She is observant and pays attention to hidden details",
                        "option2": "She does not care about finding clues",
                        "option3": "She was lost in the museum alone",
                        "option4": "She was waiting outside in the car",
                        "correct_answer": "She is observant and pays attention to hidden details",
                        "reason": "She found the handwritten notes hidden inside the stone desk."
                    },
                    {
                        "id": "q4",
                        "type": "mcq",
                        "skill_tag": "cause-effect",
                        "question": "What led the detectives to realize the artifacts had been relocated?",
                        "option1": "Analyzing the date markings together",
                        "option2": "Asking a tour guide for directions",
                        "option3": "Buying a museum catalog",
                        "option4": "Unlocking the front door",
                        "correct_answer": "Analyzing the date markings together",
                        "reason": "The passage explicitly states that analyzing the date markings together led to this realization."
                    },
                    {
                        "id": "q5",
                        "type": "mcq",
                        "skill_tag": "evidence",
                        "question": "Which detail shows that Leo contributed to documenting the evidence?",
                        "option1": "Leo documented subtle footprints leading toward the inner chamber",
                        "option2": "Leo left his notebook behind at home",
                        "option3": "Leo waited outside the museum entrance",
                        "option4": "Leo locked the stone desk",
                        "correct_answer": "Leo documented subtle footprints leading toward the inner chamber",
                        "reason": "The text directly states that Leo documented subtle footprints."
                    }
                ]
            }
        ]
    }

def regenerate_course_app07(chat_history: list = None, user_prompt: str = "", items: list = None) -> dict:
    """Regenerates a course dynamically with targeted user feedback and item constraints."""
    clean_prompt = user_prompt.replace("Regenerate course", "").strip() if user_prompt else ""
    items_str = ", ".join(items) if items else ""
    combined_topic = f"{clean_prompt} {items_str}".strip() or "Reading Comprehension Journey"
    return generate_course_app07(topic=combined_topic, module_count=3)

def regenerate_module_app07(chat_history: list = None, user_prompt: str = "", module_id: str = "mod_1", items: list = None) -> dict:
    """Regenerates a specific module dynamically using Lumora Direct Gemini AI Engine."""
    items_str = ", ".join(items) if items else "Make the module engaging, educational, and reading-focused."
    clean_prompt = user_prompt.replace("Regenerate module", "").strip() if user_prompt else ""
    topic = clean_prompt if clean_prompt else "Reading Comprehension & Clue Investigation"
    
    prompt = f"""
You are Lumora Course Studio AI.
Generate 1 newly refined reading comprehension module (Module ID: {module_id}) for topic/focus: '{topic}'.
User feedback and items to include: {items_str}.

CRITICAL CONTENT DEPTH REQUIREMENTS:
- module_description: A detailed 3 sentence paragraph (50-70 words) describing the specific narrative arc, clues introduced in this module, and key reading skills to apply.
- level_description: A clear 2 to 3 sentence overview (35-50 words) outlining the specific story passage focus, text evidence analysis, and vocabulary practice for this lesson.

The module MUST contain at least 2 levels (lessons).

Output ONLY raw JSON matching this structure:
{{
  "id": "{module_id}",
  "module_name": "Module Title: Descriptive Reading Theme",
  "module_description": "Detailed 3 sentence overview of narrative setting, passage clues, and reading focus.",
  "levels": [
    {{
      "id": "lev_1",
      "level_name": "Level 1: Descriptive Lesson Title",
      "level_description": "Detailed 2-3 sentence overview of story passage, text evidence, and vocabulary."
    }},
    {{
      "id": "lev_2",
      "level_name": "Level 2: Descriptive Lesson Title",
      "level_description": "Detailed 2-3 sentence overview of story passage, text evidence, and vocabulary."
    }}
  ]
}}
"""
    try:
        logging.info(f"[COURSE_AI REGENERATE MODULE] Generating new module for module_id={module_id}")
        res = generate_course_ai_content(prompt, max_tokens=4000)
        if isinstance(res, dict) and (res.get("module_name") or res.get("moduleName") or res.get("levels")):
            m_name = res.get("module_name") or res.get("moduleName") or f"Module: {topic}"
            if "moduleName" in m_name or "Regenerate" in m_name or "string" in m_name.lower():
                m_name = f"Refined Reading Module: {topic}"
            m_desc = res.get("module_description") or res.get("moduleDescription") or ""
            if len(m_desc) < 40 or "between 300-400 words" in m_desc:
                m_desc = f"This module sets the stage for exploring key themes in {topic}, introducing the central narrative environment, key characters, and hidden evidence. Students will analyze story passages to connect critical clues and master essential context vocabulary."
                
            raw_levels = res.get("levels", [])
            sanitized_levels = []
            if isinstance(raw_levels, list) and len(raw_levels) > 0:
                for l_idx, lev in enumerate(raw_levels, start=1):
                    if isinstance(lev, dict):
                        l_name = str(lev.get("level_name") or f"Lesson {l_idx}: Passage Clues")
                        l_desc = str(lev.get("level_description") or "")
                        if len(l_desc) < 30 or "between 300-400 words" in l_desc:
                            l_desc = f"Read the story passage carefully to examine key evidence and context clues. Students will practice extracting text proof, defining vocabulary terms, and making logical inferences."
                        sanitized_levels.append({
                            "id": str(lev.get("id") or f"lev_{l_idx}"),
                            "level_name": l_name,
                            "level_description": l_desc
                        })
            if len(sanitized_levels) < 2:
                sanitized_levels = [
                    {
                        "id": "lev_1", 
                        "level_name": f"Lesson 1: Passage Investigation", 
                        "level_description": f"Read the story passage carefully to examine key evidence and context clues. Students will practice extracting text proof, defining vocabulary terms, and making logical inferences."
                    },
                    {
                        "id": "lev_2", 
                        "level_name": f"Lesson 2: Evidence & Vocabulary", 
                        "level_description": f"Analyze detailed evidence and vocabulary in the passage about {topic}. Learners will connect facts to form logical conclusions."
                    }
                ]
            return {
                "id": module_id,
                "module_name": m_name,
                "module_description": m_desc,
                "levels": sanitized_levels
            }
    except Exception as e:
        logging.warning(f"[COURSE_AI REGENERATE MODULE] AI call failed: {e}")

    # High quality fallback module if AI call fails
    return {
        "id": module_id,
        "module_name": f"Refined Module: Key Evidence & Analysis",
        "module_description": f"This module deepens the investigation into {topic}, introducing advanced story passages, character motivations, and hidden evidence. Students will analyze narrative developments to connect critical clues and master essential context vocabulary.",
        "levels": [
            {
                "id": "lev_1",
                "level_name": "Lesson 1: Text Evidence & Clues",
                "level_description": "Read the narrative carefully and extract key story details. Students will practice analyzing clues and finding textual proof."
            },
            {
                "id": "lev_2",
                "level_name": "Lesson 2: Vocabulary & Inference",
                "level_description": "Analyze key vocabulary terms and infer character intentions. Learners will connect narrative evidence to draw logical conclusions."
            }
        ]
    }
