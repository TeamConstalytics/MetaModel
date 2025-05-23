/**
 * AI Service for generating data pipeline flows from natural language prompts
 * This service would typically connect to an external AI API (like OpenAI)
 * For now, we'll use a more sophisticated rule-based approach
 */

/**
 * Process a natural language prompt and generate a data pipeline flow
 * @param {string} prompt - The user's natural language description of the desired pipeline
 * @returns {Promise<Object>} - A promise that resolves to a flow configuration object
 */
export const generateFlowFromPrompt = async (prompt) => {
  try {
    // In a production environment, this would call an external AI API
    // For demonstration purposes, we'll use an enhanced rule-based approach
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Process the prompt and generate a flow
    return processPromptAndGenerateFlow(prompt);
  } catch (error) {
    console.error('Error generating flow from prompt:', error);
    throw new Error('Failed to generate flow from prompt');
  }
};

/**
 * Process the prompt and generate a flow configuration
 * @param {string} prompt - The user's natural language description
 * @returns {Object} - A flow configuration object with nodes and edges
 */
const processPromptAndGenerateFlow = (prompt) => {
  const promptLower = prompt.toLowerCase();
  
  // Initialize flow components
  const nodes = [];
  const edges = [];
  let nodeId = 1;
  let lastNodeId = null;
  
  // Extract key information from the prompt
  const hasDatabase = promptLower.includes('database') || 
                      promptLower.includes('sql') || 
                      promptLower.includes('postgres') ||
                      promptLower.includes('mysql') ||
                      promptLower.includes('oracle');
                      
  const hasFile = promptLower.includes('file') || 
                  promptLower.includes('csv') || 
                  promptLower.includes('excel') ||
                  promptLower.includes('json') ||
                  promptLower.includes('xml');
                  
  const hasApi = promptLower.includes('api') || 
                 promptLower.includes('rest') || 
                 promptLower.includes('http') ||
                 promptLower.includes('endpoint') ||
                 promptLower.includes('service');
  
  const hasFilter = promptLower.includes('filter') || 
                    promptLower.includes('where') || 
                    promptLower.includes('condition') ||
                    promptLower.includes('exclude') ||
                    promptLower.includes('only include');
                    
  const hasTransform = promptLower.includes('transform') || 
                       promptLower.includes('convert') || 
                       promptLower.includes('change') ||
                       promptLower.includes('format') ||
                       promptLower.includes('modify');
                       
  const hasAggregate = promptLower.includes('aggregate') || 
                       promptLower.includes('group') || 
                       promptLower.includes('summarize') ||
                       promptLower.includes('count') ||
                       promptLower.includes('sum') ||
                       promptLower.includes('average');
                       
  const hasKafka = promptLower.includes('kafka') || 
                   promptLower.includes('stream') || 
                   promptLower.includes('real-time') ||
                   promptLower.includes('event') ||
                   promptLower.includes('message');
                   
  const hasJoin = promptLower.includes('join') || 
                  promptLower.includes('combine') || 
                  promptLower.includes('merge') ||
                  promptLower.includes('with');
  
  // Determine data sources
  if (hasDatabase) {
    const dbNode = createNode(
      String(nodeId++), 
      'dataSource',
      'Database Source', 
      extractDatabaseDetails(promptLower),
      'database',
      { x: 250, y: 100 }
    );
    nodes.push(dbNode);
    lastNodeId = dbNode.id;
  }
  
  if (hasFile) {
    const fileNode = createNode(
      String(nodeId++), 
      'dataSource',
      'File Input', 
      extractFileDetails(promptLower),
      'file',
      { x: hasDatabase ? 450 : 250, y: 100 }
    );
    nodes.push(fileNode);
    
    // If we already have a source, we might need to join them
    if (lastNodeId && hasJoin) {
      // Add a join processor
      const joinNode = createNode(
        String(nodeId++),
        'processor',
        'Join Processor',
        'Combine data from multiple sources',
        'join',
        { x: 350, y: 250 }
      );
      nodes.push(joinNode);
      
      // Connect sources to join
      edges.push(createEdge(lastNodeId, joinNode.id));
      edges.push(createEdge(fileNode.id, joinNode.id));
      
      lastNodeId = joinNode.id;
    } else {
      lastNodeId = fileNode.id;
    }
  }
  
  if (hasApi) {
    const apiNode = createNode(
      String(nodeId++), 
      'dataSource',
      'API Source', 
      extractApiDetails(promptLower),
      'api',
      { x: (hasDatabase && hasFile) ? 650 : (hasDatabase || hasFile) ? 450 : 250, y: 100 }
    );
    nodes.push(apiNode);
    
    // If we already have sources, we might need to join them
    if (lastNodeId && hasJoin) {
      // Check if we already have a join node
      const joinNode = nodes.find(n => n.data.subtype === 'join');
      
      if (joinNode) {
        // Connect this source to existing join
        edges.push(createEdge(apiNode.id, joinNode.id));
      } else {
        // Create a new join node
        const newJoinNode = createNode(
          String(nodeId++),
          'processor',
          'Join Processor',
          'Combine data from multiple sources',
          'join',
          { x: 350, y: 250 }
        );
        nodes.push(newJoinNode);
        
        // Connect sources to join
        edges.push(createEdge(lastNodeId, newJoinNode.id));
        edges.push(createEdge(apiNode.id, newJoinNode.id));
        
        lastNodeId = newJoinNode.id;
      }
    } else {
      lastNodeId = apiNode.id;
    }
  }
  
  // If no source was specified, add a default file source
  if (!lastNodeId) {
    const defaultSource = createNode(
      String(nodeId++), 
      'dataSource',
      'File Input', 
      'CSV File Input',
      'file',
      { x: 250, y: 100 }
    );
    nodes.push(defaultSource);
    lastNodeId = defaultSource.id;
  }
  
  // Add processing nodes based on the prompt
  let yPosition = 250;
  
  if (hasFilter) {
    const filterNode = createNode(
      String(nodeId++),
      'processor',
      'Filter Processor',
      extractFilterDetails(promptLower),
      'filter',
      { x: 250, y: yPosition }
    );
    nodes.push(filterNode);
    edges.push(createEdge(lastNodeId, filterNode.id));
    lastNodeId = filterNode.id;
    yPosition += 150;
  }
  
  if (hasTransform) {
    const transformNode = createNode(
      String(nodeId++),
      'processor',
      'Transform Processor',
      extractTransformDetails(promptLower),
      'transform',
      { x: 250, y: yPosition }
    );
    nodes.push(transformNode);
    edges.push(createEdge(lastNodeId, transformNode.id));
    lastNodeId = transformNode.id;
    yPosition += 150;
  }
  
  if (hasAggregate) {
    const aggregateNode = createNode(
      String(nodeId++),
      'processor',
      'Aggregate Processor',
      extractAggregateDetails(promptLower),
      'aggregate',
      { x: 250, y: yPosition }
    );
    nodes.push(aggregateNode);
    edges.push(createEdge(lastNodeId, aggregateNode.id));
    lastNodeId = aggregateNode.id;
    yPosition += 150;
  }
  
  if (hasKafka) {
    const kafkaNode = createNode(
      String(nodeId++),
      'processor',
      'Kafka Processor',
      extractKafkaDetails(promptLower),
      'kafka',
      { x: 250, y: yPosition }
    );
    nodes.push(kafkaNode);
    edges.push(createEdge(lastNodeId, kafkaNode.id));
    lastNodeId = kafkaNode.id;
    yPosition += 150;
  }
  
  // Determine output type
  let outputType = 'file'; // default
  let outputLabel = 'File Output';
  let outputDesc = 'CSV File Output';
  
  if (promptLower.includes('database output') || 
      promptLower.includes('save to database') || 
      promptLower.includes('store in database') ||
      promptLower.includes('write to database')) {
    outputType = 'database';
    outputLabel = 'Database Output';
    outputDesc = extractOutputDatabaseDetails(promptLower);
  } else if (promptLower.includes('api output') || 
             promptLower.includes('webhook') || 
             promptLower.includes('send to endpoint') ||
             promptLower.includes('post to')) {
    outputType = 'api';
    outputLabel = 'API Output';
    outputDesc = extractOutputApiDetails(promptLower);
  } else if (promptLower.includes('dashboard') ||
             promptLower.includes('visualize') ||
             promptLower.includes('chart') ||
             promptLower.includes('graph')) {
    outputType = 'dashboard';
    outputLabel = 'Dashboard Output';
    outputDesc = 'Visualization Dashboard';
  } else {
    // Check if the prompt mentions specific file formats for output
    outputDesc = extractOutputFileDetails(promptLower);
  }
  
  // Add output node
  const outputNode = createNode(
    String(nodeId++),
    'output',
    outputLabel,
    outputDesc,
    outputType,
    { x: 250, y: yPosition }
  );
  nodes.push(outputNode);
  edges.push(createEdge(lastNodeId, outputNode.id));
  
  return { nodes, edges };
};

// Helper functions to extract details from the prompt

const extractDatabaseDetails = (prompt) => {
  if (prompt.includes('postgres')) return 'PostgreSQL Database Connection';
  if (prompt.includes('mysql')) return 'MySQL Database Connection';
  if (prompt.includes('oracle')) return 'Oracle Database Connection';
  if (prompt.includes('sql server')) return 'SQL Server Database Connection';
  return 'SQL Database Connection';
};

const extractFileDetails = (prompt) => {
  if (prompt.includes('csv')) return 'CSV File Input';
  if (prompt.includes('excel')) return 'Excel File Input';
  if (prompt.includes('json')) return 'JSON File Input';
  if (prompt.includes('xml')) return 'XML File Input';
  if (prompt.includes('parquet')) return 'Parquet File Input';
  return 'File Input';
};

const extractApiDetails = (prompt) => {
  if (prompt.includes('rest')) return 'REST API Endpoint';
  if (prompt.includes('graphql')) return 'GraphQL API Endpoint';
  if (prompt.includes('soap')) return 'SOAP API Endpoint';
  if (prompt.includes('webhook')) return 'Webhook Endpoint';
  return 'API Endpoint';
};

const extractFilterDetails = (prompt) => {
  if (prompt.includes('missing')) return 'Filter out rows with missing values';
  if (prompt.includes('duplicate')) return 'Remove duplicate records';
  if (prompt.includes('where')) {
    // Try to extract the condition after "where"
    const whereIndex = prompt.indexOf('where');
    if (whereIndex !== -1) {
      const condition = prompt.substring(whereIndex + 5, prompt.indexOf('.', whereIndex + 5));
      if (condition.length > 5 && condition.length < 50) {
        return `Filter where ${condition}`;
      }
    }
  }
  return 'Filter data based on conditions';
};

const extractTransformDetails = (prompt) => {
  if (prompt.includes('date')) return 'Transform date columns to standard format';
  if (prompt.includes('uppercase') || prompt.includes('upper case')) return 'Convert text to uppercase';
  if (prompt.includes('lowercase') || prompt.includes('lower case')) return 'Convert text to lowercase';
  if (prompt.includes('normalize')) return 'Normalize data values';
  return 'Transform data structure or format';
};

const extractAggregateDetails = (prompt) => {
  if (prompt.includes('sum') && prompt.includes('group')) return 'Group and sum values';
  if (prompt.includes('average') || prompt.includes('avg')) return 'Calculate averages by group';
  if (prompt.includes('count')) return 'Count records by group';
  return 'Group and summarize data';
};

const extractKafkaDetails = (prompt) => {
  if (prompt.includes('real-time')) return 'Real-time stream processing';
  if (prompt.includes('event')) return 'Event stream processing';
  return 'Stream processing with Kafka';
};

const extractOutputFileDetails = (prompt) => {
  if (prompt.includes('csv output')) return 'CSV File Output';
  if (prompt.includes('excel output')) return 'Excel File Output';
  if (prompt.includes('json output')) return 'JSON File Output';
  if (prompt.includes('xml output')) return 'XML File Output';
  if (prompt.includes('parquet output')) return 'Parquet File Output';
  return 'CSV File Output';
};

const extractOutputDatabaseDetails = (prompt) => {
  if (prompt.includes('postgres output')) return 'Write to PostgreSQL Database';
  if (prompt.includes('mysql output')) return 'Write to MySQL Database';
  if (prompt.includes('oracle output')) return 'Write to Oracle Database';
  if (prompt.includes('sql server output')) return 'Write to SQL Server Database';
  return 'Write to SQL Database';
};

const extractOutputApiDetails = (prompt) => {
  if (prompt.includes('rest output')) return 'Send to REST Endpoint';
  if (prompt.includes('webhook output')) return 'Send to Webhook';
  if (prompt.includes('graphql output')) return 'Send to GraphQL Endpoint';
  return 'Send to REST Endpoint';
};

// Helper function to create a node
const createNode = (id, type, label, description, subtype, position) => {
  return {
    id,
    type,
    position,
    data: { 
      label, 
      description,
      subtype
    },
  };
};

// Helper function to create an edge
const createEdge = (source, target) => {
  return {
    id: `e${source}-${target}`,
    source,
    target,
  };
};