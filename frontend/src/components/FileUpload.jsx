import { useState } from 'react';
import { Form } from 'react-bootstrap';

const FileUpload = ({ onFileUpload, accept = '.pdf,.txt,.csv' }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Upload Knowledge Document (Optional)</Form.Label>
      <Form.Control 
        type="file" 
        accept={accept}
        onChange={handleFileChange}
      />
      {fileName && <small className="text-muted">Selected: {fileName}</small>}
    </Form.Group>
  );
};

export default FileUpload;