import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPlay } from 'react-icons/fa';
import './ConversationPrompt.css';
import { generateFlowFromPrompt } from '../api/aiService';

const ConversationPrompt = ({ onGenerateFlow, buttonClassName }) => {
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
      // Call the AI service to generate a flow based on the prompt
      const generatedFlow = await generateFlowFromPrompt(prompt);
      
      // Pass the generated flow to the parent component
      onGenerateFlow(generatedFlow);
      
      // Close the prompt modal
      setIsLoading(false);
      setIsOpen(false);
      setPrompt('');
    } catch (err) {
      console.error('Error generating flow:', err);
      setError('Failed to generate flow. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className={buttonClassName || "conversation-prompt-button"}
        onClick={() => setIsOpen(true)}
        title="Generate Flow from Description"
      >
        <FaRobot className={buttonClassName ? "utility-icon" : "button-icon"} />
        <span className={buttonClassName ? "" : "button-text"}>AI Generate</span>
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
              <p>Describe the data pipeline you want to build in natural language. The more details you provide, the better the generated pipeline will match your needs.</p>
              <ul>
                <li><strong>Data sources:</strong> Specify file formats (CSV, JSON), databases (PostgreSQL, MongoDB), messaging systems (Kafka), or APIs</li>
                <li><strong>Processing steps:</strong> Describe filtering conditions, transformations, joins, aggregations, or business rules</li>
                <li><strong>Output destinations:</strong> Indicate where results should be stored (databases, files, APIs, visualization tools)</li>
                <li><strong>Use cases:</strong> Explain the business purpose of this pipeline to help with optimization</li>
              </ul>
              
              <div className="prompt-examples">
                <h4>Example prompts:</h4>
                <div className="example-list">
                  <div className="example-item" onClick={() => setPrompt("I need a pipeline that reads data from a CSV file, filters out rows with missing values, transforms date columns to a standard format, and saves the result to a PostgreSQL database.")}>
                    CSV to PostgreSQL with filtering and transformation
                  </div>
                  <div className="example-item" onClick={() => setPrompt("Create a data pipeline that pulls data from a REST API, aggregates it by customer region, and outputs the results to a dashboard.")}>
                    API to dashboard with aggregation
                  </div>
                  <div className="example-item" onClick={() => setPrompt("Build a real-time pipeline that processes Kafka streams, filters out invalid messages, and sends the results to a webhook endpoint.")}>
                    Kafka stream processing with filtering
                  </div>
                  <div className="example-item" onClick={() => setPrompt("Create a data pipeline that reads customer data from MongoDB, enriches it with product information from a REST API, and stores the results in Elasticsearch for search capabilities.")}>
                    MongoDB to Elasticsearch with API enrichment
                  </div>
                  <div className="example-item" onClick={() => setPrompt("Build a graph data pipeline that extracts transaction data from a PostgreSQL database, transforms it into a graph structure with customers and merchants as nodes, and loads it into Neo4J for fraud detection analysis.")}>
                    SQL to Neo4J Graph for fraud detection
                  </div>
                  <div className="example-item" onClick={() => setPrompt("Create a real-time data pipeline that consumes IoT sensor data from Kafka, performs anomaly detection using a transformation processor, and outputs alerts to both a MongoDB collection and a webhook endpoint.")}>
                    IoT data processing with multi-destination output
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: I need a data pipeline that ingests customer transaction data from a MongoDB database, enriches it with product information from a REST API, performs fraud detection using a custom algorithm, and stores results in both Elasticsearch for search and Kafka for real-time alerts."
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