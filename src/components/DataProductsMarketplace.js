import React, { useState } from 'react';
import { FaStore, FaSearch, FaFilter, FaShoppingCart, FaPlus, FaTimes, FaLink } from 'react-icons/fa';

const initialProducts = [
  {
    id: 1,
    name: 'Customer 360',
    description: 'Comprehensive view of customer data across all touchpoints.',
    domain: 'Finance Domain',
    sponsor: 'John Smith',
    process: 'Customer Onboarding',
    outcome: 'Improved customer satisfaction and retention',
    links: ['https://example.com/customer360'],
  },
  {
    id: 2,
    name: 'Transaction Analytics',
    description: 'Real-time analytics on financial transactions and patterns.',
    domain: 'Analytics Domain',
    sponsor: 'Jane Doe',
    process: 'Financial Reporting',
    outcome: 'Better fraud detection and financial insights',
    links: ['https://example.com/transactions'],
  },
  {
    id: 3,
    name: 'Risk Assessment',
    description: 'Comprehensive risk metrics and scoring for accounts.',
    domain: 'Risk Domain',
    sponsor: 'Robert Johnson',
    process: 'Risk Management',
    outcome: 'Reduced financial risk exposure',
    links: ['https://example.com/risk'],
  }
];

const DataProductsMarketplace = () => {
  const [products, setProducts] = useState(initialProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    domain: '',
    sponsor: '',
    process: '',
    outcome: '',
    links: [''],
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.description && newProduct.domain) {
      const productToAdd = {
        ...newProduct,
        id: products.length + 1,
        links: newProduct.links.filter(link => link.trim() !== '')
      };
      
      setProducts([...products, productToAdd]);
      setNewProduct({
        name: '',
        description: '',
        domain: '',
        sponsor: '',
        process: '',
        outcome: '',
        links: [''],
      });
      setShowAddForm(false);
    }
  };

  const handleAddLink = () => {
    setNewProduct({
      ...newProduct,
      links: [...newProduct.links, '']
    });
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = [...newProduct.links];
    updatedLinks.splice(index, 1);
    setNewProduct({
      ...newProduct,
      links: updatedLinks
    });
  };

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...newProduct.links];
    updatedLinks[index] = value;
    setNewProduct({
      ...newProduct,
      links: updatedLinks
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="data-products-marketplace">
      <div className="module-header">
        <h2><FaStore className="header-icon" /> Data Products Marketplace</h2>
        <p>Discover, explore, and use data products across your organization.</p>
      </div>
      
      <div className="marketplace-actions">
        <div className="marketplace-search">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search data products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
          <div className="filter-options">
            <FaFilter className="filter-icon" />
            <span>Filters:</span>
            <button className="filter-button">Category</button>
            <button className="filter-button">Domain</button>
            <button className="filter-button">Type</button>
          </div>
        </div>
        
        <button 
          className="add-product-button"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus className="button-icon" /> Add New Data Product
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-product-modal-overlay">
          <div className="add-product-modal">
            <div className="modal-header">
              <h3>Add New Data Product</h3>
              <button 
                className="close-modal-button"
                onClick={() => setShowAddForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Product Name*</label>
                <input 
                  type="text" 
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Data Domain*</label>
                <input 
                  type="text" 
                  name="domain"
                  value={newProduct.domain}
                  onChange={handleInputChange}
                  placeholder="Enter data domain"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Business Sponsor</label>
                <input 
                  type="text" 
                  name="sponsor"
                  value={newProduct.sponsor}
                  onChange={handleInputChange}
                  placeholder="Enter business sponsor"
                />
              </div>
              
              <div className="form-group">
                <label>Business Process</label>
                <input 
                  type="text" 
                  name="process"
                  value={newProduct.process}
                  onChange={handleInputChange}
                  placeholder="Enter business process"
                />
              </div>
              
              <div className="form-group">
                <label>Business Outcome</label>
                <input 
                  type="text" 
                  name="outcome"
                  value={newProduct.outcome}
                  onChange={handleInputChange}
                  placeholder="Enter business outcome"
                />
              </div>
              
              <div className="form-group">
                <label>Summary/Description*</label>
                <textarea 
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Links</label>
                <div className="links-container">
                  {newProduct.links.map((link, index) => (
                    <div key={index} className="link-input-group">
                      <input 
                        type="text" 
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder="Enter link URL"
                      />
                      {newProduct.links.length > 1 && (
                        <button 
                          className="remove-link-button"
                          onClick={() => handleRemoveLink(index)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    className="add-link-button"
                    onClick={handleAddLink}
                  >
                    <FaPlus className="button-icon" /> Add Link
                  </button>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                className="save-button"
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.description || !newProduct.domain}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedProduct && (
        <div className="product-details-modal-overlay">
          <div className="product-details-modal">
            <div className="modal-header">
              <h3>{selectedProduct.name}</h3>
              <button 
                className="close-modal-button"
                onClick={() => setSelectedProduct(null)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="product-detail">
                <strong>Domain:</strong> {selectedProduct.domain}
              </div>
              
              <div className="product-detail">
                <strong>Business Sponsor:</strong> {selectedProduct.sponsor || 'Not specified'}
              </div>
              
              <div className="product-detail">
                <strong>Business Process:</strong> {selectedProduct.process || 'Not specified'}
              </div>
              
              <div className="product-detail">
                <strong>Business Outcome:</strong> {selectedProduct.outcome || 'Not specified'}
              </div>
              
              <div className="product-detail">
                <strong>Description:</strong>
                <p>{selectedProduct.description}</p>
              </div>
              
              {selectedProduct.links && selectedProduct.links.length > 0 && (
                <div className="product-detail">
                  <strong>Links:</strong>
                  <ul className="product-links">
                    {selectedProduct.links.map((link, index) => (
                      <li key={index}>
                        <FaLink className="link-icon" />
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="product-action"
                onClick={() => setSelectedProduct(null)}
              >
                <FaShoppingCart className="action-icon" /> Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="marketplace-content">
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-header">{product.name}</div>
              <div className="product-description">
                {product.description}
              </div>
              <div className="product-footer">
                <span className="product-owner">{product.domain}</span>
                <button 
                  className="product-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Subscribe logic would go here
                  }}
                >
                  <FaShoppingCart className="action-icon" /> Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="marketplace-message">
            <p>No data products found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataProductsMarketplace;