import React, { useState } from 'react';
import { FaKeyboard, FaTimes } from 'react-icons/fa';

const KeyboardShortcutsHelp = () => {
  const [showModal, setShowModal] = useState(false);
  
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  const shortcuts = [
    {
      category: 'Adding Nodes',
      items: [
        { keys: ['Ctrl/Cmd', '1'], description: 'Add Data Source' },
        { keys: ['Ctrl/Cmd', '2'], description: 'Add Processor' },
        { keys: ['Ctrl/Cmd', '3'], description: 'Add Output' }
      ]
    },
    {
      category: 'File Operations',
      items: [
        { keys: ['Ctrl/Cmd', 'S'], description: 'Save Workflow' },
        { keys: ['Ctrl/Cmd', 'E'], description: 'Export as AsyncAPI' }
      ]
    },
    {
      category: 'Editing',
      items: [
        { keys: ['Ctrl/Cmd', 'Z'], description: 'Undo' },
        { keys: ['Ctrl/Cmd', 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Delete'], description: 'Delete selected node or edge' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Space', 'Drag'], description: 'Pan canvas' },
        { keys: ['Mouse Wheel'], description: 'Zoom in/out' },
        { keys: ['Ctrl/Cmd', '0'], description: 'Reset zoom & position' }
      ]
    },
    {
      category: 'Selection',
      items: [
        { keys: ['Click'], description: 'Select node or edge' },
        { keys: ['Shift', 'Click'], description: 'Add to selection' },
        { keys: ['Escape'], description: 'Clear selection' }
      ]
    }
  ];
  
  return (
    <>
      <button 
        className="keyboard-help-button" 
        onClick={toggleModal}
        title="Keyboard Shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        <FaKeyboard />
      </button>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content keyboard-shortcuts-modal">
            <div className="modal-header">
              <h3><FaKeyboard className="header-icon" /> Keyboard Shortcuts</h3>
              <button className="close-button" onClick={toggleModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {shortcuts.map((category, index) => (
                <div key={index} className="shortcut-category">
                  <h4>{category.category}</h4>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="shortcut-item">
                      <span className="shortcut-description">{item.description}</span>
                      <div className="shortcut-keys">
                        {item.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd>{key}</kbd>
                            {keyIndex < item.keys.length - 1 && <span>+</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelp;