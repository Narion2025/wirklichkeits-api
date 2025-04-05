import time
import requests
from playsound import playsound
import os

WATCH_FILE = "narion_output.txt"
API_ENDPOINT = "http://localhost:10000/api/speak"
AUDIO_FILE = "narion.mp3"

def check_for_speak_trigger():
    if not os.path.exists(WATCH_FILE):
        return None
    
    with open(WATCH_FILE, "r") as f:
        lines = f.readlines()

    for line in lines:
        if line.strip().startswith("speak:"):
            return line.strip().replace("speak:", "").strip()
    return None

def clear_file():
    with open(WATCH_FILE, "w") as f:
        f.write("")

def speak(text):
    print(f"[🧠] Sending to ElevenLabs: {text}")
    response = requests.post(API_ENDPOINT, json={"text": text})
    if response.status_code == 200:
        with open(AUDIO_FILE, "wb") as f:
            f.write(response.content)
        print("[🔊] Playing audio...")
        playsound(AUDIO_FILE)
    else:
        print(f"[💥] API error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    print("[👀] Watching for 'speak:' commands...")
    while True:
        text = check_for_speak_trigger()
        if text:
            speak(text)
            clear_file()
        time.sleep(5)
