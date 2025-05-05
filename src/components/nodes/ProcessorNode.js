import React from 'react';
import { Handle, Position } from 'reactflow';
import { FaFilter, FaRandom, FaChartBar, FaCogs } from 'react-icons/fa';
import { SiApachekafka } from 'react-icons/si';

const ProcessorNode = ({ data }) => {
  // Determine icon based on subtype
  const getIcon = () => {
    switch (data.subtype) {
      case 'filter':
        return <FaFilter className="node-icon-svg" />;
      case 'transform':
        return <FaRandom className="node-icon-svg" />;
      case 'aggregate':
        return <FaChartBar className="node-icon-svg" />;
      case 'kafka':
        return <SiApachekafka className="node-icon-svg" />;
      default:
        return <FaCogs className="node-icon-svg" />;
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