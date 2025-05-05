import React from 'react';
import { useCallback } from 'react';
import { 
  FaDatabase, FaFileAlt, FaPlug, FaFilter, FaRandom, 
  FaChartBar, FaSave, FaFileExport, FaGlobe 
} from 'react-icons/fa';
import { SiApachekafka } from 'react-icons/si';
import { BiData } from 'react-icons/bi';

const LeftPanel = () => {
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

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h3><BiData className="panel-header-icon" /> Components</h3>
      </div>
      <div className="panel-section">
        <h4>Data Sources</h4>
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
      </div>

      <div className="panel-section">
        <h4>Processors</h4>
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

      <div className="panel-section">
        <h4>Outputs</h4>
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
      </div>
    </div>
  );
};

export default LeftPanel;