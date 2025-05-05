/**
 * Utility to export pipeline as AsyncAPI 3.0.0 specification
 */
import yaml from 'js-yaml';

/**
 * Converts a pipeline (nodes and edges) to AsyncAPI 3.0.0 format
 * @param {Array} nodes - The nodes in the pipeline
 * @param {Array} edges - The edges connecting the nodes
 * @param {Object} metadata - Additional metadata for the API
 * @returns {Object} AsyncAPI 3.0.0 specification as a JavaScript object
 */
export const convertToAsyncAPI = (nodes, edges, metadata = {}) => {
  // Default metadata
  const defaultMetadata = {
    title: 'Data Pipeline API',
    version: '1.0.0',
    description: 'API generated from PNC Meta Model - Data Product Designer',
    ...metadata
  };

  // Initialize AsyncAPI document
  const asyncApiDoc = {
    asyncapi: '3.0.0',
    info: {
      title: defaultMetadata.title,
      version: defaultMetadata.version,
      description: defaultMetadata.description
    },
    servers: {},
    channels: {},
    operations: {},
    components: {
      messages: {},
      schemas: {}
    }
  };

  // Process all data source nodes to create servers and schemas
  const dataSourceNodes = nodes.filter(node => node.type === 'dataSource');
  dataSourceNodes.forEach(node => {
    // Create server for each data source
    const serverId = `server-${node.id}`;
    const connectionType = node.data.subtype || 'database';
    const connectionUrl = node.data.connectionUrl || node.data.host || '';
    const protocol = getProtocolForDataSource(connectionType);
    
    // Add server information
    asyncApiDoc.servers[serverId] = {
      host: connectionUrl,
      protocol: protocol,
      description: node.data.description || `${connectionType} server for ${node.data.label || 'Data Source'}`,
      security: []
    };
    
    // Add security if credentials are provided
    if (node.data.username || node.data.password) {
      const securitySchemeId = `security-${node.id}`;
      asyncApiDoc.components.securitySchemes = asyncApiDoc.components.securitySchemes || {};
      asyncApiDoc.components.securitySchemes[securitySchemeId] = {
        type: 'userPassword',
        description: `Credentials for ${node.data.label || connectionType}`
      };
      
      asyncApiDoc.servers[serverId].security.push({
        [securitySchemeId]: []
      });
    }
    
    // Create schema for the data source
    const schemaId = `schema-${node.id}`;
    asyncApiDoc.components.schemas[schemaId] = {
      type: 'object',
      description: node.data.description || `Schema for ${node.data.label || 'Data Source'}`,
      properties: {}
    };
    
    // Add table information to schema if available
    if (node.data.table) {
      asyncApiDoc.components.schemas[schemaId].title = node.data.table;
      
      // If there's a query, add it as metadata
      if (node.data.query) {
        asyncApiDoc.components.schemas[schemaId]['x-query'] = node.data.query;
      }
    }
  });

  // Process Kafka nodes to create servers
  const kafkaNodes = nodes.filter(node => 
    node.type === 'processor' && 
    node.data.subtype === 'kafka'
  );

  // Add servers for Kafka brokers
  kafkaNodes.forEach(node => {
    if (node.data.brokerUrl) {
      const serverId = `kafka-${node.id}`;
      asyncApiDoc.servers[serverId] = {
        host: node.data.brokerUrl,
        protocol: 'kafka',
        description: `Kafka broker for ${node.data.label || 'unnamed processor'}`
      };
    }
  });

  // Process all edges to create channels (representing data flow)
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;
    
    const channelId = `channel-${edge.source}-to-${edge.target}`;
    const messageId = `message-${edge.source}-to-${edge.target}`;
    const operationId = `operation-${edge.source}-to-${edge.target}`;
    
    // Create message definition
    asyncApiDoc.components.messages[messageId] = {
      name: `${sourceNode.data.label || sourceNode.id} to ${targetNode.data.label || targetNode.id}`,
      title: `Data flow from ${sourceNode.data.label || 'Source'} to ${targetNode.data.label || 'Target'}`,
      summary: `Data transferred from ${sourceNode.type} to ${targetNode.type}`,
      contentType: 'application/json'
    };
    
    // If source is a data source, reference its schema
    if (sourceNode.type === 'dataSource') {
      asyncApiDoc.components.messages[messageId].payload = {
        $ref: `#/components/schemas/schema-${sourceNode.id}`
      };
    }
    
    // Create channel for the data flow
    asyncApiDoc.channels[channelId] = {
      address: getChannelAddress(sourceNode, targetNode),
      messages: {
        [messageId]: {
          $ref: `#/components/messages/${messageId}`
        }
      }
    };
    
    // Create operation for the data flow
    asyncApiDoc.operations[operationId] = {
      action: 'send',
      channel: {
        $ref: `#/channels/${channelId}`
      },
      summary: `Transfer data from ${sourceNode.data.label || sourceNode.type} to ${targetNode.data.label || targetNode.type}`,
      description: getOperationDescription(sourceNode, targetNode)
    };
    
    // If target is a processor, add business rules and logic
    if (targetNode.type === 'processor') {
      asyncApiDoc.operations[operationId].bindings = {
        'x-processor': {
          type: targetNode.data.subtype || 'generic',
          rules: targetNode.data.businessRules || '',
          logic: targetNode.data.processingLogic || '',
          configuration: getProcessorConfiguration(targetNode)
        }
      };
      
      // If Kafka processor, link to the Kafka server
      if (targetNode.data.subtype === 'kafka' && targetNode.data.brokerUrl) {
        asyncApiDoc.operations[operationId].bindings['x-processor'].server = {
          $ref: `#/servers/kafka-${targetNode.id}`
        };
      }
    }
    
    // If source is a data source, link to the data source server
    if (sourceNode.type === 'dataSource') {
      asyncApiDoc.operations[operationId].bindings = asyncApiDoc.operations[operationId].bindings || {};
      asyncApiDoc.operations[operationId].bindings['x-source'] = {
        server: {
          $ref: `#/servers/server-${sourceNode.id}`
        }
      };
    }
  });

  // Process output nodes to create additional channels
  const outputNodes = nodes.filter(node => node.type === 'output');
  outputNodes.forEach(node => {
    // Find incoming edges to this output node
    const incomingEdges = edges.filter(edge => edge.target === node.id);
    
    // Skip if no incoming connections
    if (incomingEdges.length === 0) return;
    
    const sourceNodeId = incomingEdges[0].source;
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    
    if (!sourceNode) return;
    
    const channelId = `channel-output-${node.id}`;
    const operationId = `operation-output-${node.id}`;
    const messageId = `message-output-${node.id}`;
    
    // Create channel for the output
    asyncApiDoc.channels[channelId] = {
      address: node.data.destination || `/api/output/${node.id}`,
      messages: {
        [messageId]: {
          $ref: `#/components/messages/${messageId}`
        }
      }
    };
    
    // Create operation for the output
    asyncApiDoc.operations[operationId] = {
      action: 'receive',
      channel: {
        $ref: `#/channels/${channelId}`
      },
      summary: `Output data to ${node.data.label || 'Destination'}`,
      description: node.data.description || `Output operation for ${node.data.label || 'Output node'}`
    };
    
    // Add output format and configuration
    asyncApiDoc.operations[operationId].bindings = {
      'x-output': {
        type: node.data.subtype || 'generic',
        format: node.data.format || 'json',
        configuration: getOutputConfiguration(node)
      }
    };
    
    // Create message definition
    asyncApiDoc.components.messages[messageId] = {
      name: node.data.label || `Output message`,
      title: node.data.label || `Output message`,
      summary: node.data.description || `Output message`,
      contentType: getContentType(node.data.format)
    };
    
    // If source has a schema, reference it
    if (sourceNode.type === 'dataSource') {
      asyncApiDoc.components.messages[messageId].payload = {
        $ref: `#/components/schemas/schema-${sourceNode.id}`
      };
    }
  });

  return asyncApiDoc;
};

/**
 * Helper function to determine protocol based on data source type
 */
const getProtocolForDataSource = (type) => {
  switch (type) {
    case 'mysql':
    case 'postgresql':
    case 'oracle':
    case 'sqlserver':
      return 'sql';
    case 'mongodb':
      return 'mongodb';
    case 'rest':
      return 'http';
    case 'graphql':
      return 'graphql';
    case 'file':
      return 'file';
    default:
      return 'generic';
  }
};

/**
 * Helper function to generate channel address
 */
const getChannelAddress = (sourceNode, targetNode) => {
  // For Kafka processors, use the topic
  if (targetNode.type === 'processor' && targetNode.data.subtype === 'kafka') {
    return targetNode.data.topic || `topic-${sourceNode.id}-to-${targetNode.id}`;
  }
  
  // For data sources with tables
  if (sourceNode.type === 'dataSource' && sourceNode.data.table) {
    return `data/${sourceNode.data.table}`;
  }
  
  // Default channel address
  return `flow/${sourceNode.id}-to-${targetNode.id}`;
};

/**
 * Helper function to generate operation description
 */
const getOperationDescription = (sourceNode, targetNode) => {
  let description = `Data flow from ${sourceNode.data.label || sourceNode.type} to ${targetNode.data.label || targetNode.type}`;
  
  // Add source details
  if (sourceNode.type === 'dataSource') {
    if (sourceNode.data.table) {
      description += `\nSource table: ${sourceNode.data.table}`;
    }
    if (sourceNode.data.query) {
      description += `\nQuery: ${sourceNode.data.query}`;
    }
  }
  
  // Add target details for processors
  if (targetNode.type === 'processor') {
    if (targetNode.data.businessRules) {
      description += `\nBusiness rules: ${targetNode.data.businessRules}`;
    }
    if (targetNode.data.subtype === 'kafka' && targetNode.data.topic) {
      description += `\nKafka topic: ${targetNode.data.topic}`;
    }
  }
  
  return description;
};

/**
 * Helper function to get processor configuration
 */
const getProcessorConfiguration = (processorNode) => {
  const config = {};
  
  if (processorNode.data.subtype === 'kafka') {
    if (processorNode.data.topic) config.topic = processorNode.data.topic;
    if (processorNode.data.partitions) config.partitions = processorNode.data.partitions;
    if (processorNode.data.replicationFactor) config.replicationFactor = processorNode.data.replicationFactor;
  } else if (processorNode.data.subtype === 'transform') {
    if (processorNode.data.transformationRules) config.transformationRules = processorNode.data.transformationRules;
  } else if (processorNode.data.subtype === 'filter') {
    if (processorNode.data.filterCondition) config.filterCondition = processorNode.data.filterCondition;
  }
  
  return config;
};

/**
 * Helper function to get output configuration
 */
const getOutputConfiguration = (outputNode) => {
  const config = {};
  
  if (outputNode.data.destination) config.destination = outputNode.data.destination;
  if (outputNode.data.format) config.format = outputNode.data.format;
  
  if (outputNode.data.subtype === 'file') {
    if (outputNode.data.filePath) config.filePath = outputNode.data.filePath;
    if (outputNode.data.filePattern) config.filePattern = outputNode.data.filePattern;
  } else if (outputNode.data.subtype === 'api') {
    if (outputNode.data.endpoint) config.endpoint = outputNode.data.endpoint;
    if (outputNode.data.method) config.method = outputNode.data.method;
  } else if (outputNode.data.subtype === 'database') {
    if (outputNode.data.table) config.table = outputNode.data.table;
    if (outputNode.data.writeMode) config.writeMode = outputNode.data.writeMode;
  }
  
  return config;
};

/**
 * Helper function to determine content type based on format
 */
const getContentType = (format) => {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    case 'csv':
      return 'text/csv';
    case 'avro':
      return 'application/avro';
    case 'parquet':
      return 'application/parquet';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Generates AsyncAPI YAML string from the AsyncAPI object
 * @param {Object} asyncApiObject - AsyncAPI specification as a JavaScript object
 * @returns {String} AsyncAPI specification as YAML string
 */
export const generateAsyncApiYaml = (asyncApiObject) => {
  try {
    return yaml.dump(asyncApiObject, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
  } catch (error) {
    console.error('Error generating YAML:', error);
    // Fallback to JSON if YAML generation fails
    return JSON.stringify(asyncApiObject, null, 2);
  }
};

/**
 * Exports the pipeline as AsyncAPI 3.0.0 specification
 * @param {Array} nodes - The nodes in the pipeline
 * @param {Array} edges - The edges connecting the nodes
 * @param {Object} metadata - Additional metadata for the API
 * @returns {String} AsyncAPI specification as YAML string
 */
export const exportAsAsyncApi = (nodes, edges, metadata = {}) => {
  const asyncApiObject = convertToAsyncAPI(nodes, edges, metadata);
  return generateAsyncApiYaml(asyncApiObject);
};

export default exportAsAsyncApi;