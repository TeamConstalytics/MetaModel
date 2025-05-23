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
              <p>Describe the data pipeline you want to build. Include details about:</p>
              <ul>
                <li>Data sources (files, databases, APIs)</li>
                <li>Processing steps (filtering, transformations, aggregations)</li>
                <li>Output destinations (files, databases, APIs)</li>
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
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your data pipeline in natural language. Be specific about sources, processing steps, and outputs."
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