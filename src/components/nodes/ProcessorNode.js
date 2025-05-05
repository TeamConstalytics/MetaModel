import React from 'react';
import { Handle, Position } from 'reactflow';

const ProcessorNode = ({ data }) => {
  // Determine icon based on subtype
  let icon = '⚙️';
  if (data.subtype === 'filter') {
    icon = '🔍';
  } else if (data.subtype === 'transform') {
    icon = '🔄';
  } else if (data.subtype === 'aggregate') {
    icon = '📊';
  } else if (data.subtype === 'kafka') {
    icon = '📬';
  }

  return (
    <div className="node-content">
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: '#FF5722' }}
      />
      
      <div className="node-icon">{icon}</div>
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