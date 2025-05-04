import React from 'react';
import { Handle, Position } from 'reactflow';

const DataSourceNode = ({ data }) => {
  return (
    <div className="node-content">
      <div className="node-icon">📊</div>
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