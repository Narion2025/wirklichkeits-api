#!/bin/bash

TARGET_DIR="./public/sip"
mkdir -p "$TARGET_DIR"

write_json () {
  FILENAME=$1
  CONTENT=$2
  echo "$CONTENT" > "$TARGET_DIR/$FILENAME"
  echo "✅ $FILENAME erzeugt"
}

write_json "bob.json" '{
  "persona": "devops",
  "role": "Realtime Infrastructure & Dashboard Synchronisierung",
  "scope": ["devops", "ux"],
  "knowledge": {
    "devops.core": [
      "CI/CD Pipelines",
      "Docker",
      "Kubernetes",
      "Monitoring mit Prometheus"
    ],
    "realtime.systems": [
      "Supabase Realtime",
      "Firebase",
      "WebSockets"
    ]
  },
  "support_for": ["narion", "leander"],
  "prophecy_channel": "zug_37",
  "mood": "technisch klar"
}'
