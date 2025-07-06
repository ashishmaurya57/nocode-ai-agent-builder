import { useEffect, useState } from 'react';
import { Container, Button, Card, Modal, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AgentCard from './AgentCard';
import ChatInterface from './ChatInterface';
import { getAgents, deleteAgent } from '../services/agentService';
import { getAutomations } from '../services/automationService';
import AutomationCard from './AutomationCard';

const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [chattingAgent, setChattingAgent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [automations, setAutomations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        console.log("Fetched Agents:", data);  // ✅ Log this
        const automationsData = await getAutomations();
        console.log("automationdata:", automationsData);  
        setAutomations(automationsData);
        setAgents(data);
      } catch (err) {
        setError('Failed to load agents');
      }
    };
    fetchAgents();
  }, []);

  const handleDelete = (agent) => {
    setAgentToDelete(agent);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAgent(agentToDelete._id);
      setAgents(agents.filter(a => a._id !== agentToDelete._id));
      setShowDeleteConfirm(false);
      setAgentToDelete(null);
    } catch (err) {
      setError('Failed to delete agent');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="header-content">
                <h1 className="dashboard-title">
                  <span className="title-icon">🚀</span>
                  Your AI Command Center
                </h1>
                <p className="dashboard-subtitle">
                  Manage your AI agents and automations from one powerful dashboard
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="dashboard-content">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible className="custom-alert">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          </Alert>
        )}

        {/* AI Agents Section */}
        <div className="section-wrapper">
          <div className="section-header">
            <div className="section-title-container">
              <h2 className="section-title">
                <span className="section-icon">🤖</span>
                AI Agents
                <span className="agent-count">{agents.length}</span>
              </h2>
              <p className="section-description">
                Your intelligent assistants ready to work
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              className="create-button"
              onClick={() => navigate('/create-agent')}
            >
              <span className="button-icon">✨</span>
              Create Agent
            </Button>
          </div>

          {agents.length === 0 ? (
            <Card className="empty-state-card">
              <Card.Body className="text-center">
                <div className="empty-state-icon">🎯</div>
                <h3 className="empty-state-title">No agents created yet</h3>
                <p className="empty-state-text">
                  Get started by creating your first AI agent and unlock the power of automation
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  className="create-button"
                  onClick={() => navigate('/dashboard/create-agent')}
                >
                  <span className="button-icon">🚀</span>
                  Create First Agent
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="agents-grid">
              {agents.map(agent => (
                <div className="agent-card-wrapper" key={agent._id}>
                  <AgentCard
                    agent={agent}
                    onEdit={() => navigate(`/dashboard/edit-agent/${agent._id}`)}
                    onDelete={() => handleDelete(agent)}
                    onChat={() => setChattingAgent(agent)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Automations Section */}
        <div className="section-wrapper">
          <div className="section-header">
            <div className="section-title-container">
              <h2 className="section-title">
                <span className="section-icon">⚡</span>
                Automations
                <span className="automation-count">{automations.length}</span>
              </h2>
              <p className="section-description">
                Streamline your workflows with smart automation
              </p>
            </div>
          </div>

          {automations.length === 0 ? (
            <Card className="empty-state-card">
              <Card.Body className="text-center">
                <div className="empty-state-icon">⚙️</div>
                <h3 className="empty-state-title">No automations created yet</h3>
                <p className="empty-state-text">
                  Create powerful automations to handle repetitive tasks automatically
                </p>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  className="create-button secondary"
                >
                  <span className="button-icon">🔧</span>
                  Create Automation
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="automations-grid">
              {automations.map(auto => (
                <div className="automation-card-wrapper" key={auto._id}>
                  <AutomationCard automation={auto} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Chat Modal */}
      <Modal 
        show={!!chattingAgent} 
        onHide={() => setChattingAgent(null)} 
        size="lg" 
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <span className="modal-icon">💬</span>
            Chat with {chattingAgent?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {chattingAgent && <ChatInterface agentId={chattingAgent._id} />}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteConfirm} 
        onHide={() => setShowDeleteConfirm(false)} 
        centered
        className="custom-modal delete-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <span className="modal-icon">🗑️</span>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <p>Are you sure you want to delete <strong>"{agentToDelete?.name}"</strong>?</p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteConfirm(false)}
            className="cancel-button"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            className="delete-button"
          >
            <span className="button-icon">🗑️</span>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
        }

        .dashboard-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          text-align: center;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .title-icon {
          font-size: 3rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .dashboard-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .dashboard-content {
          position: relative;
          z-index: 2;
          padding-top: 3rem;
          padding-bottom: 3rem;
        }

        .section-wrapper {
          margin-bottom: 4rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-title-container {
          flex: 1;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .section-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .agent-count, .automation-count {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 600;
          margin-left: 0.5rem;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }

        .section-description {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 0;
        }

        .create-button {
          position: relative;
          padding: 1rem 2rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .create-button.secondary {
          background: transparent;
          border: 2px solid #667eea;
          color: #667eea;
        }

        .create-button.secondary:hover {
          background: #667eea;
          color: white;
        }

        .button-icon {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        .create-button:hover .button-icon {
          transform: scale(1.1);
        }

        .empty-state-card {
          border: none;
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          background: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .empty-state-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .empty-state-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .empty-state-text {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .agents-grid, .automations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .agent-card-wrapper, .automation-card-wrapper {
          transition: transform 0.3s ease;
        }

        .agent-card-wrapper:hover, .automation-card-wrapper:hover {
          transform: translateY(-5px);
        }

        .custom-alert {
          border: none;
          border-radius: 15px;
          padding: 1rem;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .alert-icon {
          font-size: 1.2rem;
        }

        .custom-modal .modal-content {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header-custom {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border-bottom: none;
          padding: 1.5rem;
        }

        .modal-title-custom {
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-icon {
          font-size: 1.5rem;
        }

        .modal-body-custom {
          padding: 2rem;
        }

        .modal-footer-custom {
          padding: 1.5rem;
          border-top: 1px solid #eee;
        }

        .cancel-button {
          background: #6c757d;
          border: none;
          border-radius: 25px;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
        }

        .delete-button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          border: none;
          border-radius: 25px;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .delete-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .section-title {
            font-size: 2rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .agents-grid, .automations-grid {
            grid-template-columns: 1fr;
          }
          
          .empty-state-card {
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 576px) {
          .dashboard-title {
            font-size: 1.8rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .create-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;