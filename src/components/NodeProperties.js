import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';

const NodeProperties = ({ selectedNode, onUpdateNodeData, onClose, onDeleteNode, inRightPanel = false }) => {
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
    <div className={inRightPanel ? "right-panel-properties" : "node-properties"}>
      {!inRightPanel && (
        <div className="properties-header">
          <h3>Node Properties</h3>
          <button 
            className="close-properties-button" 
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
      )}
      
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
                <option value="kafka">Kafka</option>
                <option value="mongodb">MongoDB</option>
                <option value="elastic">Elasticsearch</option>
                <option value="neo4j">Neo4J Graph</option>
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
            
            {nodeData.subtype === 'kafka' && (
              <>
                <div className="property">
                  <label>Bootstrap Servers:</label>
                  <input
                    type="text"
                    value={nodeData.kafkaBootstrapServers || ''}
                    onChange={(e) => handleChange('kafkaBootstrapServers', e.target.value)}
                    placeholder="localhost:9092"
                  />
                </div>
                <div className="property">
                  <label>Topic:</label>
                  <input
                    type="text"
                    value={nodeData.kafkaTopic || ''}
                    onChange={(e) => handleChange('kafkaTopic', e.target.value)}
                    placeholder="input-topic"
                  />
                </div>
                <div className="property">
                  <label>Consumer Group:</label>
                  <input
                    type="text"
                    value={nodeData.kafkaConsumerGroup || ''}
                    onChange={(e) => handleChange('kafkaConsumerGroup', e.target.value)}
                    placeholder="my-consumer-group"
                  />
                </div>
                <div className="property">
                  <label>Auto Offset Reset:</label>
                  <select
                    value={nodeData.kafkaAutoOffsetReset || 'latest'}
                    onChange={(e) => handleChange('kafkaAutoOffsetReset', e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="earliest">Earliest</option>
                  </select>
                </div>
              </>
            )}
            
            {nodeData.subtype === 'mongodb' && (
              <>
                <div className="property">
                  <label>Connection String:</label>
                  <input
                    type="text"
                    value={nodeData.mongodbConnectionString || ''}
                    onChange={(e) => handleChange('mongodbConnectionString', e.target.value)}
                    placeholder="mongodb://localhost:27017"
                  />
                </div>
                <div className="property">
                  <label>Database:</label>
                  <input
                    type="text"
                    value={nodeData.mongodbDatabase || ''}
                    onChange={(e) => handleChange('mongodbDatabase', e.target.value)}
                    placeholder="mydb"
                  />
                </div>
                <div className="property">
                  <label>Collection:</label>
                  <input
                    type="text"
                    value={nodeData.mongodbCollection || ''}
                    onChange={(e) => handleChange('mongodbCollection', e.target.value)}
                    placeholder="customers"
                  />
                </div>
                <div className="property">
                  <label>Query Filter:</label>
                  <textarea
                    value={nodeData.mongodbFilter || ''}
                    onChange={(e) => handleChange('mongodbFilter', e.target.value)}
                    placeholder='{"status": "active"}'
                    rows={2}
                  />
                </div>
              </>
            )}
            
            {nodeData.subtype === 'elastic' && (
              <>
                <div className="property">
                  <label>Elasticsearch URL:</label>
                  <input
                    type="text"
                    value={nodeData.elasticUrl || ''}
                    onChange={(e) => handleChange('elasticUrl', e.target.value)}
                    placeholder="http://localhost:9200"
                  />
                </div>
                <div className="property">
                  <label>Index:</label>
                  <input
                    type="text"
                    value={nodeData.elasticIndex || ''}
                    onChange={(e) => handleChange('elasticIndex', e.target.value)}
                    placeholder="customer-data"
                  />
                </div>
                <div className="property">
                  <label>Query:</label>
                  <textarea
                    value={nodeData.elasticQuery || ''}
                    onChange={(e) => handleChange('elasticQuery', e.target.value)}
                    placeholder='{"query": {"match": {"field": "value"}}}'
                    rows={3}
                  />
                </div>
                <div className="property">
                  <label>Authentication:</label>
                  <select
                    value={nodeData.elasticAuth || 'none'}
                    onChange={(e) => handleChange('elasticAuth', e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="basic">Basic Auth</option>
                    <option value="apikey">API Key</option>
                  </select>
                </div>
              </>
            )}
            
            {nodeData.subtype === 'neo4j' && (
              <>
                <div className="property">
                  <label>Neo4J URI:</label>
                  <input
                    type="text"
                    value={nodeData.neo4jUri || ''}
                    onChange={(e) => handleChange('neo4jUri', e.target.value)}
                    placeholder="bolt://localhost:7687"
                  />
                </div>
                <div className="property">
                  <label>Database:</label>
                  <input
                    type="text"
                    value={nodeData.neo4jDatabase || ''}
                    onChange={(e) => handleChange('neo4jDatabase', e.target.value)}
                    placeholder="neo4j"
                  />
                </div>
                <div className="property">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={nodeData.neo4jUsername || ''}
                    onChange={(e) => handleChange('neo4jUsername', e.target.value)}
                    placeholder="neo4j"
                  />
                </div>
                <div className="property">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={nodeData.neo4jPassword || ''}
                    onChange={(e) => handleChange('neo4jPassword', e.target.value)}
                    placeholder="Password"
                  />
                </div>
                <div className="property">
                  <label>Cypher Query:</label>
                  <textarea
                    value={nodeData.neo4jQuery || ''}
                    onChange={(e) => handleChange('neo4jQuery', e.target.value)}
                    placeholder="MATCH (n:Label) RETURN n LIMIT 100"
                    rows={3}
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
                <option value="kafka">Kafka</option>
                <option value="mongodb">MongoDB</option>
                <option value="elastic">Elasticsearch</option>
                <option value="neo4j">Neo4J Graph</option>
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
            
            {nodeData.subtype === 'kafka' && (
              <>
                <div className="property">
                  <label>Bootstrap Servers:</label>
                  <input
                    type="text"
                    value={nodeData.kafkaBootstrapServers || ''}
                    onChange={(e) => handleChange('kafkaBootstrapServers', e.target.value)}
                    placeholder="localhost:9092"
                  />
                </div>
                <div className="property">
                  <label>Topic:</label>
                  <input
                    type="text"
                    value={nodeData.kafkaTopic || ''}
                    onChange={(e) => handleChange('kafkaTopic', e.target.value)}
                    placeholder="output-topic"
                  />
                </div>
                <div className="property">
                  <label>Key Field:</label>
                  <input
                    type="text"
                    value={nodeData.kafkaKeyField || ''}
                    onChange={(e) => handleChange('kafkaKeyField', e.target.value)}
                    placeholder="id"
                  />
                </div>
                <div className="property">
                  <label>Partitioning Strategy:</label>
                  <select
                    value={nodeData.kafkaPartitioning || 'default'}
                    onChange={(e) => handleChange('kafkaPartitioning', e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="key">Key-based</option>
                    <option value="round-robin">Round Robin</option>
                  </select>
                </div>
              </>
            )}
            
            {nodeData.subtype === 'mongodb' && (
              <>
                <div className="property">
                  <label>Connection String:</label>
                  <input
                    type="text"
                    value={nodeData.mongodbConnectionString || ''}
                    onChange={(e) => handleChange('mongodbConnectionString', e.target.value)}
                    placeholder="mongodb://localhost:27017"
                  />
                </div>
                <div className="property">
                  <label>Database:</label>
                  <input
                    type="text"
                    value={nodeData.mongodbDatabase || ''}
                    onChange={(e) => handleChange('mongodbDatabase', e.target.value)}
                    placeholder="mydb"
                  />
                </div>
                <div className="property">
                  <label>Collection:</label>
                  <input
                    type="text"
                    value={nodeData.mongodbCollection || ''}
                    onChange={(e) => handleChange('mongodbCollection', e.target.value)}
                    placeholder="customers"
                  />
                </div>
                <div className="property">
                  <label>Write Concern:</label>
                  <select
                    value={nodeData.mongodbWriteConcern || 'majority'}
                    onChange={(e) => handleChange('mongodbWriteConcern', e.target.value)}
                  >
                    <option value="1">1 (Acknowledged)</option>
                    <option value="majority">Majority</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </>
            )}
            
            {nodeData.subtype === 'elastic' && (
              <>
                <div className="property">
                  <label>Elasticsearch URL:</label>
                  <input
                    type="text"
                    value={nodeData.elasticUrl || ''}
                    onChange={(e) => handleChange('elasticUrl', e.target.value)}
                    placeholder="http://localhost:9200"
                  />
                </div>
                <div className="property">
                  <label>Index:</label>
                  <input
                    type="text"
                    value={nodeData.elasticIndex || ''}
                    onChange={(e) => handleChange('elasticIndex', e.target.value)}
                    placeholder="customer-data"
                  />
                </div>
                <div className="property">
                  <label>Document ID Field:</label>
                  <input
                    type="text"
                    value={nodeData.elasticIdField || ''}
                    onChange={(e) => handleChange('elasticIdField', e.target.value)}
                    placeholder="id"
                  />
                </div>
                <div className="property">
                  <label>Bulk Size:</label>
                  <input
                    type="number"
                    value={nodeData.elasticBulkSize || '1000'}
                    onChange={(e) => handleChange('elasticBulkSize', e.target.value)}
                    placeholder="1000"
                  />
                </div>
              </>
            )}
            
            {nodeData.subtype === 'neo4j' && (
              <>
                <div className="property">
                  <label>Neo4J URI:</label>
                  <input
                    type="text"
                    value={nodeData.neo4jUri || ''}
                    onChange={(e) => handleChange('neo4jUri', e.target.value)}
                    placeholder="bolt://localhost:7687"
                  />
                </div>
                <div className="property">
                  <label>Database:</label>
                  <input
                    type="text"
                    value={nodeData.neo4jDatabase || ''}
                    onChange={(e) => handleChange('neo4jDatabase', e.target.value)}
                    placeholder="neo4j"
                  />
                </div>
                <div className="property">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={nodeData.neo4jUsername || ''}
                    onChange={(e) => handleChange('neo4jUsername', e.target.value)}
                    placeholder="neo4j"
                  />
                </div>
                <div className="property">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={nodeData.neo4jPassword || ''}
                    onChange={(e) => handleChange('neo4jPassword', e.target.value)}
                    placeholder="Password"
                  />
                </div>
                <div className="property">
                  <label>Cypher Query:</label>
                  <textarea
                    value={nodeData.neo4jCypher || ''}
                    onChange={(e) => handleChange('neo4jCypher', e.target.value)}
                    placeholder="MERGE (n:Person {id: event.id}) SET n += event"
                    rows={3}
                  />
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