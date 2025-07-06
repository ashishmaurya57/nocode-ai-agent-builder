// controllers/modelController.js

import { availableModels } from '../config/modelsConfig.js';

export const listProviders = (req, res) => {
  // Send full config (e.g., needsKey info too)
  const providerMap = {};
  for (const key of Object.keys(availableModels)) {
    providerMap[key] = { needsKey: availableModels[key].needsKey };
  }
  res.json(providerMap);
};

export const getProviderModels = async (req, res) => {
  const provider = req.params.provider?.toLowerCase();
  const apiKey = req.body.apiKey || null;

  const providerConfig = availableModels[provider];

  if (!providerConfig) {
    return res.status(400).json({ message: 'Invalid provider' });
  }

  if (providerConfig.needsKey && !apiKey) {
    return res.status(400).json({ message: 'API key required' });
  }

  try {
    const models = providerConfig.getModels
      ? await providerConfig.getModels(apiKey)
      : providerConfig.models;

    res.json({ models });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch models' });
  }
};
