export const mockWebSearch = async (query) => {
  // In a real implementation, this would call a search API
  return `Search results for "${query}":\n1. Result 1\n2. Result 2\n3. Result 3`;
};

export const executeTool = async (toolName, input) => {
  switch (toolName) {
    case 'websearch':
      return await mockWebSearch(input);
    default:
      throw new Error(`Tool ${toolName} not supported`);
  }
};