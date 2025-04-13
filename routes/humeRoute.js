import express from 'express';
import { analyzeEmotion } from '../emotion/humeClient.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/emotion/hume/analyze', async (req, res) => {
  const { audioUrl } = req.body;
  const apiKey = process.env.HUME_API_KEY;

  console.log("🧪 DEBUG PARAMS:", {
    audioUrl,
    apiKeyPresent: !!apiKey,
  });

  // ✅ Nur noch audioUrl + apiKey prüfen!
  if (!audioUrl || !apiKey) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const data = await analyzeEmotion(audioUrl, apiKey);
    res.json(data);
  } catch (err) {
    console.error("❌ Emotion API Fehler:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;


