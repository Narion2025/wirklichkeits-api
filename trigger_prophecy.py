import requests
import json
from datetime import datetime
import os

# === Konfiguration ===
API_URL = "http://localhost:8000/generate_prophecy_image"

# === Prophezeiungsparameter (kannst du natürlich dynamisieren) ===
theme = "digitale Identität im Spiel"
metapher = "Ein Kreis, der sich selbst beobachtet"
atmosphäre = "futuristisch, silbern-blau, transparent"

# === Anfrage an FastAPI-Server senden ===
payload = {
    "theme": theme,
    "metapher": metapher,
    "atmosphäre": atmosphäre
}

print("\n⏳ Prophezeiung wird ausgelöst...")

try:
    response = requests.post(API_URL, json=payload)
    response.raise_for_status()  # → wirft Fehler bei HTTP 4xx/5xx
    data = response.json()

    # === Prüfung auf Bild-URL in Response ===
    if "image_url" in data:
        timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H-%M-%S")
        diagnose_dir = "./public/diagnose"
        os.makedirs(diagnose_dir, exist_ok=True)

        # === JSON-Dokument erstellen ===
        prophecy_record = {
            "event": "technoprophezeiung",
            "triggered_by": "manual_ben",
            "timestamp": timestamp,
            "image_url": data["image_url"],
            "theme": theme,
            "metapher": metapher,
            "atmosphäre": atmosphäre
        }

        # === Pfad zur Log-Datei
        diagnose_path = os.path.join(diagnose_dir, f"prophezeiung-{timestamp}.json")

        # === JSON schreiben
        with open(diagnose_path, "w") as f:
            json.dump(prophecy_record, f, indent=2)

        # === Ausgabe im Terminal
        print("\n✅ Prophezeiung abgeschlossen!")
        print(f"🖼️  Bild:     {data['image_url']}")
        print(f"📄  JSON:    {diagnose_path}")
        print(f"🔮  Thema:   {theme}")
        print(f"🌀  Metapher: {metapher}\n")

    else:
        print("\n⚠️  Fehler: Keine Bild-URL zurückbekommen.")
        print("Antwort:", data)

except requests.exceptions.RequestException as e:
    print("\n❌ Fehler bei der HTTP-Anfrage:")
    print(str(e))

except Exception as e:
    print("\n❌ Allgemeiner Fehler:")
    print(str(e))
