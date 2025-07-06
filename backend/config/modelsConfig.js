export const availableModels = {
  groq: {
    name: "Groq",
    needsKey: true,
    getModels: async (apiKey) => {
      try {
        // Static list (Groq doesn't yet expose a models API)
        return ['llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'];
      } catch (error) {
        console.error("Failed to fetch Groq models:", error);
        return []; // Return empty array on failure
      }
    }
  },
  ollama: {
    name: "Ollama",
    needsKey: false,
    getModels: async () => {
      try {
        // Static list (Ollama models depend on local installation)
        return ['llama3', 'mistral', 'gemma:7b'];
      } catch (error) {
        console.error("Failed to fetch Ollama models:", error);
        return [];
      }
    }
  },
  deepseek: {
    name: "DeepSeek",
    needsKey: false,
    getModels: async () => {
      try {
        // Static list (DeepSeek's current offerings)
        return ['deepseek-coder', 'deepseek-chat'];
      } catch (error) {
        console.error("Failed to fetch DeepSeek models:", error);
        return [];
      }
    }
  },
  openai: {
    name: "OpenAI",
    needsKey: true,
    getModels: async (apiKey) => {
      try {
        // Dynamic fetch from OpenAI API (requires valid API key)
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        const data = await response.json();
        
        // Filter for chat-completion models
        const allowedModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o'];
        const availableModels = data.data
          .map(model => model.id)
          .filter(id => allowedModels.includes(id));
        
        return availableModels.length ? availableModels : allowedModels; // Fallback
      } catch (error) {
        console.error("Failed to fetch OpenAI models:", error);
        return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o']; // Fallback list
      }
    }
  }
};