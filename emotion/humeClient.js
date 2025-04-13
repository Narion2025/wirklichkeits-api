import fetch from 'node-fetch';

export async function analyzeEmotion(audioUrl, apiKey) {
  const response = await fetch("https://api.hume.ai/v0/batch/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hume-Api-Key": apiKey
    },
    body: JSON.stringify({
      models: { prosody: {} },
      input: [{ url: audioUrl }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Hume-API Fehler: ${response.status} - ${errText}`);
  }

  const result = await response.json();

  // 🔍 Kompakte Score-Extraktion
  const scores = {};
  const prediction = result?.results?.predictions?.[0];

  if (prediction?.results?.prosody?.predictions?.[0]?.emotions) {
    const prosodyScores = prediction.results.prosody.predictions[0].emotions;
    for (const { name, score } of prosodyScores) {
      scores[name] = score;
    }
  }

  return scores;
}

}
