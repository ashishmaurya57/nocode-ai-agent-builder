import express from 'express';
import Automation from '../models/Automation.js';
import Agent from '../models/Agent.js';
import { runAgent } from '../services/agentRunner.js';
import { sendTelegramMessage } from '../utils/telegram.js';

const router = express.Router();

router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const automation = await Automation.findById(id);
    if (!automation || automation.trigger.type !== 'webhook') {
      return res.status(404).json({ message: 'Webhook automation not found' });
    }

    const agent = await Agent.findById(automation.agentId);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    const response = await runAgent({
      provider: agent.provider,
      apiKey: agent.apiKey,
      model: agent.model,
      prompt: agent.prompt,
      question: agent.prompt, // default question or allow req.body.question
      chatHistory: [],
      useRAG: agent.useRAG,
      embedProvider: agent.embedProvider,
      embedApiKey: agent.embedApiKey,
      memory: agent.memory,
      agentId: agent._id,
      documentPath: agent.documentPath
    });

    for (const action of automation.actions) {
      if (action.type === 'telegram') {
        await sendTelegramMessage(action.config.botToken, action.config.chatId, response);
      }
    }

    res.json({ response });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.status(500).json({ message: 'Webhook failed' });
  }
});

export default router;
