import axios from 'axios';

export const getProviders = async () => {
  const response = await axios.get('http://localhost:5000/api/providers');
  console.log("response:", response.data)
  return response.data;
};

export const getModels = async (provider, apiKey) => {
  const response = await axios.post(`http://localhost:5000/api/${provider}/models`, { apiKey });
  console.log("response_model:", response.data.models)
  return response.data.models;
};