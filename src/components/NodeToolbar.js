import React from 'react';
import { FaDatabase, FaCogs, FaFileExport, FaFileCode } from 'react-icons/fa';
import SaveLoadButtons from './SaveLoadButtons';

const NodeToolbar = ({ onAddNode, saveLoadProps, exportProps }) => {
  const { reactFlowInstance, setNodes, setEdges, ontology, setOntology } = saveLoadProps || {};

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
      
      <SaveLoadButtons 
        reactFlowInstance={reactFlowInstance}
        setNodes={setNodes}
        setEdges={setEdges}
        ontology={ontology}
        setOntology={setOntology}
      />
      
      <button className="action-button export-button" onClick={handleExport} title="Export as AsyncAPI">
        <FaFileCode className="button-icon" />
        <span className="button-text">AsyncAPI</span>
      </button>
    </div>
  );
};

export default NodeToolbar;