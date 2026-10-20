import config from '../../config/env.js';
import { generateLocalReply } from './localFallbackEngine.js';
import { callGemini } from './geminiProvider.js';
import { callGroq } from './groqProvider.js';
import { callOpenAI } from './openAiProvider.js';
import { AARA_CANONICAL_IDENTITY_REPLY } from './systemPrompts.js';

// Check if message is directly asking for identity
function isStrictIdentityQuery(msg = '') {
  const norm = msg.toLowerCase().trim().replace(/[^\w\s]/gi, '');
  return (
    norm === 'who are you' ||
    norm === 'what is your name' ||
    norm === 'who do you assist' ||
    norm === 'who are you and what do you do' ||
    norm === 'who are you aara'
  );
}

export async function getAssistantResponse({ message, mode = 'assistant', history = [] }) {
  // If the user explicitly asks identity, we always provide the canonical response
  if (isStrictIdentityQuery(message)) {
    return {
      reply: `${AARA_CANONICAL_IDENTITY_REPLY}\n\nI'm ready in **${getModeDisplayName(mode)}** mode. How would you like to start?`,
      provider: 'canonical-identity',
      model: 'aara-core-persona',
      isFallback: false
    };
  }

  const provider = config.aiProvider;
  const apiKey = config.aiApiKey;

  // If explicitly configured for local or missing key for cloud providers
  if (provider === 'local' || (!apiKey && provider !== 'custom' && !config.aiBaseUrl)) {
    const reply = generateLocalReply({ message, mode, history });
    return {
      reply,
      provider: 'local-engine',
      model: 'aara-offline-v1',
      isFallback: true,
      note: 'Zero-Cost Local Knowledge Mode'
    };
  }

  // Attempt external provider with automatic graceful fallback
  try {
    if (provider === 'gemini') {
      return await callGemini({
        apiKey,
        model: config.aiModel || 'gemini-1.5-flash',
        message,
        mode,
        history
      });
    }

    if (provider === 'groq') {
      return await callGroq({
        apiKey,
        model: config.aiModel || 'llama-3.3-70b-versatile',
        message,
        mode,
        history
      });
    }

    if (provider === 'openai' || provider === 'custom') {
      return await callOpenAI({
        apiKey,
        baseUrl: config.aiBaseUrl,
        model: config.aiModel || 'gpt-4o-mini',
        message,
        mode,
        history
      });
    }

    // Default to local if unknown provider
    const reply = generateLocalReply({ message, mode, history });
    return {
      reply,
      provider: 'local-engine',
      model: 'aara-offline-v1',
      isFallback: true
    };
  } catch (error) {
    console.warn(`External AI provider '${provider}' error: ${error.message}. Switching to Zero-Cost Local Engine.`);
    const reply = generateLocalReply({ message, mode, history });
    return {
      reply,
      provider: 'local-fallback',
      model: 'aara-offline-v1',
      isFallback: true,
      fallbackReason: error.message
    };
  }
}

function getModeDisplayName(mode) {
  switch (mode) {
    case 'coding':
      return 'Coding Mentor';
    case 'interview':
      return 'Interview Coach';
    case 'english':
      return 'English Practice';
    default:
      return 'Personal Assistant';
  }
}

export default {
  getAssistantResponse
};
