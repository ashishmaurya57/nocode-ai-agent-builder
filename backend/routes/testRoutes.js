import express from 'express';
import Automation from '../models/Automation.js';
import Agent from '../models/Agent.js';
import { runAgent } from '../services/agentRunner.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

router.post('/trigger/:id', async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id).lean();
    if (!automation || !automation.isActive) {
      return res.status(404).json({ message: 'Automation not found or inactive' });
    }

    const agent = await Agent.findById(automation.agentId);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    const response = await runAgent({
      provider: agent.provider,
      apiKey: agent.apiKey,
      model: agent.model,
      prompt: agent.prompt,
      question: agent.prompt,
      chatHistory: [],
      useRAG: agent.useRAG,
      embedProvider: agent.embedProvider,
      embedApiKey: agent.embedApiKey,
      memory: agent.memory,
      agentId: agent._id,
      documentPath: agent.documentPath
    });

    for (const action of automation.actions) {
      if (action.type === 'email') {
        await sendEmail(action.config.email, 'Automated Email', response);
      }
    }

    res.json({ success: true, message: 'Email sent manually' });
  } catch (err) {
    console.error('❌ Error manually triggering automation:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
