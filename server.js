// server.js (vollständig konvertiert auf ESM-Syntax)

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
import humeRoute from './routes/humeRoute.js';
dotenv.config();

// 🧪 Testausgabe zur Prüfung der .env-Datei:
console.log("💬 Hume VoiceID:", process.env.VOICE_ID);
console.log("🔑 Hume API Key:", process.env.HUME_API_KEY);

const app = express();
const PORT = process.env.PORT || 6066;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let lastTrigger = null;

app.get('/', (req, res) => {
  res.send('Wirklichkeits-API läuft. Endpunkte: POST /trigger, GET /status, POST /api/speak');
});

// Hume Middleware anbinden
app.use('/', humeRoute);

app.post('/trigger', (req, res) => {
  lastTrigger = req.body;
  console.log('🌀 Trigger gesetzt:', lastTrigger);
  res.send('Trigger empfangen und gesetzt!');
});

app.get('/status', (req, res) => {
  if (!lastTrigger) {
    res.send('Noch kein Trigger gesetzt.');
  } else {
    res.json(lastTrigger);
  }
});

app.post('/clear', (req, res) => {
  lastTrigger = null;
  res.send('Trigger wurde gelöscht.');
});

app.get('/terms', (req, res) => {
  res.send('Diese API speichert keine personenbezogenen Daten.');
});

// 🧠 ElevenLabs Sprach-API
app.post('/api/speak', async (req, res) => {
  const { text } = req.body;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = process.env.VOICE_ID;

  console.log("▶️ Text empfangen:", text);
  if (!text) return res.status(400).json({ error: 'Kein Text angegeben.' });

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.6
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);

  } catch (error) {
    const errMsg = await error.response?.data?.text?.() || error.message;
    console.error('🧨 ElevenLabs Fehler:', errMsg);
    res.status(500).json({ error: 'Fehler bei ElevenLabs-Anfrage.' });
  }
});

app.listen(PORT, () => {
  console.log(`🔊 Wirklichkeits-API bereit auf Port ${PORT}`);
});
