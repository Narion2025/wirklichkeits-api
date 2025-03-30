const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`🔊 Wirklichkeits-API bereit auf Port ${port}`);
});