import React from 'react';
import { Handle, Position } from 'reactflow';
import { FaDatabase, FaFileAlt, FaPlug } from 'react-icons/fa';

const DataSourceNode = ({ data }) => {
  // Determine icon based on subtype
  const getIcon = () => {
    switch (data.subtype) {
      case 'file':
        return <FaFileAlt className="node-icon-svg" />;
      case 'api':
        return <FaPlug className="node-icon-svg" />;
      case 'database':
      default:
        return <FaDatabase className="node-icon-svg" />;
    }
  };

  return (
    <div className="node-content">
      <div className="node-icon">{getIcon()}</div>
      <div className="node-header">{data.label}</div>
      <div className="node-description">{data.description}</div>
      
      {/* Only output handle for data source */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: '#4CAF50' }}
      />
    </div>
  );
};

export default DataSourceNode;