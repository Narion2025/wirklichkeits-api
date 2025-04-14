from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import openai
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()  # .env laden

app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/generate_prophecy_image")
async def generate_prophecy_image(request: Request):
    body = await request.json()
    theme = body.get("theme", "Zukunft")
    metapher = body.get("metapher", "Ein sich selbst beobachtender Kreis")
    atmosphäre = body.get("atmosphäre", "futuristisch, silbern-blau")

    prompt = f"A symbolic, ethereal digital painting representing '{metapher}', under the theme of '{theme}', with a {atmosphäre} tone and sacred, futuristic atmosphere."

    try:
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="1024x1024"
        )
        image_url = response["data"][0]["url"]

        # Optional: Timestamped log
        timestamp = datetime.utcnow().isoformat()
        return JSONResponse(content={
            "image_url": image_url,
            "prompt": prompt,
            "timestamp": timestamp
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
