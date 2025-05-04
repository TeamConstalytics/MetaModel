import React from 'react';

const NodeToolbar = ({ onAddNode }) => {
  return (
    <div className="node-toolbar">
      <button onClick={() => onAddNode('dataSource')}>
        Add Data Source
      </button>
      <button onClick={() => onAddNode('processor')}>
        Add Processor
      </button>
      <button onClick={() => onAddNode('output')}>
        Add Output
      </button>
    </div>
  );
};

export default NodeToolbar;