import fetch from 'node-fetch';

/**
 * Analysiert eine Audiodatei mit Hume's Prosody-Modell.
 * @param {string} audioUrl - Die URL zur Audiodatei (z. B. MP3/WAV öffentlich erreichbar)
 * @param {string} apiKey - Dein Hume API-Key
 * @returns {Promise<Object>} - Das Ergebnis der Analyse
 */
export async function analyzeEmotion(audioUrl, apiKey) {
  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hume-Api-Key': apiKey,
    },
    body: JSON.stringify({
      models: { prosody: {} }, // du kannst auch andere Modelle ergänzen
      input: [{ url: audioUrl }]
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Hume API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data;
}
