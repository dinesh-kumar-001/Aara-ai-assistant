import config from '../../config/env.js';
import { generateLocalReply } from './localFallbackEngine.js';
import { callGemini, pingGemini } from './geminiProvider.js';
import { callGroq } from './groqProvider.js';
import { callOpenAI } from './openAiProvider.js';
import { AARA_CANONICAL_IDENTITY_REPLY } from './systemPrompts.js';

// Status tracking for provider connectivity
let lastVerifiedProvider = null;
let lastVerificationTime = null;
let lastProviderError = null;
let isRealAiVerified = false;

// Check if message is strictly asking for identity
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

/**
 * Verify whether configured provider is live and authenticated
 * Never claims real AI is connected unless a real request succeeds.
 */
export async function verifyAiStatus() {
  const provider = config.aiProvider;
  const apiKey = config.aiApiKey;

  if (!apiKey) {
    isRealAiVerified = false;
    lastProviderError = 'No API key configured in backend/.env';
    return {
      connected: false,
      isRealAI: false,
      status: 'demo_mode',
      provider: 'demo',
      model: 'local-demo',
      message: 'Running in offline demo mode. Set AI_PROVIDER=gemini and AI_API_KEY in backend/.env to connect real AI.'
    };
  }

  try {
    if (provider === 'gemini') {
      const ping = await pingGemini(apiKey, config.aiModel || 'gemini-1.5-flash');
      if (ping.ok) {
        isRealAiVerified = true;
        lastVerifiedProvider = 'gemini';
        lastVerificationTime = new Date().toISOString();
        lastProviderError = null;
        return {
          connected: true,
          isRealAI: true,
          status: 'connected',
          provider: 'gemini',
          model: config.aiModel || 'gemini-1.5-flash',
          message: 'Connected to Google Gemini API.'
        };
      } else {
        isRealAiVerified = false;
        lastProviderError = ping.error;
        return {
          connected: false,
          isRealAI: false,
          status: 'error',
          provider: 'gemini',
          model: config.aiModel || 'gemini-1.5-flash',
          message: `Gemini verification failed: ${ping.error}`
        };
      }
    }

    // For other providers (Groq/OpenAI)
    isRealAiVerified = Boolean(apiKey);
    return {
      connected: isRealAiVerified,
      isRealAI: isRealAiVerified,
      status: isRealAiVerified ? 'connected' : 'demo_mode',
      provider,
      model: config.aiModel || 'default',
      message: isRealAiVerified ? `Provider ${provider} configured with API key.` : 'No API key configured.'
    };
  } catch (err) {
    isRealAiVerified = false;
    lastProviderError = err.message;
    return {
      connected: false,
      isRealAI: false,
      status: 'error',
      provider,
      message: `Provider error: ${err.message}`
    };
  }
}

/**
 * Main entry point for generating assistant responses
 */
export async function getAssistantResponse({ message, mode = 'assistant', history = [] }) {
  // 1. Strict Identity Query check
  if (isStrictIdentityQuery(message)) {
    return {
      reply: `${AARA_CANONICAL_IDENTITY_REPLY}\n\nI'm ready in **${getModeDisplayName(mode)}** mode. How would you like to start?`,
      provider: 'canonical-identity',
      model: 'aara-core-persona',
      isRealAI: true,
      isFallback: false
    };
  }

  const provider = config.aiProvider;
  const apiKey = config.aiApiKey;

  // 2. If no API key configured or explicitly in demo mode
  if (!apiKey || provider === 'demo' || provider === 'local') {
    const reply = generateLocalReply({ message, mode, history });
    return {
      reply,
      provider: 'demo',
      model: 'offline-demo-v1',
      isRealAI: false,
      isFallback: true,
      notice: 'Demo Mode: Real AI not connected. Add AI_API_KEY in backend/.env to enable live LLM answers.'
    };
  }

  // 3. Attempt genuine LLM call
  try {
    let result;

    if (provider === 'gemini') {
      result = await callGemini({
        apiKey,
        model: config.aiModel || 'gemini-1.5-flash',
        message,
        mode,
        history
      });
    } else if (provider === 'groq') {
      result = await callGroq({
        apiKey,
        model: config.aiModel || 'llama-3.3-70b-versatile',
        message,
        mode,
        history
      });
    } else if (provider === 'openai' || provider === 'custom') {
      result = await callOpenAI({
        apiKey,
        baseUrl: config.aiBaseUrl,
        model: config.aiModel || 'gpt-4o-mini',
        message,
        mode,
        history
      });
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    // Mark as verified on successful response
    isRealAiVerified = true;
    lastVerifiedProvider = provider;
    lastVerificationTime = new Date().toISOString();
    lastProviderError = null;

    return {
      reply: result.reply,
      provider: result.provider,
      model: result.model,
      isRealAI: true,
      isFallback: false
    };
  } catch (error) {
    console.error(`Error calling ${provider} AI model:`, error.message);
    lastProviderError = error.message;

    // Graceful fallback with clear explanation to user
    const fallbackReply =
      `⚠️ **[Real AI Request Error]**\n` +
      `Failed to retrieve response from **${provider}**: ${error.message}\n\n` +
      `---\n\n` +
      generateLocalReply({ message, mode, history });

    return {
      reply: fallbackReply,
      provider: `${provider}-fallback`,
      model: config.aiModel || 'fallback-v1',
      isRealAI: false,
      isFallback: true,
      error: error.message
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
  getAssistantResponse,
  verifyAiStatus
};
