import { useState, useCallback, useRef } from 'react';
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
import SaveLoadButtons from './components/SaveLoadButtons';
import LeftPanel from './components/LeftPanel';
import ExportButton from './components/ExportButton';

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
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);

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
  
  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      // Check if the dropped element is valid
      if (typeof nodeData === 'undefined' || !nodeData) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `node_${nodes.length + 1}`,
        type: nodeData.type,
        position,
        data: {
          label: nodeData.label || `New ${nodeData.type}`,
          description: nodeData.description || 'Click to configure',
          subtype: nodeData.subtype || null,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes]
  );

  // Delete node
  const onDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  return (
    <div className="App">
      <div className="header">
        <h1>PNC Meta Model - Data Product Designer</h1>
        <div className="header-buttons">
          <SaveLoadButtons 
            reactFlowInstance={reactFlowInstance} 
            setNodes={setNodes} 
            setEdges={setEdges} 
          />
          <ExportButton reactFlowInstance={reactFlowInstance} />
        </div>
      </div>
      <div className="app-content">
        <LeftPanel />
        <div className="flow-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
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
          
          {selectedNode.type === 'dataSource' && (
            <>
              <div className="property">
                <label>Source Type:</label>
                <select
                  value={selectedNode.data.subtype || 'database'}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { subtype: e.target.value })
                  }
                >
                  <option value="database">Database</option>
                  <option value="file">File</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div className="property">
                <label>Connection:</label>
                <input
                  type="text"
                  value={selectedNode.data.connection || ''}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { connection: e.target.value })
                  }
                  placeholder="Connection string or path"
                />
              </div>
              <div className="property">
                <label>Table/File:</label>
                <input
                  type="text"
                  value={selectedNode.data.table || ''}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { table: e.target.value })
                  }
                  placeholder="Table name or file path"
                />
              </div>
              <div className="property">
                <label>Query:</label>
                <textarea
                  value={selectedNode.data.query || ''}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { query: e.target.value })
                  }
                  placeholder="SQL query or data selection"
                  rows={3}
                />
              </div>
            </>
          )}
          
          {selectedNode.type === 'processor' && (
            <>
              <div className="property">
                <label>Processor Type:</label>
                <select
                  value={selectedNode.data.subtype || 'transform'}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { subtype: e.target.value })
                  }
                >
                  <option value="transform">Transform</option>
                  <option value="filter">Filter</option>
                  <option value="aggregate">Aggregate</option>
                  <option value="join">Join</option>
                  <option value="kafka">Kafka</option>
                </select>
              </div>
              <div className="property">
                <label>Business Rules:</label>
                <textarea
                  value={selectedNode.data.rules || ''}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { rules: e.target.value })
                  }
                  placeholder="Define business rules or transformations"
                  rows={4}
                />
              </div>
              {selectedNode.data.subtype === 'kafka' && (
                <>
                  <div className="property">
                    <label>Kafka Topic:</label>
                    <input
                      type="text"
                      value={selectedNode.data.topic || ''}
                      onChange={(e) =>
                        onUpdateNodeData(selectedNode.id, { topic: e.target.value })
                      }
                      placeholder="Topic name"
                    />
                  </div>
                  <div className="property">
                    <label>Broker URL:</label>
                    <input
                      type="text"
                      value={selectedNode.data.brokerUrl || ''}
                      onChange={(e) =>
                        onUpdateNodeData(selectedNode.id, { brokerUrl: e.target.value })
                      }
                      placeholder="Kafka broker URL"
                    />
                  </div>
                </>
              )}
            </>
          )}
          
          {selectedNode.type === 'output' && (
            <>
              <div className="property">
                <label>Output Type:</label>
                <select
                  value={selectedNode.data.subtype || 'database'}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { subtype: e.target.value })
                  }
                >
                  <option value="database">Database</option>
                  <option value="file">File</option>
                  <option value="api">API</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </div>
              <div className="property">
                <label>Destination:</label>
                <input
                  type="text"
                  value={selectedNode.data.destination || ''}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { destination: e.target.value })
                  }
                  placeholder="Connection string, file path, or API endpoint"
                />
              </div>
              <div className="property">
                <label>Format:</label>
                <select
                  value={selectedNode.data.format || 'json'}
                  onChange={(e) =>
                    onUpdateNodeData(selectedNode.id, { format: e.target.value })
                  }
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="parquet">Parquet</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
            </>
          )}
          
          <div className="button-group">
            <button onClick={() => setSelectedNode(null)}>Close</button>
            <button 
              className="delete-button" 
              onClick={() => onDeleteNode(selectedNode.id)}
            >
              Delete Node
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
