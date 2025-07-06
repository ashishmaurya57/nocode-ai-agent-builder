import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/automations';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getAutomations = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};
