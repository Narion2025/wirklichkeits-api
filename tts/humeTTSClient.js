import fetch from 'node-fetch';

/**
 * Wandelt Text über Hume.ai TTS in Sprache um (mit Voice-ID)
 * @param {string} text - Text, den der GPT sprechen soll
 * @param {string} voiceId - Die Stimme aus der Hume Voice Library
 * @param {string} apiKey - Dein API Key aus der .env
 * @returns {Promise<Buffer>} - MP3-Audio als Buffer
 */
export async function speakWithHumeVoice(text, voiceId, apiKey) {
  const response = await fetch('https://api.hume.ai/v0/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hume-Api-Key': apiKey
    },
    body: JSON.stringify({
      utterances: [
        {
          text: text,
          voice: {
            id: voiceId,
            provider: "HUME_AI"
          }
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Hume TTS API Fehler: ${response.status} - ${errText}`);
  }

  const json = await response.json();
  const base64Audio = json?.generations?.[0]?.audio;

  if (!base64Audio) {
    throw new Error("Hume API hat kein Audio zurückgegeben.");
  }

  return Buffer.from(base64Audio, 'base64');
}
