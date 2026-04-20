import React, { useState } from 'react';
import { Store, Building, CreditCard, Code, Copy, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [formData, setFormData] = useState({
    storeName: 'Curator Flagship London',
    supportEmail: 'ops@curator-retail.com',
    physicalAddress: '15 Savile Row, Mayfair, London, W1S 3PJ, United Kingdom',
    enableDigitalReceipts: true,
    defaultTaxRate: '20.00',
    taxCalculationMethod: 'inclusive',
    roundTax: true,
    displayTaxOnLabels: false,
   productionApiKey: import.meta.env.VITE_STRIPE_KEY
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(formData.productionApiKey);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Navbar />
        
        <div className="page-content">
          {/* Header */}
          <div className="settings-header">
            <div className="settings-header-content">
              <h1 className="page-title">System Settings</h1>
              <p className="page-description">
                Configure your store preferences, tax settings, payment methods, and third-party integrations.
              </p>
            </div>
            <div className="settings-header-actions">
              <button className="btn btn-ghost">Discard</button>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Store Profile Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title">
                <Store size={20} className="settings-card-icon" />
                <h2>Store Profile</h2>
              </div>
            </div>
            <div className="settings-card-content">
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Support Email</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Physical Address</label>
                <textarea
                  value={formData.physicalAddress}
                  onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                  className="form-textarea"
                  rows={2}
                />
              </div>
              <div className="form-group">
                <div className="toggle-group">
                  <div className="toggle-content">
                    <label className="toggle-label">Enable Digital Receipts</label>
                    <p className="toggle-description">Send eco-friendly receipts via email or SMS</p>
                  </div>
                  <button
                    className={`toggle-switch ${formData.enableDigitalReceipts ? 'active' : ''}`}
                    onClick={() => handleToggle('enableDigitalReceipts')}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Configuration Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title">
                <Building size={20} className="settings-card-icon" />
                <h2>Tax Configuration</h2>
              </div>
            </div>
            <div className="settings-card-content">
              <div className="form-group">
                <label className="form-label">Default Tax Rate (%)</label>
                <input
                  type="text"
                  value={formData.defaultTaxRate}
                  onChange={(e) => handleInputChange('defaultTaxRate', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Calculation Method</label>
                <select
                  value={formData.taxCalculationMethod}
                  onChange={(e) => handleInputChange('taxCalculationMethod', e.target.value)}
                  className="form-select"
                >
                  <option value="inclusive">Inclusive (VAT style)</option>
                  <option value="exclusive">Exclusive (Sales tax style)</option>
                </select>
              </div>
              <div className="form-group">
                <div className="toggle-group">
                  <div className="toggle-content">
                    <label className="toggle-label">Round tax to nearest cent</label>
                  </div>
                  <button
                    className={`toggle-switch ${formData.roundTax ? 'active' : ''}`}
                    onClick={() => handleToggle('roundTax')}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <div className="toggle-group">
                  <div className="toggle-content">
                    <label className="toggle-label">Display tax on labels</label>
                  </div>
                  <button
                    className={`toggle-switch ${formData.displayTaxOnLabels ? 'active' : ''}`}
                    onClick={() => handleToggle('displayTaxOnLabels')}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title">
                <CreditCard size={20} className="settings-card-icon" />
                <h2>Payment Methods</h2>
              </div>
            </div>
            <div className="settings-card-content">
              <div className="payment-methods-list">
                <div className="payment-method-item">
                  <div className="payment-method-info">
                    <div className="payment-method-name">Credit / Debit Card</div>
                    <div className="payment-method-status">ACTIVE · MAIN TERMINAL</div>
                  </div>
                  <button className="payment-method-config">
                    <SettingsIcon size={16} />
                  </button>
                </div>
                <div className="payment-method-item">
                  <div className="payment-method-info">
                    <div className="payment-method-name">Contactless (NFC)</div>
                    <div className="payment-method-status">ACTIVE · APPLE PAY / GOOGLE PAY</div>
                  </div>
                  <button className="payment-method-config">
                    <SettingsIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API & Integrations Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title">
                <Code size={20} className="settings-card-icon" />
                <h2>API & Integrations</h2>
                <span className="integration-badge">LIVE: 4 ACTIVE</span>
              </div>
            </div>
            <div className="settings-card-content">
              <div className="form-group">
                <label className="form-label">Production API Key</label>
                <div className="api-key-group">
                  <input
                    type="password"
                    value={formData.productionApiKey}
                    readOnly
                    className="form-input api-key-input"
                  />
                  <button className="api-key-copy" onClick={copyApiKey}>
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="integrations-list">
                <div className="integration-item">
                  <div className="integration-info">
                    <div className="integration-name">Shopify Sync</div>
                    <div className="integration-status">
                      <span className="status-dot active"></span>
                      Connected
                    </div>
                  </div>
                  <ChevronRight size={16} className="integration-arrow" />
                </div>
                <div className="integration-item">
                  <div className="integration-info">
                    <div className="integration-name">QuickBooks</div>
                    <div className="integration-status">
                      <span className="status-dot active"></span>
                      Connected
                    </div>
                  </div>
                  <ChevronRight size={16} className="integration-arrow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
