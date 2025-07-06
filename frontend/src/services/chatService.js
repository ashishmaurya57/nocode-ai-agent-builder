import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/chat';

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const errorMessage = data?.message || `Request failed with status ${status}`;
    console.error('API Error:', { status, data });
    throw new Error(errorMessage);
  } else if (error.request) {
    // No response received
    console.error('No response:', error.request);
    throw new Error('Network error - no response from server');
  } else {
    // Request setup error
    console.error('Request error:', error.message);
    throw new Error('Request configuration error');
  }
};

export const sendMessage = async (agentId, message) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.post(
      `${API_URL}/${agentId}/run`,
      { message },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        timeout: 15000 // 15 second timeout
      }
    );

    if (!response.data?.response) {
      throw new Error('Invalid response format from server');
    }

    return response.data.response;
  } catch (error) {
    handleApiError(error);
  }
};

// Add retry logic for chat history
export const getChatHistory = async (agentId, retries = 2) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_URL}/${agentId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    });

    return response.data?.messages || [];
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... attempts left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getChatHistory(agentId, retries - 1);
    }
    handleApiError(error);
    return []; // Fallback empty array
  }
};