import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import { MdOutlineCategory } from 'react-icons/md';

const OntologyPanel = ({ ontology, setOntology, inRightPanel = false }) => {
  const [entities, setEntities] = useState(ontology?.entities || []);
  const [newEntityName, setNewEntityName] = useState('');
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyType, setNewPropertyType] = useState('string');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (ontology?.entities) {
      setEntities(ontology.entities);
    }
  }, [ontology]);

  useEffect(() => {
    setOntology({ ...ontology, entities });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities]);

  const addEntity = () => {
    if (newEntityName.trim() === '') return;
    
    if (editMode && editItem) {
      // Update existing entity
      setEntities(entities.map(entity => 
        entity.id === editItem.id 
          ? { ...entity, name: newEntityName } 
          : entity
      ));
      setEditMode(false);
      setEditItem(null);
    } else {
      // Add new entity
      const newEntity = {
        id: `entity_${Date.now()}`,
        name: newEntityName,
        properties: []
      };
      setEntities([...entities, newEntity]);
    }
    
    setNewEntityName('');
  };

  const deleteEntity = (entityId) => {
    setEntities(entities.filter(entity => entity.id !== entityId));
    if (selectedEntity?.id === entityId) {
      setSelectedEntity(null);
    }
  };

  const editEntity = (entity) => {
    setNewEntityName(entity.name);
    setEditMode(true);
    setEditItem(entity);
  };

  const addProperty = () => {
    if (!selectedEntity || newPropertyName.trim() === '') return;
    
    if (editMode && editItem) {
      // Update existing property
      const updatedEntities = entities.map(entity => {
        if (entity.id === selectedEntity.id) {
          const updatedProperties = entity.properties.map(prop => 
            prop.id === editItem.id 
              ? { ...prop, name: newPropertyName, type: newPropertyType } 
              : prop
          );
          return { ...entity, properties: updatedProperties };
        }
        return entity;
      });
      setEntities(updatedEntities);
      setEditMode(false);
      setEditItem(null);
    } else {
      // Add new property
      const newProperty = {
        id: `prop_${Date.now()}`,
        name: newPropertyName,
        type: newPropertyType
      };
      
      const updatedEntities = entities.map(entity => {
        if (entity.id === selectedEntity.id) {
          return {
            ...entity,
            properties: [...entity.properties, newProperty]
          };
        }
        return entity;
      });
      
      setEntities(updatedEntities);
    }
    
    setNewPropertyName('');
    setNewPropertyType('string');
  };

  const deleteProperty = (propertyId) => {
    const updatedEntities = entities.map(entity => {
      if (entity.id === selectedEntity.id) {
        return {
          ...entity,
          properties: entity.properties.filter(prop => prop.id !== propertyId)
        };
      }
      return entity;
    });
    
    setEntities(updatedEntities);
  };

  const editProperty = (property) => {
    setNewPropertyName(property.name);
    setNewPropertyType(property.type);
    setEditMode(true);
    setEditItem(property);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditItem(null);
    setNewEntityName('');
    setNewPropertyName('');
    setNewPropertyType('string');
  };

  return (
    <div className={inRightPanel ? "right-panel-ontology" : "ontology-panel"}>
      {!inRightPanel && (
        <div className="panel-header">
          <h3><MdOutlineCategory className="panel-header-icon" /> Ontology</h3>
        </div>
      )}
      
      <div className="panel-section">
        <h4>Entities</h4>
        <div className="entity-form">
          <input
            type="text"
            placeholder="Entity name"
            value={newEntityName}
            onChange={(e) => setNewEntityName(e.target.value)}
          />
          <div className="entity-form-buttons">
            {editMode ? (
              <>
                <button className="save-button" onClick={addEntity}>
                  <FaSave /> Update
                </button>
                <button className="cancel-button" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="add-button" onClick={addEntity}>
                <FaPlus /> Add Entity
              </button>
            )}
          </div>
        </div>
        
        <div className="entity-list">
          {entities.map(entity => (
            <div 
              key={entity.id} 
              className={`entity-item ${selectedEntity?.id === entity.id ? 'selected' : ''}`}
              onClick={() => setSelectedEntity(entity)}
            >
              <div className="entity-name">{entity.name}</div>
              <div className="entity-actions">
                <button className="edit-button" onClick={(e) => {
                  e.stopPropagation();
                  editEntity(entity);
                }}>
                  <FaEdit />
                </button>
                <button className="delete-button" onClick={(e) => {
                  e.stopPropagation();
                  deleteEntity(entity.id);
                }}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedEntity && (
        <div className="panel-section">
          <h4>Properties for {selectedEntity.name}</h4>
          <div className="property-form">
            <input
              type="text"
              placeholder="Property name"
              value={newPropertyName}
              onChange={(e) => setNewPropertyName(e.target.value)}
            />
            <select
              value={newPropertyType}
              onChange={(e) => setNewPropertyType(e.target.value)}
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
            <div className="property-form-buttons">
              {editMode ? (
                <>
                  <button className="save-button" onClick={addProperty}>
                    <FaSave /> Update
                  </button>
                  <button className="cancel-button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="add-button" onClick={addProperty}>
                  <FaPlus /> Add Property
                </button>
              )}
            </div>
          </div>
          
          <div className="property-list">
            {selectedEntity.properties.map(property => (
              <div key={property.id} className="property-item">
                <div className="property-info">
                  <span className="property-name">{property.name}</span>
                  <span className="property-type">{property.type}</span>
                </div>
                <div className="property-actions">
                  <button className="edit-button" onClick={() => editProperty(property)}>
                    <FaEdit />
                  </button>
                  <button className="delete-button" onClick={() => deleteProperty(property.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OntologyPanel;