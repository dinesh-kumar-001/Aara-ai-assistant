import { Router } from 'express';
import config from '../config/env.js';
import { getDbStatus } from '../config/db.js';

const router = Router();

router.get('/status', (req, res) => {
  const dbStatus = getDbStatus();
  const hasKey = Boolean(config.aiApiKey);

  res.json({
    success: true,
    app: {
      name: 'Aara',
      tagline: 'Your personal assistant, always ready to help.',
      owner: 'Mr. Dinesh Kumar',
      personality: 'Friendly, polite, intelligent, supportive, and natural.',
      version: '1.0.0'
    },
    database: {
      connected: dbStatus.connected,
      type: dbStatus.type,
      storageNote: dbStatus.connected
        ? 'Connected to live MongoDB instance'
        : 'Running seamlessly in Zero-Cost Local Storage fallback mode'
    },
    ai: {
      configuredProvider: config.aiProvider,
      hasApiKey: hasKey,
      model: config.aiModel || (config.aiProvider === 'local' ? 'aara-offline-v1' : 'default'),
      isZeroCostMode: config.aiProvider === 'local' || !hasKey,
      note: hasKey
        ? `Cloud AI enabled via ${config.aiProvider}`
        : 'Zero-Cost Local Fallback Engine active (No external API key needed)'
    },
    modes: [
      {
        id: 'assistant',
        name: 'Personal Assistant',
        icon: 'bi-stars',
        description: 'General questions, daily planning, everyday help & productivity.'
      },
      {
        id: 'coding',
        name: 'Coding Mentor',
        icon: 'bi-code-slash',
        description: 'Java, MERN Stack, React, Node, DSA, SQL & real-time debugging.'
      },
      {
        id: 'interview',
        name: 'Interview Coach',
        icon: 'bi-award',
        description: 'Mock interviews, technical evaluations & STAR behavioral practice.'
      },
      {
        id: 'english',
        name: 'English Practice',
        icon: 'bi-chat-heart',
        description: 'Conversational fluency, grammar corrections & professional vocabulary.'
      }
    ]
  });
});

export default router;
