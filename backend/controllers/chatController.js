import Agent from '../models/Agent.js';
import Chat from '../models/Chat.js';
import { runAgent } from '../services/agentRunner.js';
import { embedAndStore } from '../utils/vectorStore.js';

export const getChatHistory = async (req, res) => {
  try {
    const { id: agentId } = req.params;
    const userId = req.user.uid;

    const agent = await Agent.findOne({ _id: agentId, userId });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    const chat = await Chat.findOne({ agentId, userId });
    return res.json({ messages: chat ? chat.messages : [] });
  } catch (err) {
    console.error('❌ Error fetching chat history:', err);
    return res.status(500).json({ message: 'Error fetching chat history' });
  }
};
 export const runAgentChat = async (req, res) => {
  try {
    const { id: agentId } = req.params;
    const { message } = req.body;

    const userId = req.user.uid;

    const agent = await Agent.findOne({ _id: agentId, userId });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    let chat = await Chat.findOne({ agentId, userId });
    if (!chat) chat = new Chat({ agentId, userId, messages: [] });

    chat.messages.push({ role: 'user', content: message });

    const history = chat.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const aiResponse = await runAgent({
      provider: agent.provider,
      apiKey: agent.apiKey,
      model: agent.model?.toString?.() || agent.model,  // ✅ Prevent [Function: $model]
      prompt: agent.prompt,
      question: message,
      chatHistory: history,
      useRAG: agent.useRAG,
      embedProvider: agent.embedProvider,
      embedApiKey: agent.embedApiKey,
      memory: agent.memory,
      agentId: agent._id,
      vectorNamespace: agent.vectorNamespace,
      vectorTableName: agent.vectorTableName,
      // 👇 Optional safeguard
      shouldEmbed: false  // ✅ Avoid re-embedding unless explicitly required
    });

    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    return res.json({ response: aiResponse });

  } catch (err) {
    console.error('❌ Error running agent chat:', err);
    return res.status(500).json({ message: 'Error running agent chat' });
  }
};
export const embedPdfHandler = async (req, res) => {
  try {
    const { id: agentId } = req.params;
    const userId = req.user.uid;
    const agent = await Agent.findOne({ _id: agentId, userId });

    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = req.file.path;

    const embedProvider = agent.useRAG ? agent.embedProvider : 'huggingface';
    const embedApiKey = agent.useRAG ? agent.embedApiKey : null;
    const memory = agent.memory || 'In-Memory'; // fallback

    await embedAndStore({
      documentPath: filePath,
      question: 'dummy', // required for vector search API
      embedProvider,
      embedApiKey,
      memory,
      agentId,
    });

    return res.status(200).json({
      message: '✅ Document embedded successfully. You can now ask questions from it.',
    });

  } catch (err) {
    console.error('❌ Error embedding document:', err);
    return res.status(500).json({ message: 'Error embedding document' });
  }
};
