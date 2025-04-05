const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 6066;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let lastTrigger = null;

app.get('/', (req, res) => {
  res.send('Wirklichkeits-API läuft. Endpunkte: POST /trigger, GET /status, POST /api/speak');
});

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

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🔊 Wirklichkeits-API bereit auf http://127.0.0.1:${PORT}`);
});
