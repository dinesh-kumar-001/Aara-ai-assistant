import { Router } from 'express';
import { getAssistantResponse } from '../services/ai/index.js';
import conversationService from '../services/conversationService.js';

const router = Router();

/**
 * POST /api/chat
 * Body: { message, mode, conversationId, history }
 */
router.post('/', async (req, res, next) => {
  try {
    const { message, mode = 'assistant', conversationId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.'
      });
    }

    const activeConversationId =
      conversationId || 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Fetch existing conversation if present to provide context history
    let existingConvo = await conversationService.getById(activeConversationId);
    const history = existingConvo?.messages || [];

    // Save user message
    const userMsg = {
      role: 'user',
      content: message.trim(),
      mode,
      timestamp: new Date().toISOString()
    };
    await conversationService.addMessage(activeConversationId, userMsg);

    // Generate AI response
    const aiResult = await getAssistantResponse({
      message: message.trim(),
      mode,
      history
    });

    // Save assistant message
    const assistantMsg = {
      role: 'assistant',
      content: aiResult.reply,
      engine: {
        provider: aiResult.provider,
        model: aiResult.model,
        isFallback: aiResult.isFallback
      },
      timestamp: new Date().toISOString()
    };
    const saveResult = await conversationService.addMessage(activeConversationId, assistantMsg);

    return res.status(200).json({
      success: true,
      conversationId: activeConversationId,
      reply: aiResult.reply,
      engine: {
        provider: aiResult.provider,
        model: aiResult.model,
        isFallback: aiResult.isFallback,
        note: aiResult.note
      },
      mode,
      messageId: assistantMsg.id,
      conversation: saveResult?.conversation
    });
  } catch (err) {
    next(err);
  }
});

export default router;
