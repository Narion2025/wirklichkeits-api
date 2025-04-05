import requests
import subprocess
import tkinter as tk
from tkinter import messagebox

API_ENDPOINT = "http://127.0.0.1:6066/api/speak"
AUDIO_FILE = "narion.mp3"

def speak_text():
    text = text_input.get("1.0", tk.END).strip()
    if not text:
        messagebox.showwarning("Leer!", "Bitte gib etwas ein.")
        return

    try:
        print(f"[🧠] Sende an Narion: {text}")
        response = requests.post(API_ENDPOINT, json={"text": text})
        if response.status_code == 200:
            with open(AUDIO_FILE, "wb") as f:
                f.write(response.content)
            print("[🔊] Abspielen...")
            subprocess.call(["afplay", AUDIO_FILE])  # für macOS
        else:
            messagebox.showerror("Fehler", f"API-Fehler: {response.status_code}")
    except Exception as e:
        messagebox.showerror("Fehler", str(e))

# GUI
window = tk.Tk()
window.title("🧠 Narion Voice Interface")
window.geometry("400x250")

label = tk.Label(window, text="Was soll Narion sagen?")
label.pack(pady=10)

text_input = tk.Text(window, height=5, width=40)
text_input.pack()

speak_button = tk.Button(window, text="Sprechen lassen 🗣️", command=speak_text)
speak_button.pack(pady=10)

window.mainloop()
