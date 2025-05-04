// 📦 INSTALL:
// npm install express ws axios dotenv

const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ✨ Serve frontend for testing
app.use(express.static('public'));
app.use(express.json());

let lastText = '';

app.post('/speak', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('No text provided');
  lastText = text;
  console.log('Received text:', text);
  res.send('Text received');

  // Trigger stream for all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ text }));
    }
  });
});

// 🌐 WebSocket for frontend audio streaming
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Frontend connected');

  ws.on('message', async (msg) => {
    const { text } = JSON.parse(msg);
    if (!text) return;

    const elevenWs = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${process.env.VOICE_ID}/stream`, {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    });

    elevenWs.on('open', () => {
      elevenWs.send(JSON.stringify({ text, model_id: 'eleven_monolingual_v1' }));
    });

    elevenWs.on('message', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    elevenWs.on('error', (err) => {
      console.error('ElevenLabs WS error:', err);
    });
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});
