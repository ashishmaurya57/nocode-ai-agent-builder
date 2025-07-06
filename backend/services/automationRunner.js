import cron from 'node-cron';
import Automation from '../models/Automation.js';
import Agent from '../models/Agent.js';
import { runAgent } from './agentRunner.js';
import { sendTelegramMessage } from '../utils/telegram.js';
import { sendEmail } from '../utils/sendEmail.js';

export const scheduleAllAutomations = async () => {
  const automations = await Automation.find({ isActive: true }).lean();

  automations.forEach(auto => {
    if (auto.trigger.type === 'cron' && auto.trigger.schedule) {
      cron.schedule(
        auto.trigger.schedule.trim(), // 🔍 Trim to avoid whitespace issues
        async () => {
          console.log(`🔁 Running automation: ${auto.name}`);

          try {
            const agent = await Agent.findById(auto.agentId);
            if (!agent) return console.error('⚠️ Agent not found for automation');

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

            for (const action of auto.actions) {
              if (action.type === 'telegram') {
                const { botToken, chatId } = action.config;
                await sendTelegramMessage(botToken, chatId, response);
              }

              if (action.type === 'email') {
                const { to, encryptedPassword } = action.config;
                const subject = `Automation: ${auto.name}`;
                await sendEmail(to, subject, response, encryptedPassword);
              }
            }

            console.log(`✅ Automation "${auto.name}" completed.`);
          } catch (err) {
            console.error(`❌ Automation "${auto.name}" failed:`, err.message);
          }
        },
        { timezone: auto.trigger.timezone || 'UTC' }
      );
    }
  });

  console.log('✅ All CRON-based automations scheduled');
};
