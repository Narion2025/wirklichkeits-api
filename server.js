// server.js für Render.com Deployment
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let lastTrigger = {};

// POST /trigger
app.post('/trigger', (req, res) => {
  const triggerData = req.body;
  lastTrigger = triggerData;
  console.log('✅ Neuer Trigger gesetzt:', triggerData);
  res.send('Trigger empfangen und gesetzt!');
});

// GET /status
app.get('/status', (req, res) => {
  if (!lastTrigger || Object.keys(lastTrigger).length === 0) {
    return res.status(404).send('Noch kein Trigger gesetzt.');
  }
  res.json(lastTrigger);
});

// Root Info
app.get('/', (req, res) => {
  res.send('🌐 Wirklichkeits-API läuft. Endpunkte: POST /trigger, GET /status');
});

app.listen(PORT, () => {
  console.log(`🌐 Wirklichkeits-API bereit auf Port ${PORT}`);
});