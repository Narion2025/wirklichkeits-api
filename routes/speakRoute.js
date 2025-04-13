import express from 'express';
import { speakWithHumeVoice } from '../tts/humeTTSClient.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/api/speak', async (req, res) => {
  const { text, voiceId } = req.body;
  const apiKey = process.env.HUME_API_KEY;

  console.log("🗣️ GPT sagt:", text);
  console.log("🎙️ Verwende VoiceID:", voiceId);

  if (!text || !voiceId || !apiKey) {
    return res.status(400).json({ error: 'Fehlende Parameter: text, voiceId oder API key' });
  }

  try {
    const audioBuffer = await speakWithHumeVoice(text, voiceId, apiKey);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="voice.mp3"');
    res.send(audioBuffer);
  } catch (err) {
    console.error("❌ Fehler bei Hume TTS:", err.message);
    res.status(500).json({
      error: err.message || 'Text-to-Speech fehlgeschlagen'
    });
  }
});

export default router;
