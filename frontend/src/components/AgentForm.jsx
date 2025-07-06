import { useState, useEffect } from 'react';
import { Form, Button, Card, Tab, Tabs, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { createAgent, updateAgent, getAgent } from '../services/agentService';
import { getProviders, getModels } from '../services/modelService';

const MEMORY_OPTIONS = ['None', 'PostgreSQL', 'Redis', 'In-Memory', 'Chroma'];
const TOOL_OPTIONS = ['Web Search', 'Calculator', 'Jira API', 'Slack API'];
const EMBED_PROVIDERS = ['openai', 'huggingface'];

const AgentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [agent, setAgent] = useState({
    name: '',
    provider: '',
    model: '',
    apiKey: '',
    memory: 'None',
    tools: [],
    prompt: '',
    document: null,
    useRAG: false,
    embedProvider: '',
    embedApiKey: ''
  });

  const [activeTab, setActiveTab] = useState('model');
  const [error, setError] = useState('');

  const [providers, setProviders] = useState({});
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState({ providers: true, models: false });
  const [modelError, setModelError] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setModelError('Failed to load providers. Please try again later.');
      } finally {
        setLoading(prev => ({ ...prev, providers: false }));
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const fetched = await getAgent(id);
        setAgent({
          ...fetched,
          document: null, // don't pre-fill file
          useRAG: !!fetched.documentPath,
          embedProvider: fetched.embedProvider || '',
          embedApiKey: fetched.embedApiKey || ''
        });
        setSelectedProvider(fetched.provider);
        setApiKey(fetched.apiKey || '');
      })();
    }
  }, [id]);

  const handleLoadModels = async () => {
    if (!selectedProvider) return;

    setLoading(prev => ({ ...prev, models: true }));
    setModelError('');

    try {
      const modelsList = await getModels(selectedProvider, apiKey);
      setModels(modelsList);
      if (modelsList.length > 0) {
        setAgent(prev => ({
          ...prev,
          provider: selectedProvider,
          model: modelsList[0],
          apiKey: providers[selectedProvider]?.needsKey ? apiKey : ''
        }));
      }
    } catch (err) {
      console.error('Error loading models:', err);
      setModelError(err.response?.data?.message || 'Failed to load models. Please check your API key.');
    } finally {
      setLoading(prev => ({ ...prev, models: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (agent.useRAG && agent.document) {
      if (!agent.embedProvider || !agent.embedApiKey) {
        return setError('Embedding provider and API key are required for RAG.');
      }
    }

    if (isEdit) {
      await updateAgent(id, agent);
    } else {
      await createAgent(agent);
    }

    navigate('/dashboard');
  };

  const toggleTool = (tool) => {
    setAgent({
      ...agent,
      tools: agent.tools.includes(tool)
        ? agent.tools.filter(t => t !== tool)
        : [...agent.tools, tool]
    });
  };

  const needsKey = providers[selectedProvider]?.needsKey;

  return (
    <Card className="p-4 m-4">
      <h3>{isEdit ? 'Edit Agent' : 'Create Agent'}</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Agent Name</Form.Label>
          <Form.Control
            type="text"
            value={agent.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value })}
            required
          />
        </Form.Group>

        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
          <Tab eventKey="model" title="Model">
            <Form.Group className="mb-3">
              <Form.Label>AI Provider</Form.Label>
              {loading.providers ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select
                  value={selectedProvider}
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                    setApiKey('');
                    setModels([]);
                    setModelError('');
                  }}
                  disabled={loading.providers}
                >
                  <option value="">Select Provider</option>
                  {Object.keys(providers).map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            {selectedProvider && needsKey && (
              <Form.Group className="mb-3">
                <Form.Label>API Key</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={`Enter ${selectedProvider} API Key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={loading.models}
                />
              </Form.Group>
            )}

            {selectedProvider && (
              <Button
                onClick={handleLoadModels}
                disabled={loading.models || (needsKey && !apiKey)}
                className="mb-3"
              >
                {loading.models ? (
                  <>
                    <Spinner size="sm" animation="border" /> Loading...
                  </>
                ) : (
                  'Load Models'
                )}
              </Button>
            )}

            {modelError && (
              <Alert variant="danger" className="mt-3">
                {modelError}
              </Alert>
            )}

            {models.length > 0 && (
              <Form.Group>
                <Form.Label>Select Model</Form.Label>
                <Form.Select
                  value={agent.model}
                  onChange={(e) =>
                    setAgent(prev => ({
                      ...prev,
                      model: e.target.value,
                      provider: selectedProvider,
                      apiKey: needsKey ? apiKey : ''
                    }))
                  }
                  disabled={loading.models}
                >
                  <option value="">Select a model</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Tab>

          <Tab eventKey="memory" title="Memory">
            <Form.Group>
              <Form.Label>Memory Type</Form.Label>
              <Form.Select
                value={agent.memory}
                onChange={(e) => setAgent({ ...agent, memory: e.target.value })}
              >
                {MEMORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Tab>

          <Tab eventKey="document" title="RAG (Document)">
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Enable RAG"
                checked={agent.useRAG}
                onChange={(e) => setAgent({ ...agent, useRAG: e.target.checked })}
              />
            </Form.Group>

            {agent.useRAG && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Document</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.txt,.csv"
                    onChange={(e) =>
                      setAgent({ ...agent, document: e.target.files[0] })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Embedding Provider</Form.Label>
                  <Form.Select
                    value={agent.embedProvider}
                    onChange={(e) =>
                      setAgent({ ...agent, embedProvider: e.target.value })
                    }
                    required={agent.useRAG}
                  >
                    <option value="">Select provider</option>
                    {EMBED_PROVIDERS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Embedding API Key</Form.Label>
                  <Form.Control
                    type="password"
                    value={agent.embedApiKey}
                    onChange={(e) =>
                      setAgent({ ...agent, embedApiKey: e.target.value })
                    }
                    required={agent.useRAG}
                  />
                </Form.Group>
              </>
            )}
          </Tab>

          <Tab eventKey="tools" title="Tools">
            {TOOL_OPTIONS.map(tool => (
              <Form.Check
                key={tool}
                type="checkbox"
                label={tool}
                checked={agent.tools.includes(tool)}
                onChange={() => toggleTool(tool)}
              />
            ))}
          </Tab>

          <Tab eventKey="prompt" title="Prompt">
            <Form.Group>
              <Form.Label>System Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={agent.prompt}
                onChange={(e) => setAgent({ ...agent, prompt: e.target.value })}
              />
            </Form.Group>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AgentForm;
