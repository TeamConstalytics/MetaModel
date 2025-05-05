import React from 'react';
import { FaDatabase, FaCogs, FaFileExport, FaSave, FaUpload, FaFileCode } from 'react-icons/fa';

const NodeToolbar = ({ onAddNode, saveLoadProps, exportProps }) => {
  const { reactFlowInstance, setNodes, setEdges } = saveLoadProps || {};
  
  // Save workflow to JSON
  const saveWorkflow = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const json = JSON.stringify(flow, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pnc-metamodel-workflow.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Load workflow from file
  const loadWorkflow = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const flow = JSON.parse(e.target.result);
        
        if (flow && flow.nodes && flow.edges && reactFlowInstance) {
          // Clear current flow
          setNodes([]);
          setEdges([]);
          
          // Set viewport
          reactFlowInstance.setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
          
          // Add nodes and edges
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
        alert('Failed to load workflow. Invalid file format.');
      }
    };
    
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  // Export to AsyncAPI
  const handleExport = () => {
    if (exportProps && exportProps.handleExport) {
      exportProps.handleExport();
    }
  };

  return (
    <div className="node-toolbar">
      <button onClick={() => onAddNode('dataSource')} title="Add Data Source">
        <FaDatabase className="button-icon" /> Add Source
      </button>
      <button onClick={() => onAddNode('processor')} title="Add Processor">
        <FaCogs className="button-icon" /> Add Processor
      </button>
      <button onClick={() => onAddNode('output')} title="Add Output">
        <FaFileExport className="button-icon" /> Add Output
      </button>
      
      <div className="toolbar-divider"></div>
      
      <button className="action-button save-button" onClick={saveWorkflow} title="Save Workflow">
        <FaSave className="button-icon" />
        <span className="button-text">Save</span>
      </button>
      
      <label className="action-button load-button" title="Load Workflow">
        <FaUpload className="button-icon" />
        <span className="button-text">Load</span>
        <input 
          type="file" 
          accept=".json" 
          style={{ display: 'none' }} 
          onChange={loadWorkflow} 
        />
      </label>
      
      <button className="action-button export-button" onClick={handleExport} title="Export as AsyncAPI">
        <FaFileCode className="button-icon" />
        <span className="button-text">AsyncAPI</span>
      </button>
    </div>
  );
};

export default NodeToolbar;