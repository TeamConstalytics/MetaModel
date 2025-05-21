import React, { useCallback } from 'react';
import { FaSave, FaUpload } from 'react-icons/fa';

const SaveLoadButtons = ({ reactFlowInstance, setNodes, setEdges, ontology, setOntology }) => {
  // Save workflow to JSON
  const saveWorkflow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      
      // Add ontology data to the flow object
      const flowWithOntology = {
        ...flow,
        ontology: ontology
      };
      
      const json = JSON.stringify(flowWithOntology, null, 2);
      
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
  }, [reactFlowInstance, ontology]);
  
  // Load workflow from file
  const loadWorkflow = useCallback((event) => {
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
          
          // Load ontology data if available
          if (flow.ontology) {
            setOntology(flow.ontology);
          }
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
        alert('Failed to load workflow. Invalid file format.');
      }
    };
    
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0]);
    }
  }, [reactFlowInstance, setNodes, setEdges, setOntology]);

  return (
    <div className="save-load-buttons">
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
    </div>
  );
};

export default SaveLoadButtons;