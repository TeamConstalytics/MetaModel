import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { exportAsAsyncApi } from '../utils/asyncApiExporter';
import { FaFileExport, FaDownload, FaTimes, FaFileCode } from 'react-icons/fa';

const ExportButton = forwardRef(({ reactFlowInstance }, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [exportedData, setExportedData] = useState('');
  
  // Default metadata that will be used without showing in the UI
  const metadata = {
    title: 'Data Pipeline API',
    version: '1.0.0',
    description: 'API generated from PNC Meta Model - Data Product Designer'
  };

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

  // Copy functionality removed as it's not needed

  const handleExploreAsyncAPI = () => {
    // Open AsyncAPI Studio in a new tab with the current spec
    const encodedSpec = encodeURIComponent(exportedData);
    window.open(`https://studio.asyncapi.com/?url=data:text/plain;charset=utf-8,${encodedSpec}`, '_blank');
  };
  
  // Expose handleExport method to parent components
  useImperativeHandle(ref, () => ({
    handleExport
  }));

  return (
    <>
      {/* The button is now moved to NodeToolbar */}
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3><FaFileCode className="header-icon" /> AsyncAPI 3.0.0 Export</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="export-preview">
                <pre className="code-preview">{exportedData}</pre>
              </div>
              <div className="modal-actions">
                <button className="download-button" onClick={handleDownload}>
                  <FaDownload className="button-icon" /> Download YAML
                </button>
                <button className="explore-button" onClick={handleExploreAsyncAPI}>
                  <FaFileExport className="button-icon" /> Explore in AsyncAPI Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ExportButton;