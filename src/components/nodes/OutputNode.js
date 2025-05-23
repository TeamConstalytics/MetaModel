import React from 'react';
import { Handle, Position } from 'reactflow';
import { FaSave, FaFileExport, FaGlobe, FaProjectDiagram } from 'react-icons/fa';
import { SiApachekafka, SiMongodb, SiElasticsearch } from 'react-icons/si';

const OutputNode = ({ data }) => {
  // Determine icon based on subtype
  const getIcon = () => {
    switch (data.subtype) {
      case 'file':
        return <FaFileExport className="node-icon-svg" />;
      case 'api':
        return <FaGlobe className="node-icon-svg" />;
      case 'kafka':
        return <SiApachekafka className="node-icon-svg" />;
      case 'mongodb':
        return <SiMongodb className="node-icon-svg" />;
      case 'elastic':
        return <SiElasticsearch className="node-icon-svg" />;
      case 'neo4j':
        return <FaProjectDiagram className="node-icon-svg" />;
      case 'database':
      default:
        return <FaSave className="node-icon-svg" />;
    }
  };

  return (
    <div className="node-content">
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: '#FF5722' }}
      />
      
      <div className="node-icon">{getIcon()}</div>
      <div className="node-header">{data.label}</div>
      <div className="node-description">{data.description}</div>
      
      {/* No output handle for output node */}
    </div>
  );
};

export default OutputNode;