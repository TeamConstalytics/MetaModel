import React from 'react';
import { Handle, Position } from 'reactflow';

const DataSourceNode = ({ data }) => {
  // Determine icon based on subtype
  let icon = '📊';
  if (data.subtype === 'file') {
    icon = '📄';
  } else if (data.subtype === 'api') {
    icon = '🔌';
  }

  return (
    <div className="node-content">
      <div className="node-icon">{icon}</div>
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