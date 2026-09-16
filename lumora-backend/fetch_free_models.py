import requests

resp = requests.get("https://openrouter.ai/api/v1/models")
if resp.status_code == 200:
    models = resp.json().get("data", [])
    free_models = [m["id"] for m in models if ":free" in m["id"] or m.get("pricing", {}).get("prompt") == "0"]
    print(f"Total free models found on OpenRouter: {len(free_models)}")
    for m in free_models:
        print(" -", m)
else:
    print("Failed to fetch models:", resp.status_code)
