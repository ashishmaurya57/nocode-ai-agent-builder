import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getProviders = async () => {
  const response = await axios.get(`${API_BASE_URL}/providers`);
  console.log("response:", response.data);
  return response.data;
};

export const getModels = async (provider, apiKey) => {
  const response = await axios.post(`${API_BASE_URL}/${provider}/models`, { apiKey });
  console.log("response_model:", response.data.models);
  return response.data.models;
};
