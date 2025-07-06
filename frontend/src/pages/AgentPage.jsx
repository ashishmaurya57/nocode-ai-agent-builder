import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ChatInterface from '../components/ChatInterface';
import { getAgent } from '../services/agentService';
import { useAuth } from '../context/AuthContext';

const AgentPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const agentData = await getAgent(id);
        if (agentData.userId !== currentUser.uid) {
          throw new Error('You do not have access to this agent');
        }
        setAgent(agentData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id, currentUser]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>{agent.name}</h2>
          <p className="text-muted">Model: {agent.model}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChatInterface agentId={id} />
        </Col>
      </Row>
    </Container>
  );
};

export default AgentPage;