// server.js (vollständig konvertiert auf ESM-Syntax)
// server.js (vollständig auf ESM, mit Hume TTS und Emotion)
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import humeRoute from './routes/humeRoute.js';
import speakRoute from './routes/speakRoute.js'; // <- NEU

dotenv.config();

// 🔍 .env-Werte testen
console.log("🔑 Hume API Key:", process.env.HUME_API_KEY);

const app = express();
const PORT = process.env.PORT || 6066;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔁 Routen einbinden
app.use('/', humeRoute);
app.use('/', speakRoute);

// 🔄 Trigger-Funktionalität (optional)
let lastTrigger = null;

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

// 🔊 Start
app.get('/', (req, res) => {
  res.send('Wirklichkeits-API läuft. Endpunkte: POST /trigger, GET /status, POST /api/speak, POST /emotion/hume/analyze');
});

app.listen(PORT, () => {
  console.log(`🚀 Wirklichkeits-API läuft auf Port ${PORT}`);
});
