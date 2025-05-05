import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';

const NodeProperties = ({ selectedNode, onUpdateNodeData, onClose, onDeleteNode }) => {
  const [nodeData, setNodeData] = useState({});
  
  useEffect(() => {
    if (selectedNode) {
      setNodeData({...selectedNode.data});
    }
  }, [selectedNode]);
  
  const handleChange = (key, value) => {
    setNodeData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    onUpdateNodeData(selectedNode.id, nodeData);
    onClose();
  };
  
  if (!selectedNode) return null;

  return (
    <div className="node-properties">
      <div className="properties-header">
        <h3>Node Properties</h3>
        <button 
          className="close-properties-button" 
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="property">
        <label>Label:</label>
        <input
          type="text"
          value={nodeData.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
        />
      </div>
      <div className="property">
        <label>Description:</label>
        <input
          type="text"
          value={nodeData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      
      {selectedNode.type === 'dataSource' && (
        <>
          <div className="property-section">
            <h4>Data Source Configuration</h4>
            <div className="property">
              <label>Source Type:</label>
              <select
                value={nodeData.subtype || 'database'}
                onChange={(e) => handleChange('subtype', e.target.value)}
              >
                <option value="database">Database</option>
                <option value="file">File</option>
                <option value="api">API</option>
              </select>
            </div>
            
            {nodeData.subtype === 'database' && (
              <>
                <div className="property">
                  <label>Connection URL:</label>
                  <input
                    type="text"
                    value={nodeData.connectionUrl || ''}
                    onChange={(e) => handleChange('connectionUrl', e.target.value)}
                    placeholder="jdbc:mysql://hostname:port/database"
                  />
                </div>
                <div className="property">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={nodeData.username || ''}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="Database username"
                  />
                </div>
                <div className="property">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={nodeData.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Database password"
                  />
                </div>
                <div className="property">
                  <label>Table:</label>
                  <input
                    type="text"
                    value={nodeData.table || ''}
                    onChange={(e) => handleChange('table', e.target.value)}
                    placeholder="Table name"
                  />
                </div>
                <div className="property">
                  <label>Query:</label>
                  <textarea
                    value={nodeData.query || ''}
                    onChange={(e) => handleChange('query', e.target.value)}
                    placeholder="SELECT * FROM table WHERE condition"
                    rows={3}
                  />
                </div>
              </>
            )}
            
            {nodeData.subtype === 'file' && (
              <>
                <div className="property">
                  <label>File Path:</label>
                  <input
                    type="text"
                    value={nodeData.filePath || ''}
                    onChange={(e) => handleChange('filePath', e.target.value)}
                    placeholder="/path/to/file.csv"
                  />
                </div>
                <div className="property">
                  <label>File Format:</label>
                  <select
                    value={nodeData.fileFormat || 'csv'}
                    onChange={(e) => handleChange('fileFormat', e.target.value)}
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="parquet">Parquet</option>
                    <option value="xml">XML</option>
                  </select>
                </div>
                <div className="property">
                  <label>Delimiter:</label>
                  <input
                    type="text"
                    value={nodeData.delimiter || ','}
                    onChange={(e) => handleChange('delimiter', e.target.value)}
                    placeholder="Delimiter character"
                  />
                </div>
              </>
            )}
            
            {nodeData.subtype === 'api' && (
              <>
                <div className="property">
                  <label>API Endpoint:</label>
                  <input
                    type="text"
                    value={nodeData.apiEndpoint || ''}
                    onChange={(e) => handleChange('apiEndpoint', e.target.value)}
                    placeholder="https://api.example.com/data"
                  />
                </div>
                <div className="property">
                  <label>Method:</label>
                  <select
                    value={nodeData.method || 'GET'}
                    onChange={(e) => handleChange('method', e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="property">
                  <label>Headers:</label>
                  <textarea
                    value={nodeData.headers || ''}
                    onChange={(e) => handleChange('headers', e.target.value)}
                    placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
      
      {selectedNode.type === 'processor' && (
        <>
          <div className="property-section">
            <h4>Processor Configuration</h4>
            <div className="property">
              <label>Processor Type:</label>
              <select
                value={nodeData.subtype || 'transform'}
                onChange={(e) => handleChange('subtype', e.target.value)}
              >
                <option value="transform">Transform</option>
                <option value="filter">Filter</option>
                <option value="aggregate">Aggregate</option>
                <option value="join">Join</option>
                <option value="kafka">Kafka</option>
              </select>
            </div>
            
            {nodeData.subtype === 'filter' && (
              <div className="property">
                <label>Filter Condition:</label>
                <textarea
                  value={nodeData.filterCondition || ''}
                  onChange={(e) => handleChange('filterCondition', e.target.value)}
                  placeholder="column > 100 AND status = 'active'"
                  rows={3}
                />
              </div>
            )}
            
            {nodeData.subtype === 'transform' && (
              <div className="property">
                <label>Transformation Rules:</label>
                <textarea
                  value={nodeData.transformationRules || ''}
                  onChange={(e) => handleChange('transformationRules', e.target.value)}
                  placeholder="output.total = input.price * input.quantity"
                  rows={4}
                />
              </div>
            )}
            
            {nodeData.subtype === 'aggregate' && (
              <>
                <div className="property">
                  <label>Group By:</label>
                  <input
                    type="text"
                    value={nodeData.groupBy || ''}
                    onChange={(e) => handleChange('groupBy', e.target.value)}
                    placeholder="customer_id, region"
                  />
                </div>
                <div className="property">
                  <label>Aggregation Functions:</label>
                  <textarea
                    value={nodeData.aggregations || ''}
                    onChange={(e) => handleChange('aggregations', e.target.value)}
                    placeholder="SUM(amount), AVG(price), COUNT(*)"
                    rows={3}
                  />
                </div>
              </>
            )}
            
            {nodeData.subtype === 'kafka' && (
              <>
                <div className="property">
                  <label>Broker URL:</label>
                  <input
                    type="text"
                    value={nodeData.brokerUrl || ''}
                    onChange={(e) => handleChange('brokerUrl', e.target.value)}
                    placeholder="localhost:9092"
                  />
                </div>
                <div className="property">
                  <label>Topic:</label>
                  <input
                    type="text"
                    value={nodeData.topic || ''}
                    onChange={(e) => handleChange('topic', e.target.value)}
                    placeholder="my-topic"
                  />
                </div>
                <div className="property">
                  <label>Partitions:</label>
                  <input
                    type="number"
                    value={nodeData.partitions || '1'}
                    onChange={(e) => handleChange('partitions', e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="property">
                  <label>Replication Factor:</label>
                  <input
                    type="number"
                    value={nodeData.replicationFactor || '1'}
                    onChange={(e) => handleChange('replicationFactor', e.target.value)}
                    placeholder="1"
                  />
                </div>
              </>
            )}
            
            <div className="property">
              <label>Business Rules:</label>
              <textarea
                value={nodeData.businessRules || ''}
                onChange={(e) => handleChange('businessRules', e.target.value)}
                placeholder="Define business rules or transformations"
                rows={4}
              />
            </div>
          </div>
        </>
      )}
      
      {selectedNode.type === 'output' && (
        <>
          <div className="property-section">
            <h4>Output Configuration</h4>
            <div className="property">
              <label>Output Type:</label>
              <select
                value={nodeData.subtype || 'database'}
                onChange={(e) => handleChange('subtype', e.target.value)}
              >
                <option value="database">Database</option>
                <option value="file">File</option>
                <option value="api">API</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </div>
            
            {nodeData.subtype === 'database' && (
              <>
                <div className="property">
                  <label>Connection URL:</label>
                  <input
                    type="text"
                    value={nodeData.connectionUrl || ''}
                    onChange={(e) => handleChange('connectionUrl', e.target.value)}
                    placeholder="jdbc:mysql://hostname:port/database"
                  />
                </div>
                <div className="property">
                  <label>Table:</label>
                  <input
                    type="text"
                    value={nodeData.table || ''}
                    onChange={(e) => handleChange('table', e.target.value)}
                    placeholder="Table name"
                  />
                </div>
                <div className="property">
                  <label>Write Mode:</label>
                  <select
                    value={nodeData.writeMode || 'append'}
                    onChange={(e) => handleChange('writeMode', e.target.value)}
                  >
                    <option value="append">Append</option>
                    <option value="overwrite">Overwrite</option>
                    <option value="upsert">Upsert</option>
                  </select>
                </div>
              </>
            )}
            
            {nodeData.subtype === 'file' && (
              <>
                <div className="property">
                  <label>File Path:</label>
                  <input
                    type="text"
                    value={nodeData.filePath || ''}
                    onChange={(e) => handleChange('filePath', e.target.value)}
                    placeholder="/path/to/output.csv"
                  />
                </div>
                <div className="property">
                  <label>File Pattern:</label>
                  <input
                    type="text"
                    value={nodeData.filePattern || ''}
                    onChange={(e) => handleChange('filePattern', e.target.value)}
                    placeholder="data-{date}.csv"
                  />
                </div>
              </>
            )}
            
            {nodeData.subtype === 'api' && (
              <>
                <div className="property">
                  <label>Endpoint:</label>
                  <input
                    type="text"
                    value={nodeData.endpoint || ''}
                    onChange={(e) => handleChange('endpoint', e.target.value)}
                    placeholder="https://api.example.com/data"
                  />
                </div>
                <div className="property">
                  <label>Method:</label>
                  <select
                    value={nodeData.method || 'POST'}
                    onChange={(e) => handleChange('method', e.target.value)}
                  >
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="property">
              <label>Format:</label>
              <select
                value={nodeData.format || 'json'}
                onChange={(e) => handleChange('format', e.target.value)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="parquet">Parquet</option>
                <option value="avro">Avro</option>
                <option value="xml">XML</option>
              </select>
            </div>
          </div>
        </>
      )}
      
      <div className="property-buttons">
        <button 
          className="delete-button" 
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <FaTrash className="button-icon" /> Delete Node
        </button>
        <button 
          className="save-properties-button" 
          onClick={handleSave}
        >
          <FaSave className="button-icon" /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default NodeProperties;