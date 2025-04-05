import requests
import subprocess
import tkinter as tk

API_ENDPOINT = "http://127.0.0.1:6066/api/speak"

def speak_text():
    text = text_input.get("1.0", tk.END).strip()
    if not text:
        return
    response = requests.post(API_ENDPOINT, json={"text": text})
    if response.status_code == 200:
        with open("narion.mp3", "wb") as f:
            f.write(response.content)
        subprocess.call(["afplay", "narion.mp3"])  # macOS only

window = tk.Tk()
window.title("Narion Voice Test")
window.geometry("400x250")

tk.Label(window, text="Sprich etwas:").pack()
text_input = tk.Text(window, height=4, width=40)
text_input.pack()
tk.Button(window, text="Sprechen 🗣️", command=speak_text).pack(pady=10)

window.mainloop()
