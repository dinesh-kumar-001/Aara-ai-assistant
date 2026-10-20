import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPrompt } from './systemPrompts.js';

/**
 * Genuine Gemini API Provider Adapter using official @google/generative-ai SDK.
 */

// Cache client instances per API key
let cachedClient = null;
let cachedKey = null;

function getClient(apiKey) {
  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new GoogleGenerativeAI(apiKey);
    cachedKey = apiKey;
  }
  return cachedClient;
}

/**
 * Ping Gemini with a tiny prompt to verify API key & connectivity
 */
export async function pingGemini(apiKey, modelName = 'gemini-1.5-flash') {
  if (!apiKey) return { ok: false, error: 'No API key configured.' };
  try {
    const genAI = getClient(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      generationConfig: { maxOutputTokens: 5 }
    });
    const text = result.response.text();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Execute chat completion via Google Gemini
 */
export async function callGemini({ apiKey, model, message, mode = 'assistant', history = [] }) {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured in backend/.env.');
  }

  const selectedModel = model || 'gemini-1.5-flash';
  const genAI = getClient(apiKey);

  const systemInstruction = getSystemPrompt(mode);

  const generativeModel = genAI.getGenerativeModel({
    model: selectedModel,
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemInstruction }]
    }
  });

  // Prepare recent history (up to last 10 messages for context)
  const recentHistory = history.slice(-10);
  const formattedContents = [];

  for (const msg of recentHistory) {
    if (!msg.content || !msg.role) continue;
    if (msg.role === 'user') {
      formattedContents.push({
        role: 'user',
        parts: [{ text: msg.content }]
      });
    } else if (msg.role === 'assistant') {
      formattedContents.push({
        role: 'model',
        parts: [{ text: msg.content }]
      });
    }
  }

  // Add the current user message
  formattedContents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    const result = await generativeModel.generateContent({
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    });

    const response = await result.response;
    const reply = response.text();

    if (!reply || !reply.trim()) {
      throw new Error('Received an empty response from Gemini model.');
    }

    return {
      reply: reply.trim(),
      provider: 'gemini',
      model: selectedModel,
      isRealAI: true,
      isFallback: false
    };
  } catch (error) {
    const errMessage = error.message || '';

    // Handle specific common error cases with clear actionable guidance
    if (errMessage.includes('API_KEY_INVALID') || errMessage.includes('400')) {
      throw new Error(
        'Invalid Gemini API key. Please check your AI_API_KEY in backend/.env or generate a free key from Google AI Studio.'
      );
    }
    if (errMessage.includes('RESOURCE_EXHAUSTED') || errMessage.includes('429')) {
      throw new Error(
        'Gemini free-tier rate limit / quota exceeded. Please wait a moment and try again.'
      );
    }
    if (errMessage.includes('ENOTFOUND') || errMessage.includes('fetch failed')) {
      throw new Error(
        'Network error: Unable to reach Google Gemini API servers. Please check your internet connection.'
      );
    }

    throw error;
  }
}

export default {
  callGemini,
  pingGemini
};
