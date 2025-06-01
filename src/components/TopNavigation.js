import React from 'react';
import { FaProjectDiagram, FaNetworkWired, FaCogs, FaStore } from 'react-icons/fa';

const TopNavigation = ({ activeModule, setActiveModule }) => {
  return (
    <div className="top-navigation">
      <div className="nav-logo">
        <h2>PNC Meta Model</h2>
      </div>
      <div className="nav-links">
        <button 
          className={`nav-link ${activeModule === 'dataProductDesigner' ? 'active' : ''}`}
          onClick={() => setActiveModule('dataProductDesigner')}
        >
          <FaProjectDiagram className="nav-icon" />
          <span>Data Product Designer</span>
        </button>
        <button 
          className={`nav-link ${activeModule === 'ontologyManagement' ? 'active' : ''}`}
          onClick={() => setActiveModule('ontologyManagement')}
        >
          <FaNetworkWired className="nav-icon" />
          <span>Ontology Management</span>
        </button>
        <button 
          className={`nav-link ${activeModule === 'dataFabricConfig' ? 'active' : ''}`}
          onClick={() => setActiveModule('dataFabricConfig')}
        >
          <FaCogs className="nav-icon" />
          <span>Data Fabric Configuration</span>
        </button>
        <button 
          className={`nav-link ${activeModule === 'dataProductsMarketplace' ? 'active' : ''}`}
          onClick={() => setActiveModule('dataProductsMarketplace')}
        >
          <FaStore className="nav-icon" />
          <span>Data Products Marketplace</span>
        </button>
      </div>
    </div>
  );
};

export default TopNavigation;