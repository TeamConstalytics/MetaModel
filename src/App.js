import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import './theme.css';

// Custom node components
import DataSourceNode from './components/nodes/DataSourceNode';
import ProcessorNode from './components/nodes/ProcessorNode';
import OutputNode from './components/nodes/OutputNode';
import NodeToolbar from './components/NodeToolbar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import ExportButton from './components/ExportButton';
import NodeProperties from './components/NodeProperties';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import WelcomeModal from './components/WelcomeModal';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import HistoryManager from './utils/historyManager';

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

function AppContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // Initialize ontology with some example entities if needed
  const [ontology, setOntology] = useState({ 
    entities: [
      {
        id: 'entity_default_1',
        name: 'Relationship',
        properties: [
          { id: 'prop_1', name: 'Type', type: 'string' },
          { id: 'prop_2', name: 'Strength', type: 'number' }
        ]
      },
      {
        id: 'entity_default_2',
        name: 'Dependency',
        properties: [
          { id: 'prop_3', name: 'Direction', type: 'string' },
          { id: 'prop_4', name: 'Required', type: 'boolean' }
        ]
      }
    ] 
  });
  
  // Debug ontology state
  console.log('Initial ontology state:', ontology);
  const reactFlowWrapper = useRef(null);
  const exportButtonRef = useRef(null);
  const reactFlowInstance2 = useReactFlow();
  
  // Initialize history manager for undo/redo
  const historyManagerRef = useRef(new HistoryManager());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Update history state
  useEffect(() => {
    if (reactFlowInstance) {
      setCanUndo(historyManagerRef.current.canUndo());
      setCanRedo(historyManagerRef.current.canRedo());
    }
  }, [nodes, edges, reactFlowInstance]);

  // Save current state to history when nodes or edges change
  useEffect(() => {
    if (reactFlowInstance) {
      const currentState = reactFlowInstance.toObject();
      historyManagerRef.current.push(currentState);
      setCanUndo(historyManagerRef.current.canUndo());
      setCanRedo(historyManagerRef.current.canRedo());
    }
  }, [nodes, edges, reactFlowInstance]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params) => {
      console.log('Creating new connection with params:', params);
      const newEdge = {
        ...params,
        type: 'default',
        animated: false,
        style: { stroke: '#555' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#555',
        },
        data: {
          label: '',
          entityId: '',
          description: ''
        },
        label: '' // Add label at the edge level for display
      };
      console.log('Created new edge:', newEdge);
      const result = setEdges((eds) => addEdge(newEdge, eds));
      return result;
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null); // Clear edge selection when a node is clicked
  }, []);

  // Handle background click to clear selection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);
  
  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null); // Clear node selection when an edge is clicked
  }, []);
  
  // Close node properties panel
  const closeNodeProperties = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  // Close edge properties panel
  const closeEdgeProperties = useCallback(() => {
    setSelectedEdge(null);
  }, []);
  
  // Update edge data
  const updateEdgeData = useCallback((edgeId, newData) => {
    console.log('Updating edge with ID:', edgeId);
    console.log('New edge data:', newData);
    
    setEdges((eds) => {
      const updatedEdges = eds.map((edge) => {
        if (edge.id === edgeId) {
          const updatedEdge = {
            ...edge,
            data: {
              ...edge.data,
              ...newData
            },
            label: newData.label || '',
            // Update edge styling based on entity selection
            animated: newData.entityId ? true : false,
            style: { 
              stroke: newData.entityId ? '#007bff' : '#555',
              strokeWidth: newData.entityId ? 2 : 1
            }
          };
          console.log('Updated edge:', updatedEdge);
          return updatedEdge;
        }
        return edge;
      });
      
      console.log('All updated edges:', updatedEdges);
      return updatedEdges;
    });
  }, [setEdges]);
  
  // Delete edge
  const deleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges]);

  // Add new node to the canvas
  const onAddNode = useCallback(
    (type) => {
      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position: { 
          x: 250 + Math.random() * 100, 
          y: 100 + Math.random() * 100 
        },
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
    [setNodes]
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
        id: `node_${Date.now()}`,
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
    [reactFlowInstance, setNodes]
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

  // Delete edge
  const onDeleteEdge = useCallback(
    (edgeId) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      setSelectedEdge(null);
    },
    [setEdges]
  );

  // Handle keyboard delete
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNode) {
          onDeleteNode(selectedNode.id);
        } else if (selectedEdge) {
          onDeleteEdge(selectedEdge.id);
        }
      }
    },
    [selectedNode, selectedEdge, onDeleteNode, onDeleteEdge]
  );

  // Add event listener for keyboard delete
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  // Undo function
  const handleUndo = useCallback(() => {
    const prevState = historyManagerRef.current.undo();
    if (prevState) {
      const { nodes: prevNodes, edges: prevEdges, viewport } = prevState;
      setNodes(prevNodes);
      setEdges(prevEdges);
      if (viewport && reactFlowInstance2) {
        reactFlowInstance2.setViewport(viewport);
      }
    }
  }, [setNodes, setEdges, reactFlowInstance2]);

  // Redo function
  const handleRedo = useCallback(() => {
    const nextState = historyManagerRef.current.redo();
    if (nextState) {
      const { nodes: nextNodes, edges: nextEdges, viewport } = nextState;
      setNodes(nextNodes);
      setEdges(nextEdges);
      if (viewport && reactFlowInstance2) {
        reactFlowInstance2.setViewport(viewport);
      }
    }
  }, [setNodes, setEdges, reactFlowInstance2]);

  // Save workflow function
  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const json = JSON.stringify(flow, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pnc-metamodel-workflow.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [reactFlowInstance]);

  // Export function
  const handleExport = useCallback(() => {
    if (exportButtonRef.current) {
      exportButtonRef.current.handleExport();
    }
  }, []);

  return (
    <div className="App" tabIndex={0}>
      <div className="header">
        <h1>PNC Meta Model - Data Product Designer</h1>
        <ThemeToggle />
      </div>
      <div className="app-content">
        <LeftPanel 
          saveLoadProps={{
            reactFlowInstance,
            setNodes,
            setEdges,
            ontology,
            setOntology
          }}
          exportProps={{
            handleExport: () => {
              if (exportButtonRef.current) {
                exportButtonRef.current.handleExport();
              }
            }
          }}
          onGenerateFlow={(generatedFlow) => {
            if (generatedFlow && generatedFlow.nodes && generatedFlow.edges) {
              // Clear current flow
              setNodes([]);
              setEdges([]);
              
              // Add generated nodes and edges
              setNodes(generatedFlow.nodes || []);
              setEdges(generatedFlow.edges || []);
            }
          }}
        />
        <div className="flow-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            deleteKeyCode={null} // Disable default delete to handle it manually
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
            
            <Panel position="top-right">
              <NodeToolbar 
                onAddNode={onAddNode} 
                saveLoadProps={{
                  reactFlowInstance,
                  setNodes,
                  setEdges,
                  ontology,
                  setOntology
                }}
                exportProps={{
                  handleExport
                }}
                historyProps={{
                  onUndo: handleUndo,
                  onRedo: handleRedo,
                  canUndo,
                  canRedo
                }}
              />
            </Panel>
            
            {/* Hidden export button component */}
            <ExportButton 
              ref={exportButtonRef}
              reactFlowInstance={reactFlowInstance}
              ontology={ontology}
            />
            
            <KeyboardShortcutsHelp />
          </ReactFlow>
        </div>
      
        <RightPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNodeData={onUpdateNodeData}
          onClose={selectedNode ? closeNodeProperties : closeEdgeProperties}
          onDeleteNode={onDeleteNode}
          updateEdgeData={updateEdgeData}
          deleteEdge={deleteEdge}
          ontology={ontology}
          setOntology={setOntology}
        />
        
        <KeyboardShortcuts 
          onAddDataSource={() => onAddNode('dataSource')}
          onAddProcessor={() => onAddNode('processor')}
          onAddOutput={() => onAddNode('output')}
          onSave={handleSave}
          onExport={handleExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        
        <WelcomeModal />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
