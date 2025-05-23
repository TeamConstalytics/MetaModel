import React, { useCallback, useState } from 'react';
import { 
  FaDatabase, FaFileAlt, FaPlug, FaFilter, FaRandom, 
  FaChartBar, FaSave, FaFileExport, FaGlobe, FaChevronDown, 
  FaChevronRight, FaFileCode, FaUpload, FaProjectDiagram
} from 'react-icons/fa';
import { SiApachekafka, SiMongodb, SiElasticsearch } from 'react-icons/si';
import { BiData } from 'react-icons/bi';
import ConversationPrompt from './ConversationPrompt';

const LeftPanel = ({ saveLoadProps, exportProps, onGenerateFlow }) => {
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [processorsOpen, setProcessorsOpen] = useState(true);
  const [outputsOpen, setOutputsOpen] = useState(true);
  const [utilsOpen, setUtilsOpen] = useState(true);
  
  const onDragStart = useCallback((event, nodeType, nodeSubtype, label, description) => {
    const nodeData = {
      type: nodeType,
      subtype: nodeSubtype || '',
      label: label || `New ${nodeType}`,
      description: description || 'Click to configure'
    };
    
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Save workflow to JSON
  const saveWorkflow = () => {
    if (saveLoadProps && saveLoadProps.reactFlowInstance) {
      const { reactFlowInstance, ontology } = saveLoadProps;
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
  };
  
  // Load workflow from file
  const loadWorkflow = (event) => {
    if (saveLoadProps) {
      const { reactFlowInstance, setNodes, setEdges, setOntology } = saveLoadProps;
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
    }
  };

  // Export to AsyncAPI
  const handleExport = () => {
    if (exportProps && exportProps.handleExport) {
      exportProps.handleExport();
    }
  };

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h3><BiData className="panel-header-icon" /> Data Product Concepts</h3>
      </div>
      
      <div className="panel-section">
        <div className="section-header" onClick={() => setSourcesOpen(!sourcesOpen)}>
          {sourcesOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
          <h4>Data Sources</h4>
        </div>
        
        {sourcesOpen && (
          <div className="section-content">
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'database', 'Database Source', 'SQL Database Connection')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaDatabase className="node-icon" />
              </div>
              <div className="dnd-node-label">Database Source</div>
            </div>
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'file', 'File Source', 'CSV, JSON, or other file formats')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaFileAlt className="node-icon" />
              </div>
              <div className="dnd-node-label">File Input</div>
            </div>
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'api', 'API Source', 'REST or GraphQL API endpoint')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaPlug className="node-icon" />
              </div>
              <div className="dnd-node-label">API Source</div>
            </div>
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'kafka', 'Kafka Source', 'Apache Kafka Stream')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiApachekafka className="node-icon" />
              </div>
              <div className="dnd-node-label">Kafka Source</div>
            </div>
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'mongodb', 'MongoDB Source', 'MongoDB Collection')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiMongodb className="node-icon" />
              </div>
              <div className="dnd-node-label">MongoDB Source</div>
            </div>
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'elastic', 'Elasticsearch Source', 'Elasticsearch Index')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiElasticsearch className="node-icon" />
              </div>
              <div className="dnd-node-label">Elasticsearch Source</div>
            </div>
            <div 
              className="dnd-node source" 
              onDragStart={(event) => onDragStart(event, 'dataSource', 'neo4j', 'Neo4J Graph Source', 'Neo4J Graph Database')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaProjectDiagram className="node-icon" />
              </div>
              <div className="dnd-node-label">Neo4J Graph Source</div>
            </div>
          </div>
        )}
      </div>

      <div className="panel-section">
        <div className="section-header" onClick={() => setProcessorsOpen(!processorsOpen)}>
          {processorsOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
          <h4>Processors</h4>
        </div>
        
        {processorsOpen && (
          <div className="section-content">
            <div 
              className="dnd-node processor" 
              onDragStart={(event) => onDragStart(event, 'processor', 'filter', 'Filter Processor', 'Filter data based on conditions')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaFilter className="node-icon" />
              </div>
              <div className="dnd-node-label">Filter</div>
            </div>
            <div 
              className="dnd-node processor" 
              onDragStart={(event) => onDragStart(event, 'processor', 'transform', 'Transform Processor', 'Transform data structure or format')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaRandom className="node-icon" />
              </div>
              <div className="dnd-node-label">Transform</div>
            </div>
            <div 
              className="dnd-node processor" 
              onDragStart={(event) => onDragStart(event, 'processor', 'aggregate', 'Aggregate Processor', 'Group and summarize data')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaChartBar className="node-icon" />
              </div>
              <div className="dnd-node-label">Aggregate</div>
            </div>
            <div 
              className="dnd-node processor" 
              onDragStart={(event) => onDragStart(event, 'processor', 'kafka', 'Kafka Processor', 'Stream processing with Kafka')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiApachekafka className="node-icon" />
              </div>
              <div className="dnd-node-label">Kafka</div>
            </div>
          </div>
        )}
      </div>

      <div className="panel-section">
        <div className="section-header" onClick={() => setOutputsOpen(!outputsOpen)}>
          {outputsOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
          <h4>Outputs</h4>
        </div>
        
        {outputsOpen && (
          <div className="section-content">
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'database', 'Database Output', 'Write to SQL or NoSQL database')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaSave className="node-icon" />
              </div>
              <div className="dnd-node-label">Database</div>
            </div>
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'file', 'File Output', 'Export to CSV, JSON, or other formats')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaFileExport className="node-icon" />
              </div>
              <div className="dnd-node-label">File Output</div>
            </div>
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'api', 'API Output', 'Send data to REST or webhook endpoint')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaGlobe className="node-icon" />
              </div>
              <div className="dnd-node-label">API Output</div>
            </div>
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'kafka', 'Kafka Output', 'Publish to Kafka topics')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiApachekafka className="node-icon" />
              </div>
              <div className="dnd-node-label">Kafka Output</div>
            </div>
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'mongodb', 'MongoDB Output', 'Write to MongoDB collections')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiMongodb className="node-icon" />
              </div>
              <div className="dnd-node-label">MongoDB Output</div>
            </div>
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'elastic', 'Elasticsearch Output', 'Index data in Elasticsearch')} 
              draggable
            >
              <div className="dnd-node-icon">
                <SiElasticsearch className="node-icon" />
              </div>
              <div className="dnd-node-label">Elasticsearch Output</div>
            </div>
            <div 
              className="dnd-node output" 
              onDragStart={(event) => onDragStart(event, 'output', 'neo4j', 'Neo4J Graph Output', 'Store data in Neo4J Graph Database')} 
              draggable
            >
              <div className="dnd-node-icon">
                <FaProjectDiagram className="node-icon" />
              </div>
              <div className="dnd-node-label">Neo4J Graph Output</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="panel-section">
        <div className="section-header" onClick={() => setUtilsOpen(!utilsOpen)}>
          {utilsOpen ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
          <h4>Utilities</h4>
        </div>
        
        {utilsOpen && (
          <div className="section-content">
            <div className="utility-buttons">
              <button className="utility-button" onClick={saveWorkflow}>
                <FaSave className="utility-icon" />
                <span>Save Workflow</span>
              </button>
              
              <label className="utility-button">
                <FaUpload className="utility-icon" />
                <span>Load Workflow</span>
                <input 
                  type="file" 
                  accept=".json" 
                  style={{ display: 'none' }} 
                  onChange={loadWorkflow} 
                />
              </label>
              
              <button className="utility-button" onClick={handleExport}>
                <FaFileCode className="utility-icon" />
                <span>AsyncAPI</span>
              </button>
              
              <ConversationPrompt onGenerateFlow={onGenerateFlow} buttonClassName="utility-button" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;