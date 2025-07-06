import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/agents';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getAgents = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const getAgent = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
};

export const createAgent = async (agentData) => {
  const formData = new FormData();
  formData.append('name', agentData.name);
  formData.append('provider', agentData.provider);
  formData.append('apiKey', agentData.apiKey || '');
  formData.append('model', agentData.model);
  formData.append('prompt', agentData.prompt);
  formData.append('memory', agentData.memory || 'None');

  if (Array.isArray(agentData.tools)) {
    agentData.tools.forEach(tool => formData.append('tools', tool));
  }

  const isRAG = agentData.useRAG;
  formData.append('useRAG', isRAG ? 'true' : 'false');

  if (isRAG) {
    if (agentData.document) {
      formData.append('document', agentData.document);
    }
    formData.append('embedProvider', agentData.embedProvider || '');
    formData.append('embedApiKey', agentData.embedApiKey || '');
  }

  const res = await axios.post(API_URL, formData, {
    headers: getAuthHeader() // ✅ Let Axios handle Content-Type
  });
  return res.data;
};


export const updateAgent = async (id, agentData) => {
  const formData = new FormData();
  formData.append('name', agentData.name);
  formData.append('provider', agentData.provider);
  formData.append('apiKey', agentData.apiKey || '');
  formData.append('model', agentData.model);
  formData.append('prompt', agentData.prompt);
  formData.append('memory', agentData.memory || 'None');

  // Always send tools
  if (Array.isArray(agentData.tools)) {
    agentData.tools.forEach(tool => formData.append('tools', tool));
  }

  // ✅ Always send useRAG
  formData.append('useRAG', agentData.useRAG ? 'true' : 'false');

  if (agentData.useRAG) {
    if (agentData.document) {
      formData.append('document', agentData.document);
    }
    formData.append('embedProvider', agentData.embedProvider || '');
    formData.append('embedApiKey', agentData.embedApiKey || '');
  }

  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data;
};

export const deleteAgent = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });
};
