
# 🧪 Diagnosemodule – Wirklichkeits-API

Dieser Ordner enthält Diagnosewerkzeuge zur Prüfung des Live-Status der Narion-Umgebung und Subsysteme.

## 📁 Struktur

- `index.html` → Aktuelles Diagnosetool (fragt /oracle ab)
- Zukünftige Dateien (z. B. heartbeat.html, mind-check.html) können hier ergänzt werden

## 📡 Aufruf

- Lokal: http://localhost:6066/diagnose/
- Remote (z. B. Render): https://wirklichkeits-api.onrender.com/diagnose/

## 🔄 Hinweise

- Stelle sicher, dass der Server auf Port `6066` läuft
- Stelle sicher, dass `public/diagnose/index.html` erreichbar ist
- Achte auf CORS-Freigabe, wenn du von externem Browser aus testest

## 🛠 Erweiterungsideen

- API-Health Check auf `/status`
- JSON-Visualisierung mehrerer Endpunkte
- Fehleranalyse für Trigger-, Task- oder Mind-Probleme
