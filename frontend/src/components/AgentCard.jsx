import { Card, Button, Badge } from 'react-bootstrap';
import { FiMessageSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AgentCard = ({ agent, onDelete, onChat }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <Card.Title className="mb-0">{agent.name}</Card.Title>
          <Badge bg="primary" className="ms-2">
            {agent.model}
          </Badge>
        </div>

        <Card.Text className="flex-grow-1 text-muted mb-3">
          {agent.systemPrompt?.substring(0, 100) || 'No prompt available...'}

        </Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            {agent.tools?.map(tool => (
              <Badge key={tool} bg="secondary" className="me-1">
                {tool}
              </Badge>
            ))}
          </div>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-1"
              title="Chat with agent"
              onClick={onChat}
            >
              <FiMessageSquare />
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-1"
              title="Edit agent"
              onClick={() => navigate(`/dashboard/edit-agent/${agent._id}`)}
            >
              <FiEdit2 />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              title="Delete agent"
              onClick={() => onDelete(agent)}
            >
              <FiTrash2 />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AgentCard;
