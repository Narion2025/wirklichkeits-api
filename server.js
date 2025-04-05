const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 10001;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



app.use(express.json());


let lastTrigger = null;

app.get('/', (req, res) => {
  res.send('Wirklichkeits-API läuft. Endpunkte: POST /trigger, GET /status');
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

app.listen(PORT, () => {
  console.log(`🔊 Wirklichkeits-API bereit auf Port ${port}`);
});
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// NEU: Voice-Ausgabe via ElevenLabs
app.post('/api/speak', async (req, res) => {
  const { text } = req.body;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
  
  if (!text) {
    return res.status(400).json({ error: 'Kein Text angegeben.' });
  }

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
    console.error('🧨 ElevenLabs Fehler:', error.response?.data || error.message);
    res.status(500).json({ error: 'Fehler bei ElevenLabs-Anfrage.' });
  }
});
