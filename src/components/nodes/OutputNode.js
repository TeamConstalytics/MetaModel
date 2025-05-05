import React from 'react';
import { Handle, Position } from 'reactflow';

const OutputNode = ({ data }) => {
  // Determine icon based on subtype
  let icon = '💾';
  if (data.subtype === 'file') {
    icon = '📝';
  } else if (data.subtype === 'api') {
    icon = '📡';
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
      
      {/* No output handle for output node */}
    </div>
  );
};

export default OutputNode;