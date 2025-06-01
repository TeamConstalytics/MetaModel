import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Initial nodes and edges for ontology
const initialOntologyNodes = [
  {
    id: 'entity1',
    type: 'entity',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Customer', 
      properties: [
        { id: 'prop1', name: 'Name', type: 'string' },
        { id: 'prop2', name: 'Age', type: 'number' }
      ]
    },
    style: {
      width: 150,
      height: 150,
      borderRadius: '50%',
      border: '2px solid #4F46E5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)',
    }
  },
  {
    id: 'entity2',
    type: 'entity',
    position: { x: 250, y: 350 },
    data: { 
      label: 'Order', 
      properties: [
        { id: 'prop3', name: 'OrderID', type: 'string' },
        { id: 'prop4', name: 'Amount', type: 'number' }
      ]
    },
    style: {
      width: 150,
      height: 150,
      borderRadius: '50%',
      border: '2px solid #4F46E5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)',
    }
  },
];

const initialOntologyEdges = [
  { 
    id: 'e1-2', 
    source: 'entity1', 
    target: 'entity2', 
    label: 'places',
    type: 'smoothstep',
    animated: true,
    style: { 
      stroke: '#6366F1', 
      strokeWidth: 2,
      strokeDasharray: '5,5' 
    },
    labelStyle: { 
      fill: '#4F46E5', 
      fontWeight: 500,
      fontSize: 12,
      background: 'white',
      padding: '2px 4px',
      borderRadius: '4px',
      border: '1px solid #6366F1'
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: '#6366F1',
    },
    data: { 
      label: 'places',
      properties: [
        { id: 'rel_prop1', name: 'Date', type: 'string' }
      ]
    }
  },
];

// Custom Entity Node
const EntityNode = ({ data }) => {
  return (
    <div className="ontology-entity-circle">
      <div className="entity-circle-content">
        <div className="entity-circle-label">{data.label}</div>
        <div className="entity-circle-properties-count">
          {data.properties.length > 0 ? `${data.properties.length} properties` : 'No properties'}
        </div>
      </div>
      <div className="entity-circle-actions">
        <button className="entity-circle-button">
          <FaEdit size={12} />
        </button>
        <button className="entity-circle-button">
          <FaPlus size={12} />
        </button>
      </div>
    </div>
  );
};

// Node types mapping
const nodeTypes = {
  entity: EntityNode,
};

const OntologyManagement = ({ ontology, setOntology }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialOntologyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialOntologyEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#6366F1', 
          strokeWidth: 2,
          strokeDasharray: '5,5' 
        },
        labelStyle: { 
          fill: '#4F46E5', 
          fontWeight: 500,
          fontSize: 12,
          background: 'white',
          padding: '2px 4px',
          borderRadius: '4px',
          border: '1px solid #6366F1'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: '#6366F1',
        },
        data: {
          label: 'Relationship',
          properties: []
        },
        label: 'Relationship'
      };
      return setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);
  
  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  // Add new entity node
  const addEntityNode = useCallback(() => {
    const newNode = {
      id: `entity${nodes.length + 1}`,
      type: 'entity',
      position: { x: 250, y: 100 + nodes.length * 200 },
      data: { 
        label: `New Entity ${nodes.length + 1}`, 
        properties: []
      },
      style: {
        width: 150,
        height: 150,
        borderRadius: '50%',
        border: '2px solid #4F46E5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)',
      }
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="ontology-management">
      <div className="ontology-toolbar">
        <button className="ontology-button" onClick={addEntityNode}>
          <FaPlus className="button-icon" />
          Add Entity
        </button>
      </div>
      <div className="ontology-flow-container" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      
      {/* Node Properties Popup */}
      {selectedNode && (
        <div className="properties-popup">
          <div className="properties-popup-header">
            <h3>Entity Properties</h3>
            <button className="close-popup-button" onClick={() => setSelectedNode(null)}>×</button>
          </div>
          <div className="properties-popup-content">
            <div className="property">
              <label>Entity Name:</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  setNodes(nodes.map(node => {
                    if (node.id === selectedNode.id) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          label: e.target.value
                        }
                      };
                    }
                    return node;
                  }));
                }}
              />
            </div>
            
            <div className="property-section">
              <h4>Properties</h4>
              {selectedNode.data.properties.map((prop, index) => (
                <div key={prop.id} className="entity-property-item">
                  <div className="property-info">
                    <input
                      type="text"
                      value={prop.name}
                      onChange={(e) => {
                        const updatedProperties = [...selectedNode.data.properties];
                        updatedProperties[index] = {
                          ...updatedProperties[index],
                          name: e.target.value
                        };
                        setNodes(nodes.map(node => {
                          if (node.id === selectedNode.id) {
                            return {
                              ...node,
                              data: {
                                ...node.data,
                                properties: updatedProperties
                              }
                            };
                          }
                          return node;
                        }));
                      }}
                      placeholder="Property Name"
                    />
                    <select
                      value={prop.type}
                      onChange={(e) => {
                        const updatedProperties = [...selectedNode.data.properties];
                        updatedProperties[index] = {
                          ...updatedProperties[index],
                          type: e.target.value
                        };
                        setNodes(nodes.map(node => {
                          if (node.id === selectedNode.id) {
                            return {
                              ...node,
                              data: {
                                ...node.data,
                                properties: updatedProperties
                              }
                            };
                          }
                          return node;
                        }));
                      }}
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                  <button
                    className="delete-property-button"
                    onClick={() => {
                      const updatedProperties = selectedNode.data.properties.filter((_, i) => i !== index);
                      setNodes(nodes.map(node => {
                        if (node.id === selectedNode.id) {
                          return {
                            ...node,
                            data: {
                              ...node.data,
                              properties: updatedProperties
                            }
                          };
                        }
                        return node;
                      }));
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              <button
                className="add-property-button"
                onClick={() => {
                  const newProperty = {
                    id: `prop_${Date.now()}`,
                    name: 'New Property',
                    type: 'string'
                  };
                  setNodes(nodes.map(node => {
                    if (node.id === selectedNode.id) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          properties: [...node.data.properties, newProperty]
                        }
                      };
                    }
                    return node;
                  }));
                }}
              >
                <FaPlus className="button-icon" />
                Add Property
              </button>
            </div>
            
            <div className="property-buttons">
              <button
                className="delete-button"
                onClick={() => {
                  setNodes(nodes.filter(node => node.id !== selectedNode.id));
                  setEdges(edges.filter(edge => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
                  setSelectedNode(null);
                }}
              >
                <FaTrash /> Delete Entity
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edge Properties Popup */}
      {selectedEdge && (
        <div className="properties-popup">
          <div className="properties-popup-header">
            <h3>Relationship Properties</h3>
            <button className="close-popup-button" onClick={() => setSelectedEdge(null)}>×</button>
          </div>
          <div className="properties-popup-content">
            <div className="property">
              <label>Relationship Name:</label>
              <input
                type="text"
                value={selectedEdge.label || ''}
                onChange={(e) => {
                  setEdges(edges.map(edge => {
                    if (edge.id === selectedEdge.id) {
                      return {
                        ...edge,
                        label: e.target.value,
                        data: {
                          ...edge.data,
                          label: e.target.value
                        }
                      };
                    }
                    return edge;
                  }));
                }}
              />
            </div>
            
            <div className="property-section">
              <h4>Properties</h4>
              {selectedEdge.data?.properties?.map((prop, index) => (
                <div key={prop.id} className="entity-property-item">
                  <div className="property-info">
                    <input
                      type="text"
                      value={prop.name}
                      onChange={(e) => {
                        const updatedProperties = [...selectedEdge.data.properties];
                        updatedProperties[index] = {
                          ...updatedProperties[index],
                          name: e.target.value
                        };
                        setEdges(edges.map(edge => {
                          if (edge.id === selectedEdge.id) {
                            return {
                              ...edge,
                              data: {
                                ...edge.data,
                                properties: updatedProperties
                              }
                            };
                          }
                          return edge;
                        }));
                      }}
                      placeholder="Property Name"
                    />
                    <select
                      value={prop.type}
                      onChange={(e) => {
                        const updatedProperties = [...selectedEdge.data.properties];
                        updatedProperties[index] = {
                          ...updatedProperties[index],
                          type: e.target.value
                        };
                        setEdges(edges.map(edge => {
                          if (edge.id === selectedEdge.id) {
                            return {
                              ...edge,
                              data: {
                                ...edge.data,
                                properties: updatedProperties
                              }
                            };
                          }
                          return edge;
                        }));
                      }}
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                  <button
                    className="delete-property-button"
                    onClick={() => {
                      const updatedProperties = selectedEdge.data.properties.filter((_, i) => i !== index);
                      setEdges(edges.map(edge => {
                        if (edge.id === selectedEdge.id) {
                          return {
                            ...edge,
                            data: {
                              ...edge.data,
                              properties: updatedProperties
                            }
                          };
                        }
                        return edge;
                      }));
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              <button
                className="add-property-button"
                onClick={() => {
                  const newProperty = {
                    id: `rel_prop_${Date.now()}`,
                    name: 'New Property',
                    type: 'string'
                  };
                  setEdges(edges.map(edge => {
                    if (edge.id === selectedEdge.id) {
                      return {
                        ...edge,
                        data: {
                          ...edge.data,
                          properties: [...(edge.data.properties || []), newProperty]
                        }
                      };
                    }
                    return edge;
                  }));
                }}
              >
                <FaPlus className="button-icon" />
                Add Property
              </button>
            </div>
            
            <div className="property-buttons">
              <button
                className="delete-button"
                onClick={() => {
                  setEdges(edges.filter(edge => edge.id !== selectedEdge.id));
                  setSelectedEdge(null);
                }}
              >
                <FaTrash /> Delete Relationship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OntologyManagement;