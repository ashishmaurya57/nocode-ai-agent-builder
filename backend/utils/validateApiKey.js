import axios from 'axios';

export const validateApiKey = async (provider, apiKey, model) => {
  try {
    switch (provider.toLowerCase()) {
      case 'openai':
        await axios.post('https://api.openai.com/v1/chat/completions', {
          model: model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'ping' }],
        }, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
        });
        return true;

      case 'groq':
        await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: model || 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: 'ping' }],
        }, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
        });
        return true;

      // Add other providers similarly
      case 'togetherai':
        await axios.get('https://api.together.xyz/models', {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        return true;

      // Add fake success for providers that don’t need validation (like Ollama)
      case 'ollama':
        return true;

      default:
        throw new Error(`API key validation not supported for provider: ${provider}`);
    }
  } catch (err) {
    console.error(`❌ API key validation failed for ${provider}:`, err.message);
    return false;
  }
};
