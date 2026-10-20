import { getSystemPrompt } from './systemPrompts.js';

export async function callGemini({ apiKey, model, message, mode, history = [] }) {
  const selectedModel = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

  const systemInstruction = getSystemPrompt(mode);

  // Format history for Gemini
  const contents = [];

  // Recent messages for context (up to last 10)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'assistant') {
      contents.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  }

  // Add current message
  contents.push({ role: 'user', parts: [{ text: message }] });

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1500
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const reply = candidate?.content?.parts?.map((p) => p.text).join('') || '';

  if (!reply) {
    throw new Error('Empty response received from Gemini');
  }

  return {
    reply,
    provider: 'gemini',
    model: selectedModel,
    isFallback: false
  };
}

export default callGemini;
