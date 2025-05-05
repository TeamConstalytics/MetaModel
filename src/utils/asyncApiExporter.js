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

  // Process data source nodes to create schemas
  const dataSourceNodes = nodes.filter(node => node.type === 'dataSource');
  dataSourceNodes.forEach(node => {
    const schemaId = `schema-${node.id}`;
    
    // Create a basic schema based on the data source
    asyncApiDoc.components.schemas[schemaId] = {
      type: 'object',
      description: node.data.description || `Schema for ${node.data.label || 'Data Source'}`,
      properties: {}
    };
    
    // If we have table information, we could add more details to the schema
    if (node.data.table) {
      asyncApiDoc.components.schemas[schemaId].title = node.data.table;
    }
  });

  // Process Kafka nodes to create channels and operations
  kafkaNodes.forEach(node => {
    if (node.data.topic) {
      const channelId = `channel-${node.id}`;
      const operationId = `operation-${node.id}`;
      const messageId = `message-${node.id}`;
      
      // Create channel for Kafka topic
      asyncApiDoc.channels[channelId] = {
        address: node.data.topic,
        messages: {
          [messageId]: {
            $ref: `#/components/messages/${messageId}`
          }
        }
      };
      
      // Create operation for publishing/subscribing to the topic
      asyncApiDoc.operations[operationId] = {
        action: 'send',
        channel: {
          $ref: `#/channels/${channelId}`
        },
        summary: `Send message to ${node.data.topic}`,
        description: node.data.description || `Operation for ${node.data.label || 'Kafka processor'}`
      };
      
      // Create message definition
      asyncApiDoc.components.messages[messageId] = {
        name: node.data.label || `Message for ${node.data.topic}`,
        title: node.data.label || `Message for ${node.data.topic}`,
        summary: node.data.description || `Message for ${node.data.topic}`,
        contentType: 'application/json'
      };
      
      // Find connected data source nodes to determine the payload schema
      const incomingEdges = edges.filter(edge => edge.target === node.id);
      if (incomingEdges.length > 0) {
        const sourceNodeId = incomingEdges[0].source;
        const sourceNode = nodes.find(n => n.id === sourceNodeId);
        
        if (sourceNode && sourceNode.type === 'dataSource') {
          asyncApiDoc.components.messages[messageId].payload = {
            $ref: `#/components/schemas/schema-${sourceNodeId}`
          };
        }
      }
    }
  });

  // Process output nodes to create additional channels if they represent API endpoints
  const outputNodes = nodes.filter(node => node.type === 'output' && node.data.subtype === 'api');
  outputNodes.forEach(node => {
    const channelId = `channel-output-${node.id}`;
    const operationId = `operation-output-${node.id}`;
    const messageId = `message-output-${node.id}`;
    
    // Create channel for API endpoint
    asyncApiDoc.channels[channelId] = {
      address: node.data.destination || `/api/output/${node.id}`,
      messages: {
        [messageId]: {
          $ref: `#/components/messages/${messageId}`
        }
      }
    };
    
    // Create operation for the API endpoint
    asyncApiDoc.operations[operationId] = {
      action: 'receive',
      channel: {
        $ref: `#/channels/${channelId}`
      },
      summary: `Receive data from ${node.data.label || 'Output'}`,
      description: node.data.description || `Operation for ${node.data.label || 'Output node'}`
    };
    
    // Create message definition
    asyncApiDoc.components.messages[messageId] = {
      name: node.data.label || `Output message`,
      title: node.data.label || `Output message`,
      summary: node.data.description || `Output message`,
      contentType: node.data.format === 'json' ? 'application/json' : 
                  node.data.format === 'csv' ? 'text/csv' : 
                  'application/octet-stream'
    };
  });

  return asyncApiDoc;
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