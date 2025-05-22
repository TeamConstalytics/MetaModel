import { useEffect, useCallback } from 'react';

const KeyboardShortcuts = ({ 
  onAddDataSource, 
  onAddProcessor, 
  onAddOutput, 
  onSave, 
  onExport,
  onUndo,
  onRedo
}) => {
  const handleKeyDown = useCallback((event) => {
    // Check if Ctrl/Cmd key is pressed
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    // Skip if user is typing in an input field
    if (
      event.target.tagName === 'INPUT' || 
      event.target.tagName === 'TEXTAREA' || 
      event.target.isContentEditable
    ) {
      return;
    }

    // Keyboard shortcuts
    switch (true) {
      // Ctrl/Cmd + 1: Add Data Source
      case isCtrlOrCmd && event.key === '1':
        event.preventDefault();
        onAddDataSource && onAddDataSource();
        break;
      
      // Ctrl/Cmd + 2: Add Processor
      case isCtrlOrCmd && event.key === '2':
        event.preventDefault();
        onAddProcessor && onAddProcessor();
        break;
      
      // Ctrl/Cmd + 3: Add Output
      case isCtrlOrCmd && event.key === '3':
        event.preventDefault();
        onAddOutput && onAddOutput();
        break;
      
      // Ctrl/Cmd + S: Save
      case isCtrlOrCmd && event.key === 's':
        event.preventDefault();
        onSave && onSave();
        break;
      
      // Ctrl/Cmd + E: Export
      case isCtrlOrCmd && event.key === 'e':
        event.preventDefault();
        onExport && onExport();
        break;
        
      // Ctrl/Cmd + Z: Undo
      case isCtrlOrCmd && event.key === 'z' && !event.shiftKey:
        event.preventDefault();
        onUndo && onUndo();
        break;
        
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      case (isCtrlOrCmd && event.key === 'z' && event.shiftKey) || 
           (isCtrlOrCmd && event.key === 'y'):
        event.preventDefault();
        onRedo && onRedo();
        break;
        
      default:
        break;
    }
  }, [onAddDataSource, onAddProcessor, onAddOutput, onSave, onExport, onUndo, onRedo]);

  useEffect(() => {
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // This component doesn't render anything
  return null;
};

export default KeyboardShortcuts;