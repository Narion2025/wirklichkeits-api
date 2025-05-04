// 📦 INSTALLIERE ERST:
// npm install express ws axios dotenv

import express from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const voiceId = process.env.VOICE_ID;
const elevenKey = process.env.ELEVENLABS_API_KEY;

if (!voiceId || !elevenKey) {
  console.error("VOICE_ID oder ELEVENLABS_API_KEY fehlen in .env");
  process.exit(1);
}

app.use(express.json());
app.use(express.static('public')); // 🔥 Damit index.html ausgeliefert wird!

app.post('/speak', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Kein Text übergeben');

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ text }));
    }
  });

  res.send('Text empfangen');
});

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Frontend verbunden');

  ws.on('message', (msg) => {
    const { text } = JSON.parse(msg);
    if (!text) return;

    const elevenWs = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      headers: {
        'xi-api-key': elevenKey,
      },
    });

    elevenWs.on('open', () => {
      elevenWs.send(JSON.stringify({ text, model_id: 'eleven_
