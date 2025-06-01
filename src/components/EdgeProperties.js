import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrash, FaSave, FaPlus, FaTags } from 'react-icons/fa';
import './NodeProperties.css'; // Reuse the same CSS for tags and bindings

const EdgeProperties = ({ selectedEdge, onUpdateEdgeData, onClose, onDeleteEdge, ontology, inRightPanel = false }) => {
  const [edgeData, setEdgeData] = useState({
    label: selectedEdge?.data?.label || '',
    entityId: selectedEdge?.data?.entityId || '',
    description: selectedEdge?.data?.description || '',
    properties: selectedEdge?.data?.properties || {},
    tags: selectedEdge?.data?.tags || {},
    bindings: selectedEdge?.data?.bindings || {}
  });
  
  const [newTagKey, setNewTagKey] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [newBindingKey, setNewBindingKey] = useState('');
  const [newBindingValue, setNewBindingValue] = useState('');

  // Update local state when selected edge changes
  useEffect(() => {
    if (selectedEdge) {
      console.log('Selected edge data:', selectedEdge.data);
      const initialData = {
        label: selectedEdge.data?.label || '',
        entityId: selectedEdge.data?.entityId || '',
        description: selectedEdge.data?.description || '',
        properties: selectedEdge.data?.properties || {},
        tags: selectedEdge.data?.tags || {},
        bindings: selectedEdge.data?.bindings || {}
      };
      setEdgeData(initialData);
    }
  }, [selectedEdge]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdgeData({
      ...edgeData,
      [name]: value
    });
  };
  
  // Handle property value changes
  const handlePropertyChange = (propId, value) => {
    setEdgeData({
      ...edgeData,
      properties: {
        ...edgeData.properties,
        [propId]: value
      }
    });
  };

  const handleSave = () => {
    console.log('Saving edge data:', edgeData);
    onUpdateEdgeData(selectedEdge.id, edgeData);
  };

  const handleDelete = () => {
    onDeleteEdge(selectedEdge.id);
  };
  
  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTagKey.trim() === '') return;
    
    setEdgeData({
      ...edgeData,
      tags: {
        ...edgeData.tags,
        [newTagKey]: newTagValue
      }
    });
    
    // Clear inputs
    setNewTagKey('');
    setNewTagValue('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (key) => {
    const updatedTags = {...edgeData.tags};
    delete updatedTags[key];
    
    setEdgeData({
      ...edgeData,
      tags: updatedTags
    });
  };
  
  // Handle adding a new binding
  const handleAddBinding = () => {
    if (newBindingKey.trim() === '') return;
    
    setEdgeData({
      ...edgeData,
      bindings: {
        ...edgeData.bindings,
        [newBindingKey]: newBindingValue
      }
    });
    
    // Clear inputs
    setNewBindingKey('');
    setNewBindingValue('');
  };
  
  // Handle removing a binding
  const handleRemoveBinding = (key) => {
    const updatedBindings = {...edgeData.bindings};
    delete updatedBindings[key];
    
    setEdgeData({
      ...edgeData,
      bindings: updatedBindings
    });
  };

  // Find the selected entity
  const selectedEntity = ontology?.entities?.find(entity => entity.id === edgeData.entityId);
  
  // Debug ontology data
  console.log('Ontology in EdgeProperties:', ontology);
  console.log('Selected Entity ID:', edgeData.entityId);
  console.log('Selected Entity:', selectedEntity);

  return (
    <div className={inRightPanel ? "right-panel-properties" : "edge-properties"}>
      {!inRightPanel && (
        <div className="properties-header">
          <h3>Edge Properties</h3>
          <button className="close-properties-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="property">
        <label>Label</label>
        <input
          type="text"
          name="label"
          value={edgeData.label || ''}
          onChange={handleChange}
          placeholder="Edge Label"
        />
      </div>

      <div className="property">
        <label>Entity</label>
        <select
          name="entityId"
          value={edgeData.entityId || ''}
          onChange={handleChange}
        >
          <option value="">-- Select Entity --</option>
          {ontology?.entities?.map(entity => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEntity && (
        <div className="property-section">
          <h4>Entity Properties</h4>
          <div className="entity-properties-list">
            {selectedEntity.properties.map(prop => (
              <div key={prop.id} className="entity-property-item">
                <label className="property-name">{prop.name}</label>
                {prop.type === 'string' && (
                  <input
                    type="text"
                    value={edgeData.properties[prop.id] || ''}
                    onChange={(e) => handlePropertyChange(prop.id, e.target.value)}
                    placeholder={`Enter ${prop.name}`}
                  />
                )}
                {prop.type === 'number' && (
                  <input
                    type="number"
                    value={edgeData.properties[prop.id] || ''}
                    onChange={(e) => handlePropertyChange(prop.id, e.target.value)}
                    placeholder={`Enter ${prop.name}`}
                  />
                )}
                {prop.type === 'boolean' && (
                  <select
                    value={edgeData.properties[prop.id] || ''}
                    onChange={(e) => handlePropertyChange(prop.id, e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                )}
                <span className="property-type">({prop.type})</span>
              </div>
            ))}
            {selectedEntity.properties.length === 0 && (
              <p className="no-properties">No properties defined for this entity</p>
            )}
          </div>
        </div>
      )}

      <div className="property">
        <label>Description</label>
        <textarea
          name="description"
          value={edgeData.description || ''}
          onChange={handleChange}
          placeholder="Edge Description"
        />
      </div>

      <div className="edge-type-badge">
        Edge ID: {selectedEdge.id}
      </div>

      <div className="edge-type-badge">
        Source: {selectedEdge.source}
      </div>

      <div className="edge-type-badge">
        Target: {selectedEdge.target}
      </div>

      {/* Tags Section */}
      <div className="property-section">
        <h4><FaTags /> Tags</h4>
        <div className="tags-container">
          {Object.entries(edgeData.tags || {}).map(([key, value]) => (
            <div key={key} className="tag-item">
              <span className="tag-key">{key}:</span>
              <span className="tag-value">{value}</span>
              <button 
                className="remove-tag-button" 
                onClick={() => handleRemoveTag(key)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <div className="add-tag-form">
          <input
            type="text"
            placeholder="Key"
            value={newTagKey}
            onChange={(e) => setNewTagKey(e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={newTagValue}
            onChange={(e) => setNewTagValue(e.target.value)}
          />
          <button 
            className="add-tag-button" 
            onClick={handleAddTag}
          >
            <FaPlus /> Add Tag
          </button>
        </div>
      </div>

      {/* Bindings Section */}
      <div className="property-section">
        <h4>Bindings</h4>
        <div className="bindings-container">
          {Object.entries(edgeData.bindings || {}).map(([key, value]) => (
            <div key={key} className="binding-item">
              <span className="binding-key">{key}:</span>
              <span className="binding-value">{value}</span>
              <button 
                className="remove-binding-button" 
                onClick={() => handleRemoveBinding(key)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <div className="add-binding-form">
          <input
            type="text"
            placeholder="Key"
            value={newBindingKey}
            onChange={(e) => setNewBindingKey(e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={newBindingValue}
            onChange={(e) => setNewBindingValue(e.target.value)}
          />
          <button 
            className="add-binding-button" 
            onClick={handleAddBinding}
          >
            <FaPlus /> Add Binding
          </button>
        </div>
      </div>

      <div className="property-buttons">
        <button className="delete-button" onClick={handleDelete}>
          <FaTrash /> Delete
        </button>
        <button className="save-properties-button" onClick={handleSave}>
          <FaSave /> Save
        </button>
      </div>
    </div>
  );
};

export default EdgeProperties;