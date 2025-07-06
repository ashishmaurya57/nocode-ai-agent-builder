import React, { useState, useEffect } from 'react';
import { getAgents } from '../services/agentService';
import axios from 'axios';
import CryptoJS from 'crypto-js'; // 🔐 For encryption

const AutomationForm = () => {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    agentId: '',
    triggerType: 'cron',
    schedule: '',
    timezone: 'Asia/Kolkata',
    actionType: 'telegram',
    botToken: '',
    chatId: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch agents:', err.message);
        setAgents([]);
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let actionConfig;
    if (form.actionType === 'telegram') {
      actionConfig = {
        botToken: form.botToken,
        chatId: form.chatId
      };
    } else if (form.actionType === 'email') {
      // 🔐 Encrypt email password before sending
      const secretKey = 'no-code-secret'; // Can also come from `.env` (not exposed to user)
      const encryptedPassword = CryptoJS.AES.encrypt(form.password, secretKey).toString();

      actionConfig = {
        to: form.email,
        encryptedPassword
      };
    }

    const payload = {
      name: form.name,
      agentId: form.agentId,
      trigger: {
        type: form.triggerType,
        schedule: form.schedule,
        timezone: form.timezone
      },
      actions: [
        {
          type: form.actionType,
          config: actionConfig
        }
      ]
    };

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + '/automations', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('✅ Automation created successfully');
    } catch (err) {
      console.error('Failed to create automation:', err.message);
      alert('❌ Failed to create automation');
    }
  };

  return (
    <div className="container mt-5 automation-form">
      <h3>Create Automation</h3>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light">

        {/* Automation Name */}
        <div className="mb-3">
          <label className="form-label">Automation Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>

        {/* Select Agent */}
        <div className="mb-3">
          <label className="form-label">Select Agent</label>
          <select className="form-select" name="agentId" value={form.agentId} onChange={handleChange} required>
            <option value="">-- Select Agent --</option>
            {agents.map(agent => (
              <option key={agent._id} value={agent._id}>{agent.name}</option>
            ))}
          </select>
        </div>

        {/* Trigger Type */}
        <div className="mb-3">
          <label className="form-label">Trigger Type</label>
          <select className="form-select" name="triggerType" value={form.triggerType} onChange={handleChange}>
            <option value="cron">Schedule (CRON)</option>
            <option value="webhook">Webhook</option>
          </select>
        </div>

        {/* CRON Fields */}
        {form.triggerType === 'cron' && (
          <>
            <div className="mb-3">
              <label className="form-label">CRON Schedule</label>
              <input type="text" className="form-control" name="schedule" value={form.schedule} onChange={handleChange} placeholder="e.g., 0 9 * * *" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Timezone</label>
              <input type="text" className="form-control" name="timezone" value={form.timezone} onChange={handleChange} required />
            </div>
          </>
        )}

        {/* Action Type */}
        <div className="mb-3">
          <label className="form-label">Action Type</label>
          <select className="form-select" name="actionType" value={form.actionType} onChange={handleChange} required>
            <option value="telegram">Telegram</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Telegram Fields */}
        {form.actionType === 'telegram' && (
          <>
            <div className="mb-3">
              <label className="form-label">Bot Token</label>
              <input type="text" className="form-control" name="botToken" value={form.botToken} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Chat ID / @Channel</label>
              <input type="text" className="form-control" name="chatId" value={form.chatId} onChange={handleChange} required />
            </div>
          </>
        )}

        {/* Email Fields */}
        {form.actionType === 'email' && (
          <>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">App Password</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">Create Automation</button>
      </form>
    </div>
  );
};

export default AutomationForm;
