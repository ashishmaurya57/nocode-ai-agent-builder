import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Simple markdown parser for formatting AI responses
const formatMessage = (text) => {
  if (!text) return text;
  
  // Convert markdown-style formatting to HTML
  let formatted = text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags and handle lists
  formatted = '<p>' + formatted + '</p>';
  
  // Fix list formatting
  formatted = formatted.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');
  
  // Clean up empty paragraphs
  formatted = formatted.replace(/<p><\/p>/g, '');
  formatted = formatted.replace(/<p>\s*<\/p>/g, '');
  
  return formatted;
};
// import { inMemoryStore } from '../utils/vectorStore.js';
export default function ChatInterface({ agentId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!agentId) return;
    setIsLoading(true);

    axios
      .get(`${API_BASE}/chat/${agentId}/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) => console.error('❌ Failed to load chat history:', err))
      .finally(() => setIsLoading(false));
  }, [agentId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsEmbedding(true);
    // Replace the entire array with just the new file
    setUploadedFiles([file.name]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/chat/${agentId}/embed`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message
      }]);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Failed to upload and embed document.',
      }]);
    } finally {
      setIsEmbedding(false);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim() || isEmbedding) return;

  const userMessage = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    const res = await axios.post(`${API_BASE}/chat/${agentId}/run`, {
      message: input, // ✅ Use JSON with key 'message'
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json', // ✅ Explicitly mark JSON
      }
    });

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.data.response || res.data.message
    }]);
  } catch (error) {
    console.error('Error sending message:', error);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '⚠️ Failed to get response. Please try again.'
    }]);
  } finally {
    setIsLoading(false);
  }
};


  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <style>
        {`
          .chat-container {
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-sizing: border-box;
          }
          
          .chat-card {
            height: calc(100vh - 40px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            background: white;
            overflow: hidden;
            border: none;
            display: flex;
            flex-direction: column;
          }
          
          .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
          }
          
          .chat-header h5 {
            margin: 0;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.25rem;
          }
          
          .chat-status {
            font-size: 0.85rem;
            opacity: 0.9;
            margin-top: 5px;
          }
          
          .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
          }
          
          .messages-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .messages-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .messages-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
          
          .message-item {
            margin-bottom: 16px;
          }
          
          .message-row {
            display: flex;
            align-items: flex-end;
            gap: 10px;
          }
          
          .message-row.user {
            justify-content: flex-end;
          }
          
          .message-row.assistant {
            justify-content: flex-start;
          }
          
          .message-bubble {
            max-width: 70%;
            padding: 15px 20px;
            border-radius: 20px;
            position: relative;
            word-wrap: break-word;
            font-size: 0.95rem;
            line-height: 1.4;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .user-message {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 8px;
          }
          
          .assistant-message {
            background: white;
            color: #333;
            border: 1px solid #e9ecef;
            border-bottom-left-radius: 8px;
          }
          
          .formatted-content {
            line-height: 1.6;
          }
          
          .formatted-content h1 {
            font-size: 1.4rem;
            font-weight: bold;
            margin: 16px 0 12px 0;
            color: #2c3e50;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
          }
          
          .formatted-content h2 {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 14px 0 10px 0;
            color: #34495e;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 6px;
          }
          
          .formatted-content h3 {
            font-size: 1.1rem;
            font-weight: bold;
            margin: 12px 0 8px 0;
            color: #555;
          }
          
          .formatted-content p {
            margin: 8px 0;
            line-height: 1.6;
          }
          
          .formatted-content strong {
            font-weight: bold;
            color: #2c3e50;
          }
          
          .formatted-content em {
            font-style: italic;
            color: #555;
          }
          
          .formatted-content ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          
          .formatted-content li {
            margin: 6px 0;
            line-height: 1.5;
            position: relative;
          }
          
          .formatted-content li::before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: -15px;
          }
          
          .formatted-content code {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 2px 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #e83e8c;
          }
          
          .formatted-content pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 12px;
            margin: 12px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            line-height: 1.4;
          }
          
          .formatted-content pre code {
            background: none;
            border: none;
            padding: 0;
            color: #495057;
          }
          
          .formatted-content br {
            line-height: 1.6;
          }
          
          .message-time {
            font-size: 0.75rem;
            opacity: 0.7;
            margin-top: 5px;
          }
          
          .message-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
            flex-shrink: 0;
          }
          
          .user-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .assistant-avatar {
            background: #e9ecef;
            color: #6c757d;
          }
          
          .typing-indicator {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 20px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 200px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .typing-dots {
            display: flex;
            gap: 4px;
          }
          
          .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #6c757d;
            animation: typing 1.4s infinite;
          }
          
          .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }
          
          .input-section {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
          }
          
          .file-upload-section {
            margin-bottom: 15px;
          }
          
          .file-upload-btn {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #6c757d;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .file-upload-btn:hover {
            border-color: #667eea;
            background: #f0f4ff;
            color: #667eea;
          }
          
          .uploaded-files {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }
          
          .file-badge {
            background: #e7f3ff;
            color: #0066cc;
            border: 1px solid #b3d9ff;
            border-radius: 20px;
            padding: 5px 12px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .message-input-group {
            display: flex;
            gap: 10px;
            align-items: end;
          }
          
          .message-input {
            flex: 1;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            resize: none;
            min-height: 50px;
            max-height: 120px;
            font-family: inherit;
            outline: none;
          }
          
          .message-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
          }
          
          .send-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            cursor: pointer;
            color: white;
            font-size: 1.2rem;
          }
          
          .send-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
          }
          
          .send-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .welcome-message {
            text-align: center;
            color: #6c757d;
            margin: 40px 0;
          }
          
          .welcome-message .icon {
            font-size: 3rem;
            margin-bottom: 20px;
            color: #667eea;
          }
          
          .hidden {
            display: none;
          }
        `}
      </style>

      <div className="chat-card">
        <div className="chat-header">
          <h5><span>💬</span> AI Assistant</h5>
          <div className="chat-status">
            {isLoading ? 'Typing...' : isEmbedding ? 'Processing document...' : 'Online'}
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 && !isLoading && (
            <div className="welcome-message">
              <div className="icon">💬</div>
              <h5>Welcome to AI Assistant</h5>
              <p>Start a conversation or upload a document to begin.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className="message-item">
              <div className={`message-row ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="message-avatar assistant-avatar">🤖</div>
                )}
                <div className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                  {msg.role === 'assistant' ? (
                    <div 
                      className="formatted-content"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  ) : (
                    msg.content
                  )}
                  <div className="message-time">{formatTime()}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar user-avatar">👤</div>
                )}
              </div>
            </div>
          ))}

          {(isLoading || isEmbedding) && (
            <div className="message-item">
              <div className="message-row assistant">
                <div className="message-avatar assistant-avatar">🤖</div>
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span>{isEmbedding ? 'Processing document...' : 'Thinking...'}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          <div className="file-upload-section">
            <div
              className="file-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>📎</span> Upload PDF Document
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                {uploadedFiles.map((fileName, idx) => (
                  <div key={idx} className="file-badge">
                    <span>📄</span> {fileName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="message-input-group">
              <textarea
                className="message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || isEmbedding}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                className="send-button"
                disabled={isLoading || isEmbedding || !input.trim()}
              >
                {isLoading ? <div className="spinner" /> : <span>🚀</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}