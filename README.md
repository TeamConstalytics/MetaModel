# PNC Meta Model - Data Product Designer

A React-based application for designing data product workflows using React Flow.

## Features

- Interactive canvas for designing data products
- Drag-and-drop interface for creating workflow diagrams
- Three types of nodes: Data Sources, Processors, and Outputs
- Ability to connect nodes to create data flow
- Node properties panel for configuring each node
- Save and load workflow diagrams
- Export workflows as AsyncAPI 3.0.0 specification
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/TeamConstalytics/MetaModel.git
   cd MetaModel
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:12001
   ```

## Usage

1. **Adding Nodes**: Drag nodes from the left panel onto the canvas or use the toolbar in the top-right corner.

2. **Connecting Nodes**: Click and drag from a node's output handle (bottom) to another node's input handle (top) to create connections.

3. **Configuring Nodes**: Click on any node to open the properties panel where you can edit the node's properties based on its type:
   - Data Sources: Configure connection details, table names, and queries
   - Processors: Set business rules and transformation logic
   - Outputs: Define destination and format settings

4. **Moving Nodes**: Click and drag nodes to reposition them on the canvas.

5. **Panning and Zooming**: Use the mouse wheel to zoom in/out and drag the canvas to pan.

6. **Saving and Loading**: Use the Save and Load buttons to persist your workflow.

7. **Exporting as AsyncAPI**: Click the "Export as AsyncAPI" button to generate an AsyncAPI 3.0.0 specification for your workflow.

## Project Structure

```
src/
├── components/
│   ├── nodes/
│   │   ├── DataSourceNode.js
│   │   ├── ProcessorNode.js
│   │   └── OutputNode.js
│   ├── NodeToolbar.js
│   ├── LeftPanel.js
│   ├── SaveLoadButtons.js
│   └── ExportButton.js
├── utils/
│   └── asyncApiExporter.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## Technologies Used

- React.js
- React Flow
- js-yaml (for AsyncAPI export)
- CSS3

## Future Enhancements

- Additional node types for more complex data operations
- Node validation and error checking
- Integration with backend services for executing workflows
- User authentication and sharing capabilities
- Visual themes and customization options

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:12001](http://localhost:12001) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the workflow visualization library
- [Create React App](https://create-react-app.dev/) for the project setup
- [AsyncAPI Initiative](https://www.asyncapi.com/) for the AsyncAPI specification