# PNC Meta Model

A React-based application for designing data pipeline workflows using React Flow.

## Features

- Interactive canvas for designing data pipelines
- Drag-and-drop interface for creating workflow diagrams
- Three types of nodes: Data Sources, Processors, and Outputs
- Ability to connect nodes to create data flow
- Node properties panel for configuring each node
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
   http://localhost:12000
   ```

## Usage

1. **Adding Nodes**: Use the toolbar in the top-right corner to add Data Source, Processor, or Output nodes.

2. **Connecting Nodes**: Click and drag from a node's output handle (bottom) to another node's input handle (top) to create connections.

3. **Configuring Nodes**: Click on any node to open the properties panel where you can edit the node's label and description.

4. **Moving Nodes**: Click and drag nodes to reposition them on the canvas.

5. **Panning and Zooming**: Use the mouse wheel to zoom in/out and drag the canvas to pan.

## Project Structure

```
src/
├── components/
│   ├── nodes/
│   │   ├── DataSourceNode.js
│   │   ├── ProcessorNode.js
│   │   └── OutputNode.js
│   └── NodeToolbar.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## Technologies Used

- React.js
- React Flow
- CSS3

## Future Enhancements

- Save and load workflow diagrams
- Export workflows as JSON or images
- Additional node types for more complex data operations
- Node validation and error checking
- Integration with backend services for executing workflows
- User authentication and sharing capabilities

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:12000](http://localhost:12000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the workflow visualization library
- [Create React App](https://create-react-app.dev/) for the project setup
