import { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Custom node components
import DataSourceNode from './components/nodes/DataSourceNode';
import ProcessorNode from './components/nodes/ProcessorNode';
import OutputNode from './components/nodes/OutputNode';
import NodeToolbar from './components/NodeToolbar';

// Initial nodes and edges
const initialNodes = [
  {
    id: '1',
    type: 'dataSource',
    position: { x: 250, y: 100 },
    data: { label: 'Data Source', description: 'CSV File Input' },
  },
  {
    id: '2',
    type: 'processor',
    position: { x: 250, y: 250 },
    data: { label: 'Data Processor', description: 'Filter & Transform' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 250, y: 400 },
    data: { label: 'Output', description: 'Database Output' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

// Node types mapping
const nodeTypes = {
  dataSource: DataSourceNode,
  processor: ProcessorNode,
  output: OutputNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Add new node to the canvas
  const onAddNode = useCallback(
    (type) => {
      const newNode = {
        id: `${nodes.length + 1}`,
        type,
        position: { x: 250, y: 100 + nodes.length * 100 },
        data: { 
          label: type === 'dataSource' 
            ? 'New Data Source' 
            : type === 'processor' 
              ? 'New Processor' 
              : 'New Output',
          description: 'Click to configure'
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  // Update node data
  const onUpdateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  return (
    <div className="App">
      <div className="header">
        <h1>PNC Meta Model - Data Product Designer</h1>
      </div>
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          
          <Panel position="top-right">
            <NodeToolbar onAddNode={onAddNode} />
          </Panel>
        </ReactFlow>
      </div>
      
      {selectedNode && (
        <div className="node-properties">
          <h3>Node Properties</h3>
          <div className="property">
            <label>Label:</label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) =>
                onUpdateNodeData(selectedNode.id, { label: e.target.value })
              }
            />
          </div>
          <div className="property">
            <label>Description:</label>
            <input
              type="text"
              value={selectedNode.data.description}
              onChange={(e) =>
                onUpdateNodeData(selectedNode.id, { description: e.target.value })
              }
            />
          </div>
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
