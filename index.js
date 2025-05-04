// 📦 INSTALL:
// npm install express ws axios dotenv elevenlabs play-sound cors

const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const { stream } = require('elevenlabs');
const player = require('play-sound')();
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ✨ Configure middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

let lastText = '';

// 🤖 GPT Webhook Endpoint - Use this in your custom GPT actions
app.post('/gpt-webhook', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });
  
  console.log('📩 Received from GPT:', text);
  lastText = text;
  
  try {
    // Stream to connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ command: 'initiate_stream', text }));
      }
    });
    
    res.status(200).json({ 
      status: 'success', 
      message: 'Audio streaming initiated',
      streaming_url: `${req.protocol}://${req.get('host')}/stream?session=${Date.now()}`
    });
  } catch (error) {
    console.error('⚠️ Error handling GPT webhook:', error);
    res.status(500).json({ error: 'Failed to process text' });
  }
});

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
  console.log('👋 Client connected to WebSocket');

  ws.on('message', async (msg) => {
    try {
      const { text, action } = JSON.parse(msg);
      
      if (action === 'request_stream' && text) {
        console.log('🔄 Streaming requested for text:', text);
        
        const elevenWs = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/${process.env.VOICE_ID}/stream-input?model_id=eleven_monolingual_v1`, {
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY
          }
        });

        elevenWs.on('open', () => {
          // First message - configuration
          const configMessage = {
            text: " ", // Empty initial text
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            },
            xi_api_key: process.env.ELEVENLABS_API_KEY
          };
          
          elevenWs.send(JSON.stringify(configMessage));
          
          // Second message - the actual text
          setTimeout(() => {
            const textMessage = { text: text, try_trigger_generation: true };
            elevenWs.send(JSON.stringify(textMessage));
            
            // Final message - indicates end of text
            setTimeout(() => {
              elevenWs.send(JSON.stringify({ text: "", try_trigger_generation: true }));
            }, 100);
          }, 100);
        });

        elevenWs.on('message', (data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        });

        elevenWs.on('error', (err) => {
          console.error('❌ ElevenLabs WS error:', err);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ error: 'Failed to connect to ElevenLabs' }));
          }
        });

        elevenWs.on('close', (code, reason) => {
          console.log(`🔌 ElevenLabs WebSocket closed: ${code} - ${reason}`);
        });
      }
    } catch (err) {
      console.error('⚠️ Error processing WebSocket message:', err);
    }
  });

  // Send last text if available
  if (lastText) {
    ws.send(JSON.stringify({ text: lastText }));
  }

  ws.on('close', () => {
    console.log('👋 Client disconnected from WebSocket');
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