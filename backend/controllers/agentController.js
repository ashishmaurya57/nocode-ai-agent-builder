import Agent from '../models/Agent.js';
import { embedAndStore } from '../utils/vectorStore.js';

import { validateApiKey } from '../utils/validateApiKey.js';
import fs from 'fs';

// ✅ Create Agent
export const createAgent = async (req, res) => {
  try {
    const {
      name, prompt, provider, apiKey, model, tools, memory,
      useRAG, embedProvider, embedApiKey
    } = req.body;

    const userId = req.user.uid;

    if (apiKey && !(await validateApiKey(provider, apiKey, model))) {
      return res.status(400).json({ message: 'Invalid API key' });
    }

    if ((useRAG === 'true' || useRAG === true) && (!embedProvider || !embedApiKey)) {
      return res.status(400).json({ message: 'Embedding provider and API key are required for RAG' });
    }

    let documentPath = req.file?.path || null;
    let vectorNamespace = null;
    let vectorTableName = null;

    const agent = new Agent({
      userId,
      name,
      provider,
      model,
      apiKey,
      tools: Array.isArray(tools) ? tools : [tools],
      memory,
      prompt,
      useRAG: useRAG === 'true' || useRAG === true,
      embedProvider,
      embedApiKey,
      documentPath
    });

    const saved = await agent.save();

    // ✅ If document uploaded, embed and store vectors
    if (agent.useRAG && documentPath) {
      const result = await embedAndStore({
        documentPath: documentPath,
        embedProvider,
        embedApiKey,
        question: 'placeholder',
        memory: memory,
        agentId: saved._id
      });

      if (memory === 'Redis') {
        agent.vectorNamespace = result.vectorNamespace;
      } else if (memory === 'PostgreSQL') {
        agent.vectorTableName = result.vectorTableName;
      }
      await agent.save();
    }

    res.status(201).json(agent.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('❌ Error creating agent:', error);
    res.status(500).json({ message: 'Error creating agent' });
  }
};

// ✅ Update Agent
// ✅ Update Agent
export const updateAgent = async (req, res) => {
  try {
    const userId = req.user.uid;
    const agent = await Agent.findOne({ _id: req.params.id, userId });

    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    const {
      name, provider, apiKey, model, tools, memory,
      prompt, useRAG, embedProvider, embedApiKey
    } = req.body;

    if ((useRAG === 'true' || useRAG === true) && (!embedProvider || !embedApiKey)) {
      return res.status(400).json({ message: 'Embedding provider and API key are required for RAG' });
    }

    // ✅ Store previous RAG config for comparison
    const prevMemory = agent.memory;
    const prevEmbedProvider = agent.embedProvider;
    const prevEmbedApiKey = agent.embedApiKey;
    const prevDocumentPath = agent.documentPath;

    // ✅ Update basic fields
    agent.name = name;
    agent.provider = provider;
    agent.apiKey = apiKey;
    agent.model = model;
    agent.memory = memory;
    agent.prompt = prompt;
    agent.tools = Array.isArray(tools) ? tools : [tools];
    agent.useRAG = useRAG === 'true' || useRAG === true;
    agent.embedProvider = embedProvider;
    agent.embedApiKey = embedApiKey;

    let shouldReEmbed = false;

    // ✅ Case 1: Document re-uploaded
    if (req.file) {
      if (prevDocumentPath && fs.existsSync(prevDocumentPath)) {
        fs.unlinkSync(prevDocumentPath);
      }

      agent.documentPath = req.file.path;
      shouldReEmbed = true;
      console.log("📁 Document Path:", req.file?.path);
      console.log("📁 fs.existsSync():", fs.existsSync(req.file?.path || agent.documentPath));
    }

    // ✅ Case 2: Embed config or memory type changed
    if (
      agent.useRAG &&
      (prevMemory !== memory ||
        prevEmbedProvider !== embedProvider ||
        prevEmbedApiKey !== embedApiKey)
    ) {
      shouldReEmbed = true;
    }

    // ✅ Re-embed if needed
    if (shouldReEmbed && agent.documentPath && fs.existsSync(agent.documentPath)) {
      console.log("📥 Re-embedding document due to file/config change...");
      const result = await embedAndStore({
        documentPath: agent.documentPath,
        embedProvider,
        embedApiKey,
        question: 'placeholder',
        memory,
        agentId: agent._id
      });

      if (memory === 'Redis') {
        agent.vectorNamespace = result.vectorNamespace;
      } else if (memory === 'PostgreSQL') {
        agent.vectorTableName = result.vectorTableName;
      }
    }

    await agent.save();
    res.status(200).json(agent.toJSON({ virtuals: true }));

  } catch (error) {
    console.error("❌ Error updating agent:", error);
    res.status(500).json({ error: "Failed to update agent" });
  }
};

// ✅ Get All Agents for User
export const getUserAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ userId: req.user.uid }).lean({ virtuals: true });
    res.json(agents);
  } catch (error) {
    console.error('❌ Error fetching agents:', error);
    res.status(500).json({ message: 'Error fetching agents' });
  }
};

// ✅ Get One Agent
export const getAgentDetails = async (req, res) => {
  try {
    const agent = await Agent.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('❌ Error fetching agent:', error);
    res.status(500).json({ message: 'Error fetching agent' });
  }
};

// ✅ Delete Agent
export const deleteAgent = async (req, res) => {
  try {
    const userId = req.user.uid;
    const agent = await Agent.findOne({ _id: req.params.id, userId });

    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    if (agent.documentPath && fs.existsSync(agent.documentPath)) {
      fs.unlinkSync(agent.documentPath);
    }

    await Agent.deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting agent:', err);
    res.status(500).json({ message: 'Failed to delete agent' });
  }
};
