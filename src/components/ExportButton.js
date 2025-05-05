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

    try {
      const { nodes, edges } = reactFlowInstance.toObject();
      console.log('Exporting nodes:', nodes.length, 'edges:', edges.length);
      const asyncApiYaml = exportAsAsyncApi(nodes, edges, metadata);
      console.log('Generated YAML length:', asyncApiYaml.length);
      setExportedData(asyncApiYaml);
      setShowModal(true);
    } catch (error) {
      console.error('Error generating AsyncAPI:', error);
      alert('Error generating AsyncAPI: ' + error.message);
    }
  };

  const handleDownload = () => {
    try {
      // Create a blob with the YAML content
      const blob = new Blob([exportedData], { type: 'text/yaml' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'asyncapi-spec.yaml';
      link.style.display = 'none';
      
      // Add the link to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Download initiated');
    } catch (error) {
      console.error('Error downloading YAML:', error);
      alert('Error downloading YAML: ' + error.message);
    }
  };

  const handleExploreAsyncAPI = () => {
    try {
      // Open AsyncAPI Studio in a new tab with the current spec
      const encodedSpec = encodeURIComponent(exportedData);
      window.open(`https://studio.asyncapi.com/?url=data:text/plain;charset=utf-8,${encodedSpec}`, '_blank');
    } catch (error) {
      console.error('Error opening AsyncAPI Studio:', error);
      alert('Error opening AsyncAPI Studio: ' + error.message);
    }
  };
  
  // Expose handleExport method to parent components
  useImperativeHandle(ref, () => ({
    handleExport
  }));

  return (
    <>
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