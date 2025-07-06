import { Form } from 'react-bootstrap';

const ToolSelector = ({ selectedTools, onChange }) => {
  const tools = [
    { id: 'calculator', label: 'Calculator' },
    { id: 'websearch', label: 'Web Search' }
  ];

  const handleToolChange = (toolId, isChecked) => {
    const newTools = isChecked
      ? [...selectedTools, toolId]
      : selectedTools.filter(t => t !== toolId);
    onChange(newTools);
  };

  return (
    <Form.Group>
      <Form.Label>Tools</Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {tools.map(tool => (
          <Form.Check
            key={tool.id}
            type="checkbox"
            id={`tool-${tool.id}`}
            label={tool.label}
            checked={selectedTools.includes(tool.id)}
            onChange={(e) => handleToolChange(tool.id, e.target.checked)}
          />
        ))}
      </div>
    </Form.Group>
  );
};

export default ToolSelector;