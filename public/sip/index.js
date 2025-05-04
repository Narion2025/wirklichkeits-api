// 📦 INSTALL:
// npm install express ws axios dotenv

const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Serve index.html at root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// 🔐 .env laden & prüfen
const voiceId = process.env.VOICE_ID;
const elevenKey = process.env.ELEVENLABS_API_KEY;
const customGptId = process.env.CUSTOM_GPT_ID;
const customGptName = process.env.CUSTOM_GPT_NAME;

if (!voiceId || !elevenKey) {
  console.error("VOICE_ID oder ELEVENLABS_API_KEY fehlen in .env");
  process.exit(1);
}

app.use(express.json());
app.use(express.static('public')); // Das Frontend liegt hier

// 🤖 GPT Webhook Endpoint
app.post('/gpt-webhook', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });
  
  console.log(`🤖 ${customGptName || 'GPT'} says:`, text);

  // an WebSocket-Clients senden
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ text, source: 'gpt' }));
    }
  });

  res.status(200).json({ 
    status: 'success', 
    message: 'Text received and processing started',
    gpt_id: customGptId
  });
});

// POST-Endpunkt für Text
app.post('/speak', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('No text provided');
  console.log('Text empfangen:', text);

  // an WebSocket-Clients senden
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ text }));
    }
  });

  res.send('Text gesendet');
});

// WebSocket-Server für ElevenLabs-Stream
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client verbunden');

  ws.on('message', (msg) => {
    try {
      const { text } = JSON.parse(msg.toString());
      if (!text) return;

      console.log('Streaming Text:', text);

      const elevenWs = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        headers: {
          'xi-api-key': elevenKey,
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
        console.error('Fehler bei ElevenLabs:', err);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ error: 'ElevenLabs connection failed' }));
        }
      });

      elevenWs.on('close', () => {
        console.log('ElevenLabs connection closed');
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

// Server starten
const server = app.listen(port, () => {
  console.log(`🎙 Wirklichkeits-API läuft auf Port ${port}`);
  console.log(`💬 GPT Webhook URL: http://localhost:${port}/gpt-webhook`);
});

// WebSocket-Upgrade
server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});