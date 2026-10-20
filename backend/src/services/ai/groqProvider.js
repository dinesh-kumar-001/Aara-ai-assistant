import { getSystemPrompt } from './systemPrompts.js';

export async function callGroq({ apiKey, model, message, mode, history = [] }) {
  const selectedModel = model || 'llama-3.3-70b-versatile';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const systemPrompt = getSystemPrompt(mode);

  const messages = [{ role: 'system', content: systemPrompt }];

  // Append recent history
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // Current prompt
  messages.push({ role: 'user', content: message });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages,
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || '';

  if (!reply) {
    throw new Error('Empty response received from Groq');
  }

  return {
    reply,
    provider: 'groq',
    model: selectedModel,
    isFallback: false
  };
}

export default callGroq;
