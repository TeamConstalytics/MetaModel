import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import OntologyPanel from './OntologyPanel';
import NodeProperties from './NodeProperties';
import EdgeProperties from './EdgeProperties';

const RightPanel = ({ 
  selectedNode, 
  selectedEdge, 
  onUpdateNodeData, 
  onClose, 
  onDeleteNode, 
  updateEdgeData, 
  deleteEdge, 
  ontology, 
  setOntology 
}) => {
  const [ontologyOpen, setOntologyOpen] = useState(true);
  const [nodePropertiesOpen, setNodePropertiesOpen] = useState(true);
  const [edgePropertiesOpen, setEdgePropertiesOpen] = useState(true);

  return (
    <div className="right-panel">
      {/* Node Properties Section */}
      {selectedNode && (
        <div className="panel-section">
          <div className="section-header" onClick={() => setNodePropertiesOpen(!nodePropertiesOpen)}>
            {nodePropertiesOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
            <h4>Node Properties</h4>
          </div>
          
          {nodePropertiesOpen && (
            <div className="section-content">
              <NodeProperties 
                selectedNode={selectedNode}
                onUpdateNodeData={onUpdateNodeData}
                onClose={onClose}
                onDeleteNode={onDeleteNode}
                inRightPanel={true}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Edge Properties Section */}
      {selectedEdge && (
        <div className="panel-section">
          <div className="section-header" onClick={() => setEdgePropertiesOpen(!edgePropertiesOpen)}>
            {edgePropertiesOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
            <h4>Edge Properties</h4>
          </div>
          
          {edgePropertiesOpen && (
            <div className="section-content">
              <EdgeProperties 
                selectedEdge={selectedEdge}
                onUpdateEdgeData={updateEdgeData}
                onClose={onClose}
                onDeleteEdge={deleteEdge}
                ontology={ontology}
                inRightPanel={true}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Ontology Section */}
      <div className="panel-section">
        <div className="section-header" onClick={() => setOntologyOpen(!ontologyOpen)}>
          {ontologyOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
          <h4>Ontology</h4>
        </div>
        
        {ontologyOpen && (
          <div className="section-content">
            <OntologyPanel 
              ontology={ontology} 
              setOntology={setOntology}
              inRightPanel={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;