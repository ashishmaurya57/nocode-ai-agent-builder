import { useState, useEffect } from 'react';
import { getAgents } from '../services/agentService';

export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAgents();
  }, []);

  return { agents, loading, error, refreshAgents };
};