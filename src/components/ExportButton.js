import React, { useState } from 'react';
import { exportAsAsyncApi } from '../utils/asyncApiExporter';

const ExportButton = ({ reactFlowInstance }) => {
  const [showModal, setShowModal] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [metadata, setMetadata] = useState({
    title: 'Data Pipeline API',
    version: '1.0.0',
    description: 'API generated from PNC Meta Model - Data Product Designer'
  });

  const handleExport = () => {
    if (!reactFlowInstance) {
      alert('Flow instance not available. Please try again.');
      return;
    }

    const { nodes, edges } = reactFlowInstance.toObject();
    const asyncApiYaml = exportAsAsyncApi(nodes, edges, metadata);
    setExportedData(asyncApiYaml);
    setShowModal(true);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([exportedData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'asyncapi-spec.yaml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedData)
      .then(() => {
        alert('AsyncAPI specification copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <button className="export-button" onClick={handleExport}>
        Export as AsyncAPI
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>AsyncAPI 3.0.0 Export</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="metadata-form">
                <div className="form-group">
                  <label>API Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={metadata.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>API Version:</label>
                  <input
                    type="text"
                    name="version"
                    value={metadata.version}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>API Description:</label>
                  <textarea
                    name="description"
                    value={metadata.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <button className="update-button" onClick={handleExport}>
                  Update AsyncAPI
                </button>
              </div>
              <div className="export-preview">
                <h4>AsyncAPI Specification</h4>
                <pre className="code-preview">{exportedData}</pre>
              </div>
              <div className="modal-actions">
                <button className="copy-button" onClick={handleCopy}>
                  Copy to Clipboard
                </button>
                <button className="download-button" onClick={handleDownload}>
                  Download YAML
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportButton;