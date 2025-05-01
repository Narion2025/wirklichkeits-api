// server.js (vollständig konvertiert auf ESM-Syntax)
// server.js (vollständig auf ESM, mit Hume TTS und Emotion)
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import humeRoute from './routes/humeRoute.js';
import speakRoute from './routes/speakRoute.js'; // <- NEU
import path from 'path';

dotenv.config();

// 🔍 .env-Werte testen
console.log("🔑 Hume API Key:", process.env.HUME_API_KEY);

const app = express();
const PORT = process.env.PORT || 6066;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 🔓 Öffentliche Intelligenz- und Konfig-Daten
app.use('/sip', express.static('public/sip'));
app.use('/data', express.static('public/data'));
app.use('/audio', express.static('public/audio')); // falls du doch zentral darauf zugreifen willst
app.use(express.static('public'));

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
app.post('/api/state/update', (req, res) => {
  const newData = req.body;
  const filePath = path.join(process.cwd(), 'public', 'state.yaml');

  fs.readFile(filePath, 'utf8', (err, existingData) => {
    let updated = '';
    if (!err && existingData) {
      const lines = existingData.split('\n').filter(line =>
        !line.startsWith('message:') &&
        !line.startsWith('active_knoten:') &&
        !line.startsWith('active_filter:') &&
        !line.startsWith('active_spiralen:')
      );
      updated = [...lines,
        `message: ${newData.message || ''}`,
        `active_knoten: ${newData.active_knoten?.join(', ') || ''}`,
        `active_filter: ${newData.active_filter?.join(', ') || ''}`,
        `active_spiralen: ${newData.active_spiralen?.join(', ') || ''}`
      ].join('\n');
    }

    fs.writeFile(filePath, updated, 'utf8', err => {
      if (err) {
        res.status(500).send('Fehler beim Schreiben.');
      } else {
        res.send('state.yaml aktualisiert.');
      }
    });
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Wirklichkeits-API läuft auf Port ${PORT}`);
});
