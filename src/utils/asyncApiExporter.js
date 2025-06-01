/**
 * Utility to export pipeline as AsyncAPI 3.0.0 specification
 */
import * as yaml from 'js-yaml';

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
      schemas: {},
      securitySchemes: {}
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
    
    // Add server information with more details
    asyncApiDoc.servers[serverId] = {
      host: connectionUrl,
      protocol: protocol,
      description: node.data.description || `${connectionType} server for ${node.data.label || 'Data Source'}`,
      security: []
    };
    
    // Add specific server details based on the data source type
    switch (connectionType) {
      case 'database':
        asyncApiDoc.servers[serverId].name = node.data.label || 'Database Server';
        asyncApiDoc.servers[serverId].variables = {
          database: {
            default: node.data.database || '',
            description: 'Database name'
          },
          table: {
            default: node.data.table || '',
            description: 'Table name'
          }
        };
        break;
      case 'kafka':
        asyncApiDoc.servers[serverId].name = node.data.label || 'Kafka Broker';
        asyncApiDoc.servers[serverId].variables = {
          topic: {
            default: node.data.kafkaTopic || '',
            description: 'Kafka topic'
          },
          consumerGroup: {
            default: node.data.kafkaConsumerGroup || '',
            description: 'Consumer group'
          }
        };
        break;
      case 'api':
        asyncApiDoc.servers[serverId].name = node.data.label || 'API Server';
        asyncApiDoc.servers[serverId].variables = {
          endpoint: {
            default: node.data.apiEndpoint || '',
            description: 'API endpoint'
          },
          method: {
            default: node.data.method || 'GET',
            description: 'HTTP method'
          }
        };
        break;
      // Add more cases for other data source types
    }
    
    // Add tags if available
    if (node.data.tags && Object.keys(node.data.tags).length > 0) {
      asyncApiDoc.servers[serverId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Add bindings if available
    if (node.data.bindings && Object.keys(node.data.bindings).length > 0) {
      asyncApiDoc.servers[serverId].bindings = {};
      
      // Convert bindings to appropriate format
      Object.entries(node.data.bindings).forEach(([key, value]) => {
        // Try to parse value as JSON if it looks like an object or array
        try {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            asyncApiDoc.servers[serverId].bindings[key] = JSON.parse(value);
          } else {
            asyncApiDoc.servers[serverId].bindings[key] = value;
          }
        } catch (e) {
          // If parsing fails, use the raw string
          asyncApiDoc.servers[serverId].bindings[key] = value;
        }
      });
    }
    
    // Add security if credentials are provided
    if (node.data.username || node.data.password) {
      const securitySchemeId = `security-${node.id}`;
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
    
    // Add tags to schema if available
    if (node.data.tags && Object.keys(node.data.tags).length > 0) {
      asyncApiDoc.components.schemas[schemaId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
  });

  // Process processor nodes to create servers and channels
  const processorNodes = nodes.filter(node => node.type === 'processor');
  
  // First, handle Kafka processors to create servers
  const kafkaProcessors = processorNodes.filter(node => node.data.subtype === 'kafka');
  kafkaProcessors.forEach(node => {
    if (node.data.brokerUrl) {
      const serverId = `kafka-${node.id}`;
      asyncApiDoc.servers[serverId] = {
        host: node.data.brokerUrl,
        protocol: 'kafka',
        description: node.data.description || `Kafka broker for ${node.data.label || 'unnamed processor'}`,
        name: node.data.label || 'Kafka Processor'
      };
      
      // Add variables
      asyncApiDoc.servers[serverId].variables = {
        topic: {
          default: node.data.topic || '',
          description: 'Kafka topic'
        },
        partitions: {
          default: node.data.partitions || '1',
          description: 'Number of partitions'
        },
        replicationFactor: {
          default: node.data.replicationFactor || '1',
          description: 'Replication factor'
        }
      };
      
      // Add tags if available
      if (node.data.tags && Object.keys(node.data.tags).length > 0) {
        asyncApiDoc.servers[serverId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
          name: key,
          value: value
        }));
      }
      
      // Add bindings if available
      if (node.data.bindings && Object.keys(node.data.bindings).length > 0) {
        asyncApiDoc.servers[serverId].bindings = {};
        
        // Convert bindings to appropriate format
        Object.entries(node.data.bindings).forEach(([key, value]) => {
          // Try to parse value as JSON if it looks like an object or array
          try {
            if ((value.startsWith('{') && value.endsWith('}')) || 
                (value.startsWith('[') && value.endsWith(']'))) {
              asyncApiDoc.servers[serverId].bindings[key] = JSON.parse(value);
            } else {
              asyncApiDoc.servers[serverId].bindings[key] = value;
            }
          } catch (e) {
            // If parsing fails, use the raw string
            asyncApiDoc.servers[serverId].bindings[key] = value;
          }
        });
      }
    }
  });
  
  // Now create channels for all processor nodes
  processorNodes.forEach(node => {
    const channelId = `processor-channel-${node.id}`;
    
    // Create a channel for each processor
    asyncApiDoc.channels[channelId] = {
      address: node.data.topic || `processor/${node.id}`,
      description: node.data.description || `Channel for ${node.data.label || 'Processor'}`,
      messages: {}
    };
    
    // Add tags if available
    if (node.data.tags && Object.keys(node.data.tags).length > 0) {
      asyncApiDoc.channels[channelId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Add bindings if available
    if (node.data.bindings && Object.keys(node.data.bindings).length > 0) {
      asyncApiDoc.channels[channelId].bindings = {};
      
      // Convert bindings to appropriate format
      Object.entries(node.data.bindings).forEach(([key, value]) => {
        // Try to parse value as JSON if it looks like an object or array
        try {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            asyncApiDoc.channels[channelId].bindings[key] = JSON.parse(value);
          } else {
            asyncApiDoc.channels[channelId].bindings[key] = value;
          }
        } catch (e) {
          // If parsing fails, use the raw string
          asyncApiDoc.channels[channelId].bindings[key] = value;
        }
      });
    }
    
    // Create a message for this processor
    const messageId = `processor-message-${node.id}`;
    asyncApiDoc.components.messages[messageId] = {
      name: node.data.label || `Processor ${node.id}`,
      title: node.data.label || `Processor ${node.id}`,
      summary: node.data.description || `Message for processor ${node.id}`,
      contentType: 'application/json',
      description: getProcessorDescription(node)
    };
    
    // Add the message reference to the channel
    asyncApiDoc.channels[channelId].messages[messageId] = {
      $ref: `#/components/messages/${messageId}`
    };
    
    // If it's a Kafka processor, link to the Kafka server
    if (node.data.subtype === 'kafka' && node.data.brokerUrl) {
      asyncApiDoc.channels[channelId].servers = [{
        $ref: `#/servers/kafka-${node.id}`
      }];
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
    
    // Create message definition with enhanced details
    asyncApiDoc.components.messages[messageId] = {
      name: `${sourceNode.data.label || sourceNode.id} to ${targetNode.data.label || targetNode.id}`,
      title: `Data flow from ${sourceNode.data.label || 'Source'} to ${targetNode.data.label || 'Target'}`,
      summary: `Data transferred from ${sourceNode.type} to ${targetNode.type}`,
      contentType: 'application/json',
      description: edge.data?.description || `Data flow from ${sourceNode.data.label || 'Source'} to ${targetNode.data.label || 'Target'}`
    };
    
    // If source is a data source, reference its schema
    if (sourceNode.type === 'dataSource') {
      asyncApiDoc.components.messages[messageId].payload = {
        $ref: `#/components/schemas/schema-${sourceNode.id}`
      };
    }
    
    // Add ontology mappings from edge properties if available
    if (edge.data?.entityId) {
      asyncApiDoc.components.messages[messageId]['x-ontology'] = {
        entityId: edge.data.entityId,
        label: edge.data.label || '',
        properties: edge.data.properties || {}
      };
    }
    
    // Add tags if available
    if (edge.data?.tags && Object.keys(edge.data.tags).length > 0) {
      asyncApiDoc.components.messages[messageId].tags = Object.entries(edge.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Add bindings if available
    if (edge.data?.bindings && Object.keys(edge.data.bindings).length > 0) {
      asyncApiDoc.components.messages[messageId].bindings = {};
      
      // Convert bindings to appropriate format
      Object.entries(edge.data.bindings).forEach(([key, value]) => {
        // Try to parse value as JSON if it looks like an object or array
        try {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            asyncApiDoc.components.messages[messageId].bindings[key] = JSON.parse(value);
          } else {
            asyncApiDoc.components.messages[messageId].bindings[key] = value;
          }
        } catch (e) {
          // If parsing fails, use the raw string
          asyncApiDoc.components.messages[messageId].bindings[key] = value;
        }
      });
    }
    
    // Create channel for the data flow with enhanced details
    asyncApiDoc.channels[channelId] = {
      address: getChannelAddress(sourceNode, targetNode),
      description: edge.data?.description || `Channel for data flow from ${sourceNode.data.label || 'Source'} to ${targetNode.data.label || 'Target'}`,
      messages: {
        [messageId]: {
          $ref: `#/components/messages/${messageId}`
        }
      }
    };
    
    // Add tags to channel if available
    if (edge.data?.tags && Object.keys(edge.data.tags).length > 0) {
      asyncApiDoc.channels[channelId].tags = Object.entries(edge.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Add bindings to channel if available
    if (edge.data?.bindings && Object.keys(edge.data.bindings).length > 0) {
      asyncApiDoc.channels[channelId].bindings = {};
      
      // Convert bindings to appropriate format
      Object.entries(edge.data.bindings).forEach(([key, value]) => {
        // Try to parse value as JSON if it looks like an object or array
        try {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            asyncApiDoc.channels[channelId].bindings[key] = JSON.parse(value);
          } else {
            asyncApiDoc.channels[channelId].bindings[key] = value;
          }
        } catch (e) {
          // If parsing fails, use the raw string
          asyncApiDoc.channels[channelId].bindings[key] = value;
        }
      });
    }
    
    // Create operation for the data flow with enhanced details
    asyncApiDoc.operations[operationId] = {
      action: 'send',
      channel: {
        $ref: `#/channels/${channelId}`
      },
      summary: `Transfer data from ${sourceNode.data.label || sourceNode.type} to ${targetNode.data.label || targetNode.type}`,
      description: getOperationDescription(sourceNode, targetNode, edge)
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
    
    // Add tags to operation if available
    if (edge.data?.tags && Object.keys(edge.data.tags).length > 0) {
      asyncApiDoc.operations[operationId].tags = Object.entries(edge.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
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
    const edge = incomingEdges[0];
    
    if (!sourceNode) return;
    
    const channelId = `channel-output-${node.id}`;
    const operationId = `operation-output-${node.id}`;
    const messageId = `message-output-${node.id}`;
    
    // Create channel for the output with enhanced details
    asyncApiDoc.channels[channelId] = {
      address: node.data.destination || `/api/output/${node.id}`,
      description: node.data.description || `Output channel for ${node.data.label || 'Output node'}`,
      messages: {
        [messageId]: {
          $ref: `#/components/messages/${messageId}`
        }
      }
    };
    
    // Add tags to channel if available
    if (node.data.tags && Object.keys(node.data.tags).length > 0) {
      asyncApiDoc.channels[channelId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Add bindings to channel if available
    if (node.data.bindings && Object.keys(node.data.bindings).length > 0) {
      asyncApiDoc.channels[channelId].bindings = {};
      
      // Convert bindings to appropriate format
      Object.entries(node.data.bindings).forEach(([key, value]) => {
        // Try to parse value as JSON if it looks like an object or array
        try {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            asyncApiDoc.channels[channelId].bindings[key] = JSON.parse(value);
          } else {
            asyncApiDoc.channels[channelId].bindings[key] = value;
          }
        } catch (e) {
          // If parsing fails, use the raw string
          asyncApiDoc.channels[channelId].bindings[key] = value;
        }
      });
    }
    
    // Create operation for the output with enhanced details
    asyncApiDoc.operations[operationId] = {
      action: 'receive',
      channel: {
        $ref: `#/channels/${channelId}`
      },
      summary: `Output data to ${node.data.label || 'Destination'}`,
      description: getOutputDescription(node, sourceNode, edge)
    };
    
    // Add output format and configuration
    asyncApiDoc.operations[operationId].bindings = {
      'x-output': {
        type: node.data.subtype || 'generic',
        format: node.data.format || 'json',
        configuration: getOutputConfiguration(node)
      }
    };
    
    // Add tags to operation if available
    if (node.data.tags && Object.keys(node.data.tags).length > 0) {
      asyncApiDoc.operations[operationId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Create message definition with enhanced details
    asyncApiDoc.components.messages[messageId] = {
      name: node.data.label || `Output message`,
      title: node.data.label || `Output message`,
      summary: node.data.description || `Output message`,
      contentType: getContentType(node.data.format),
      description: `Output message for ${node.data.label || 'Output node'}`
    };
    
    // If source has a schema, reference it
    if (sourceNode.type === 'dataSource') {
      asyncApiDoc.components.messages[messageId].payload = {
        $ref: `#/components/schemas/schema-${sourceNode.id}`
      };
    }
    
    // Add ontology mappings from edge properties if available
    if (edge.data?.entityId) {
      asyncApiDoc.components.messages[messageId]['x-ontology'] = {
        entityId: edge.data.entityId,
        label: edge.data.label || '',
        properties: edge.data.properties || {}
      };
    }
    
    // Add tags to message if available
    if (node.data.tags && Object.keys(node.data.tags).length > 0) {
      asyncApiDoc.components.messages[messageId].tags = Object.entries(node.data.tags).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    
    // Add bindings to message if available
    if (node.data.bindings && Object.keys(node.data.bindings).length > 0) {
      asyncApiDoc.components.messages[messageId].bindings = {};
      
      // Convert bindings to appropriate format
      Object.entries(node.data.bindings).forEach(([key, value]) => {
        // Try to parse value as JSON if it looks like an object or array
        try {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            asyncApiDoc.components.messages[messageId].bindings[key] = JSON.parse(value);
          } else {
            asyncApiDoc.components.messages[messageId].bindings[key] = value;
          }
        } catch (e) {
          // If parsing fails, use the raw string
          asyncApiDoc.components.messages[messageId].bindings[key] = value;
        }
      });
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
const getOperationDescription = (sourceNode, targetNode, edge = null) => {
  let description = `Data flow from ${sourceNode.data.label || sourceNode.type} to ${targetNode.data.label || targetNode.type}`;
  
  // Add edge description if available
  if (edge && edge.data && edge.data.description) {
    description += `\n\nEdge Description: ${edge.data.description}`;
  }
  
  // Add source details
  if (sourceNode.type === 'dataSource') {
    description += `\n\nSource Details:`;
    if (sourceNode.data.table) {
      description += `\n- Table: ${sourceNode.data.table}`;
    }
    if (sourceNode.data.query) {
      description += `\n- Query: ${sourceNode.data.query}`;
    }
    if (sourceNode.data.subtype) {
      description += `\n- Type: ${sourceNode.data.subtype}`;
    }
  }
  
  // Add target details for processors
  if (targetNode.type === 'processor') {
    description += `\n\nProcessor Details:`;
    if (targetNode.data.subtype) {
      description += `\n- Type: ${targetNode.data.subtype}`;
    }
    if (targetNode.data.businessRules) {
      description += `\n- Business rules: ${targetNode.data.businessRules}`;
    }
    if (targetNode.data.subtype === 'kafka' && targetNode.data.topic) {
      description += `\n- Kafka topic: ${targetNode.data.topic}`;
    }
  }
  
  // Add ontology mapping details if available
  if (edge && edge.data && edge.data.entityId) {
    description += `\n\nOntology Mapping:`;
    description += `\n- Entity ID: ${edge.data.entityId}`;
    description += `\n- Label: ${edge.data.label || ''}`;
    
    if (edge.data.properties && Object.keys(edge.data.properties).length > 0) {
      description += `\n- Properties:`;
      Object.entries(edge.data.properties).forEach(([key, value]) => {
        description += `\n  * ${key}: ${value}`;
      });
    }
  }
  
  return description;
};

/**
 * Helper function to get processor description
 */
const getProcessorDescription = (processorNode) => {
  let description = processorNode.data.description || `Processor of type ${processorNode.data.subtype || 'generic'}`;
  
  // Add specific details based on processor type
  switch (processorNode.data.subtype) {
    case 'transform':
      if (processorNode.data.transformationRules) {
        description += `\n\nTransformation Rules:\n${processorNode.data.transformationRules}`;
      }
      break;
    case 'filter':
      if (processorNode.data.filterCondition) {
        description += `\n\nFilter Condition:\n${processorNode.data.filterCondition}`;
      }
      break;
    case 'aggregate':
      if (processorNode.data.groupBy) {
        description += `\n\nGroup By: ${processorNode.data.groupBy}`;
      }
      if (processorNode.data.aggregations) {
        description += `\n\nAggregations:\n${processorNode.data.aggregations}`;
      }
      break;
    case 'join':
      description += `\n\nJoin operation`;
      break;
    case 'kafka':
      if (processorNode.data.topic) {
        description += `\n\nKafka Topic: ${processorNode.data.topic}`;
      }
      break;
  }
  
  // Add business rules if available
  if (processorNode.data.businessRules) {
    description += `\n\nBusiness Rules:\n${processorNode.data.businessRules}`;
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
  } else if (processorNode.data.subtype === 'aggregate') {
    if (processorNode.data.groupBy) config.groupBy = processorNode.data.groupBy;
    if (processorNode.data.aggregations) config.aggregations = processorNode.data.aggregations;
  }
  
  // Add tags and bindings if available
  if (processorNode.data.tags) config.tags = processorNode.data.tags;
  if (processorNode.data.bindings) config.bindings = processorNode.data.bindings;
  
  return config;
};

/**
 * Helper function to generate output description
 */
const getOutputDescription = (outputNode, sourceNode, edge = null) => {
  let description = outputNode.data.description || `Output operation for ${outputNode.data.label || 'Output node'}`;
  
  // Add output type details
  description += `\n\nOutput Details:`;
  description += `\n- Type: ${outputNode.data.subtype || 'generic'}`;
  description += `\n- Format: ${outputNode.data.format || 'json'}`;
  
  // Add specific details based on output type
  switch (outputNode.data.subtype) {
    case 'file':
      if (outputNode.data.filePath) {
        description += `\n- File Path: ${outputNode.data.filePath}`;
      }
      if (outputNode.data.filePattern) {
        description += `\n- File Pattern: ${outputNode.data.filePattern}`;
      }
      break;
    case 'database':
      if (outputNode.data.connectionUrl) {
        description += `\n- Connection URL: ${outputNode.data.connectionUrl}`;
      }
      if (outputNode.data.table) {
        description += `\n- Table: ${outputNode.data.table}`;
      }
      if (outputNode.data.writeMode) {
        description += `\n- Write Mode: ${outputNode.data.writeMode}`;
      }
      break;
    case 'api':
      if (outputNode.data.endpoint) {
        description += `\n- Endpoint: ${outputNode.data.endpoint}`;
      }
      if (outputNode.data.method) {
        description += `\n- Method: ${outputNode.data.method}`;
      }
      break;
    case 'kafka':
      if (outputNode.data.kafkaBootstrapServers) {
        description += `\n- Bootstrap Servers: ${outputNode.data.kafkaBootstrapServers}`;
      }
      if (outputNode.data.kafkaTopic) {
        description += `\n- Topic: ${outputNode.data.kafkaTopic}`;
      }
      break;
  }
  
  // Add source information
  if (sourceNode) {
    description += `\n\nSource: ${sourceNode.data.label || sourceNode.id} (${sourceNode.type})`;
  }
  
  // Add edge information if available
  if (edge && edge.data) {
    if (edge.data.description) {
      description += `\n\nConnection Description: ${edge.data.description}`;
    }
    
    // Add ontology mapping details if available
    if (edge.data.entityId) {
      description += `\n\nOntology Mapping:`;
      description += `\n- Entity ID: ${edge.data.entityId}`;
      description += `\n- Label: ${edge.data.label || ''}`;
      
      if (edge.data.properties && Object.keys(edge.data.properties).length > 0) {
        description += `\n- Properties:`;
        Object.entries(edge.data.properties).forEach(([key, value]) => {
          description += `\n  * ${key}: ${value}`;
        });
      }
    }
  }
  
  return description;
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
  } else if (outputNode.data.subtype === 'kafka') {
    if (outputNode.data.kafkaBootstrapServers) config.kafkaBootstrapServers = outputNode.data.kafkaBootstrapServers;
    if (outputNode.data.kafkaTopic) config.kafkaTopic = outputNode.data.kafkaTopic;
    if (outputNode.data.kafkaKeyField) config.kafkaKeyField = outputNode.data.kafkaKeyField;
  }
  
  // Add tags and bindings if available
  if (outputNode.data.tags) config.tags = outputNode.data.tags;
  if (outputNode.data.bindings) config.bindings = outputNode.data.bindings;
  
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
    console.log('Converting to YAML, object keys:', Object.keys(asyncApiObject));
    const yamlString = yaml.dump(asyncApiObject, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
    console.log('YAML generated successfully, length:', yamlString.length);
    return yamlString;
  } catch (error) {
    console.error('Error generating YAML:', error);
    // Log more details about the error
    console.error('Error details:', error.stack);
    console.error('Object to convert:', JSON.stringify(asyncApiObject).substring(0, 200) + '...');
    
    // Fallback to JSON if YAML generation fails
    try {
      return JSON.stringify(asyncApiObject, null, 2);
    } catch (jsonError) {
      console.error('Error stringifying to JSON:', jsonError);
      return `Error generating specification: ${error.message}`;
    }
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
  try {
    console.log('Starting AsyncAPI export with', nodes.length, 'nodes and', edges.length, 'edges');
    
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      console.warn('No nodes provided for AsyncAPI export');
      return "# No nodes found in the workflow\nasyncapi: '3.0.0'\ninfo:\n  title: Empty Workflow\n  version: '1.0.0'";
    }
    
    const asyncApiObject = convertToAsyncAPI(nodes, edges, metadata);
    console.log('AsyncAPI object created successfully');
    
    return generateAsyncApiYaml(asyncApiObject);
  } catch (error) {
    console.error('Error in exportAsAsyncApi:', error);
    return `# Error generating AsyncAPI specification\n# ${error.message}\nasyncapi: '3.0.0'\ninfo:\n  title: Error in Export\n  version: '1.0.0'\n  description: 'An error occurred: ${error.message}'`;
  }
};

export default exportAsAsyncApi;