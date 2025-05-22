/**
 * History manager for undo/redo functionality
 */

class HistoryManager {
  constructor(initialState = null, maxHistorySize = 50) {
    this.history = initialState ? [initialState] : [];
    this.currentIndex = initialState ? 0 : -1;
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Add a new state to the history
   * @param {Object} state - The new state to add
   */
  push(state) {
    // If we're not at the end of the history, remove all future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    // Add the new state
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.currentIndex = this.history.length - 1;
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Go back to the previous state
   * @returns {Object|null} The previous state, or null if there is no previous state
   */
  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  /**
   * Go forward to the next state
   * @returns {Object|null} The next state, or null if there is no next state
   */
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  /**
   * Check if undo is available
   * @returns {boolean} True if undo is available
   */
  canUndo() {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean} True if redo is available
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get the current state
   * @returns {Object|null} The current state, or null if there is no state
   */
  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  /**
   * Clear the history
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export default HistoryManager;