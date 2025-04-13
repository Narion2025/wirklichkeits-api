import fetch from 'node-fetch';

/**
 * Führt eine Analyse der Stimme über HumeAI aus (Prosody-Modell).
 * @param {string} audioUrl - Öffentliche URL zur Audiodatei
 * @param {string} apiKey - Dein Hume API-Key
 * @returns {Promise<Object>} - Die Analyse-Ergebnisse
 */
export async function analyzeEmotion(audioUrl, apiKey) {
  const response = await fetch("https://api.hume.ai/v0/batch/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hume-Api-Key": apiKey
    },
    body: JSON.stringify({
      models: {
        prosody: {}
      },
      input: [
        { url: audioUrl }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Hume-API Fehler: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  return result;
}

}
