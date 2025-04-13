// emotion/humeClient.js
import fetch from 'node-fetch';

export async function analyzeEmotion(audioUrl, apiKey, voiceId) {
  const response = await fetch('https://api.hume.ai/v0/voice/analyze', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      voice_id: voiceId,
      url: audioUrl,
      models: {
        prosody: true,
        language: true
      }
    })
  });

  if (!response.ok) throw new Error(`Hume API error: ${response.status}`);
  return response.json();
}
