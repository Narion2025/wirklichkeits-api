// 📦 INSTALL:
// npm install express ws axios dotenv elevenlabs play-sound

const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const { stream } = require('elevenlabs');
const player = require('play-sound')();
const fs = require('fs');
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

// 📡 Direktanfrage mit Audioausgabe (POST /narion-speak)
app.post('/narion-speak', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Text fehlt');
  console.log('🗣 Narion sagt (API):', text);

  try {
    const audioStream = await stream({
      apiKey: process.env.ELEVENLABS_API_KEY,
      voiceId: process.env.VOICE_ID,
      text,
    });

    const filePath = './narion_output.mp3';
    const file = fs.createWriteStream(filePath);
    audioStream.pipe(file);

    file.on('finish', () => {
      player.play(filePath, (err) => {
        if (err) console.error('🎧 Fehler beim Abspielen:', err);
      });
    });

    res.send('Narion spricht jetzt.');
  } catch (err) {
    console.error('⚠️ Fehler bei ElevenLabs:', err);
    res.status(500).send('Fehler beim Sprechen');
  }
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
      console.error('❌ ElevenLabs WS error:', err);
    });

    elevenWs.on('close', (code, reason) => {
      console.warn(`🔌 ElevenLabs WebSocket geschlossen: ${code} – ${reason}`);
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
