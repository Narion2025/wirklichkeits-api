import fetch from 'node-fetch';

/**
 * Sendet Text an Hume TTS und liefert MP3-Audio zurück
 * @param {string} text
 * @param {string} voiceId
 * @param {string} apiKey
 * @returns {Promise<Buffer>}
 */
export async function speakWithHumeVoice(text, voiceId, apiKey) {
  const response = await fetch('https://api.hume.ai/v0/tts/stream/file', {
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
            provider: "HUME_AI" // 💡 entscheidend!
          }
        }
      ],
      format: {
        type: "mp3"
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Hume TTS API Fehler: ${response.status} - ${errText}`);
  }

  const audioBuffer = await response.buffer();
  console.log("📦 MP3-Buffer empfangen:", audioBuffer.length, "Bytes");
  return audioBuffer;
}

