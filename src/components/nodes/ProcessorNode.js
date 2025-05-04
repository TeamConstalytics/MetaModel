import React from 'react';
import { Handle, Position } from 'reactflow';

const ProcessorNode = ({ data }) => {
  return (
    <div className="node-content">
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: '#FF5722' }}
      />
      
      <div className="node-icon">⚙️</div>
      <div className="node-header">{data.label}</div>
      <div className="node-description">{data.description}</div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: '#4CAF50' }}
      />
    </div>
  );
};

export default ProcessorNode;