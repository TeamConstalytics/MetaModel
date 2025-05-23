import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPlay } from 'react-icons/fa';
import './ConversationPrompt.css';

const ConversationPrompt = ({ onGenerateFlow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a description of your data pipeline.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Here we would typically make an API call to a backend service
      // that would process the prompt and return a flow configuration
      // For now, we'll simulate this with a timeout and generate a simple flow
      
      setTimeout(() => {
        // Generate a simple flow based on the prompt
        const generatedFlow = generateFlowFromPrompt(prompt);
        
        // Pass the generated flow to the parent component
        onGenerateFlow(generatedFlow);
        
        // Close the prompt modal
        setIsLoading(false);
        setIsOpen(false);
        setPrompt('');
      }, 1500);
    } catch (err) {
      setError('Failed to generate flow. Please try again.');
      setIsLoading(false);
    }
  };

  // Simple function to generate a flow based on the prompt
  // In a real implementation, this would be replaced with an API call to a backend service
  const generateFlowFromPrompt = (promptText) => {
    const promptLower = promptText.toLowerCase();
    
    // Default nodes that will be part of most flows
    const nodes = [];
    const edges = [];
    
    // Determine data source type
    let sourceType = 'file'; // default
    let sourceLabel = 'File Source';
    let sourceDesc = 'CSV File Input';
    
    if (promptLower.includes('database') || promptLower.includes('sql') || promptLower.includes('postgres')) {
      sourceType = 'database';
      sourceLabel = 'Database Source';
      sourceDesc = 'SQL Database Connection';
    } else if (promptLower.includes('api') || promptLower.includes('rest') || promptLower.includes('http')) {
      sourceType = 'api';
      sourceLabel = 'API Source';
      sourceDesc = 'REST API Endpoint';
    }
    
    // Add source node
    nodes.push({
      id: '1',
      type: 'dataSource',
      position: { x: 250, y: 100 },
      data: { 
        label: sourceLabel, 
        description: sourceDesc,
        subtype: sourceType
      },
    });
    
    // Determine if we need processing nodes
    let processorCount = 0;
    
    // Check for filtering needs
    if (promptLower.includes('filter') || promptLower.includes('where') || promptLower.includes('condition')) {
      processorCount++;
      nodes.push({
        id: String(processorCount + 1),
        type: 'processor',
        position: { x: 250, y: 100 + processorCount * 150 },
        data: { 
          label: 'Filter Processor', 
          description: 'Filter data based on conditions',
          subtype: 'filter'
        },
      });
      
      // Add edge from previous node to this one
      edges.push({
        id: `e${processorCount}-${processorCount + 1}`,
        source: String(processorCount),
        target: String(processorCount + 1),
      });
    }
    
    // Check for transformation needs
    if (promptLower.includes('transform') || promptLower.includes('convert') || promptLower.includes('change')) {
      processorCount++;
      nodes.push({
        id: String(processorCount + 1),
        type: 'processor',
        position: { x: 250, y: 100 + processorCount * 150 },
        data: { 
          label: 'Transform Processor', 
          description: 'Transform data structure or format',
          subtype: 'transform'
        },
      });
      
      // Add edge from previous node to this one
      edges.push({
        id: `e${processorCount}-${processorCount + 1}`,
        source: String(processorCount),
        target: String(processorCount + 1),
      });
    }
    
    // Check for aggregation needs
    if (promptLower.includes('aggregate') || promptLower.includes('group') || promptLower.includes('summarize')) {
      processorCount++;
      nodes.push({
        id: String(processorCount + 1),
        type: 'processor',
        position: { x: 250, y: 100 + processorCount * 150 },
        data: { 
          label: 'Aggregate Processor', 
          description: 'Group and summarize data',
          subtype: 'aggregate'
        },
      });
      
      // Add edge from previous node to this one
      edges.push({
        id: `e${processorCount}-${processorCount + 1}`,
        source: String(processorCount),
        target: String(processorCount + 1),
      });
    }
    
    // Check for streaming needs
    if (promptLower.includes('kafka') || promptLower.includes('stream') || promptLower.includes('real-time')) {
      processorCount++;
      nodes.push({
        id: String(processorCount + 1),
        type: 'processor',
        position: { x: 250, y: 100 + processorCount * 150 },
        data: { 
          label: 'Kafka Processor', 
          description: 'Stream processing with Kafka',
          subtype: 'kafka'
        },
      });
      
      // Add edge from previous node to this one
      edges.push({
        id: `e${processorCount}-${processorCount + 1}`,
        source: String(processorCount),
        target: String(processorCount + 1),
      });
    }
    
    // Determine output type
    let outputType = 'file'; // default
    let outputLabel = 'File Output';
    let outputDesc = 'CSV File Output';
    
    if (promptLower.includes('database output') || promptLower.includes('save to database') || promptLower.includes('store in database')) {
      outputType = 'database';
      outputLabel = 'Database Output';
      outputDesc = 'Write to SQL Database';
    } else if (promptLower.includes('api output') || promptLower.includes('webhook') || promptLower.includes('send to endpoint')) {
      outputType = 'api';
      outputLabel = 'API Output';
      outputDesc = 'Send to REST Endpoint';
    }
    
    // Add output node
    const outputId = String(nodes.length + 1);
    nodes.push({
      id: outputId,
      type: 'output',
      position: { x: 250, y: 100 + nodes.length * 150 },
      data: { 
        label: outputLabel, 
        description: outputDesc,
        subtype: outputType
      },
    });
    
    // Add edge from last processor to output
    if (processorCount > 0) {
      edges.push({
        id: `e${processorCount + 1}-${outputId}`,
        source: String(processorCount + 1),
        target: outputId,
      });
    } else {
      // If no processors, connect source directly to output
      edges.push({
        id: `e1-${outputId}`,
        source: '1',
        target: outputId,
      });
    }
    
    return { nodes, edges };
  };

  return (
    <>
      <button 
        className="conversation-prompt-button"
        onClick={() => setIsOpen(true)}
        title="Generate Flow from Description"
      >
        <FaRobot className="button-icon" />
        <span className="button-text">AI Generate</span>
      </button>
      
      {isOpen && (
        <div className="conversation-prompt-overlay">
          <div className="conversation-prompt-modal">
            <div className="conversation-prompt-header">
              <h3><FaRobot /> Generate Data Pipeline</h3>
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="conversation-prompt-content">
              <p>Describe the data pipeline you want to build. Include details about:</p>
              <ul>
                <li>Data sources (files, databases, APIs)</li>
                <li>Processing steps (filtering, transformations, aggregations)</li>
                <li>Output destinations (files, databases, APIs)</li>
              </ul>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: I need a pipeline that reads data from a CSV file, filters out rows with missing values, transforms date columns to a standard format, and saves the result to a PostgreSQL database."
                  rows={6}
                  disabled={isLoading}
                />
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="conversation-prompt-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="generate-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>Generating...</span>
                    ) : (
                      <>
                        <FaPlay className="button-icon" />
                        <span>Generate Flow</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationPrompt;