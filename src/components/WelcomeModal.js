import React, { useState, useEffect } from 'react';
import { FaTimes, FaLightbulb, FaKeyboard, FaMousePointer, FaRegHandPointRight } from 'react-icons/fa';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Check if this is the first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);
  
  const closeModal = () => {
    setIsOpen(false);
  };
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeModal();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const tutorialSteps = [
    {
      title: "Welcome to PNC Meta Model",
      content: (
        <div>
          <p>This tool helps you design data product workflows using a visual interface.</p>
          <p>Let's walk through the basics to get you started quickly.</p>
        </div>
      ),
      icon: <FaLightbulb className="tutorial-icon" />
    },
    {
      title: "Adding Nodes",
      content: (
        <div>
          <p>You can add nodes to your workflow in two ways:</p>
          <ul>
            <li>Drag components from the left panel onto the canvas</li>
            <li>Use the toolbar buttons at the top-right</li>
          </ul>
          <p>There are three types of nodes:</p>
          <ul>
            <li><strong>Data Sources</strong>: Where your data comes from</li>
            <li><strong>Processors</strong>: Transform and manipulate your data</li>
            <li><strong>Outputs</strong>: Where your processed data goes</li>
          </ul>
        </div>
      ),
      icon: <FaMousePointer className="tutorial-icon" />
    },
    {
      title: "Connecting Nodes",
      content: (
        <div>
          <p>Connect nodes to create a data flow:</p>
          <ol>
            <li>Click and hold on a node's output handle (bottom)</li>
            <li>Drag to another node's input handle (top)</li>
            <li>Release to create a connection</li>
          </ol>
          <p>Connections represent how data flows from one node to another.</p>
        </div>
      ),
      icon: <FaRegHandPointRight className="tutorial-icon" />
    },
    {
      title: "Configuring Nodes",
      content: (
        <div>
          <p>Click on any node to open its properties panel:</p>
          <ul>
            <li>Edit the node's label and description</li>
            <li>Configure connection details for data sources</li>
            <li>Set transformation rules for processors</li>
            <li>Define output formats and destinations</li>
          </ul>
          <p>Each node type has different configuration options.</p>
        </div>
      ),
      icon: <FaMousePointer className="tutorial-icon" />
    },
    {
      title: "Keyboard Shortcuts",
      content: (
        <div>
          <p>Speed up your workflow with these shortcuts:</p>
          <ul>
            <li><kbd>Ctrl/Cmd + 1</kbd>: Add Data Source</li>
            <li><kbd>Ctrl/Cmd + 2</kbd>: Add Processor</li>
            <li><kbd>Ctrl/Cmd + 3</kbd>: Add Output</li>
            <li><kbd>Ctrl/Cmd + S</kbd>: Save Workflow</li>
            <li><kbd>Ctrl/Cmd + E</kbd>: Export as AsyncAPI</li>
            <li><kbd>Ctrl/Cmd + Z</kbd>: Undo</li>
            <li><kbd>Ctrl/Cmd + Shift + Z</kbd>: Redo</li>
          </ul>
        </div>
      ),
      icon: <FaKeyboard className="tutorial-icon" />
    }
  ];
  
  if (!isOpen) return null;
  
  const currentTutorial = tutorialSteps[currentStep];
  
  return (
    <div className="modal-overlay welcome-overlay">
      <div className="modal-content welcome-modal">
        <div className="modal-header">
          <h3>{currentTutorial.icon} {currentTutorial.title}</h3>
          <button className="close-button" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body welcome-body">
          {currentTutorial.content}
        </div>
        <div className="welcome-footer">
          <div className="step-indicators">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`step-indicator ${index === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          <div className="welcome-actions">
            {currentStep > 0 && (
              <button className="prev-button" onClick={prevStep}>
                Previous
              </button>
            )}
            <button className="next-button" onClick={nextStep}>
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;