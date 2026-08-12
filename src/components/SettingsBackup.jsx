import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Store, 
  HardDriveDownload, 
  HardDriveUpload, 
  RefreshCw, 
  Save, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function SettingsBackup() {
  const { settings, updateSettings, exportDataJSON, importDataJSON, resetToDefaults } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [form, setForm] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = importDataJSON(evt.target.result);
      setImportStatus(result);
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '22px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Store Settings & Backup
        </h2>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Business details, tax numbers, currency, invoice footer disclaimer, and offline data backups.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
        gap: isMobile ? '16px' : '20px'
      }}>
        
        {/* Store Metadata Form */}
        <div className="glass-panel" style={{ padding: isMobile ? '16px' : '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Store size={18} color="#10b981" />
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Business Profile & Tax Setup
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div>
              <label className="form-label">Business / Store Name *</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Tagline / Business Subheading</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Default Currency Symbol</label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="form-input"
                  placeholder="₹, $, €, £"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Store Address</label>
              <textarea
                rows="2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="form-input"
              ></textarea>
            </div>

            <div>
              <label className="form-label">Invoice Terms & Footer Disclaimer</label>
              <textarea
                rows="3"
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
                className="form-input"
              ></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              {savedSuccess ? (
                <span style={{ color: '#10b981', fontSize: '12.5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={15} /> Settings saved!
                </span>
              ) : <span></span>}

              <button type="submit" className="btn btn-primary" style={{ padding: '9px 18px' }}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Backup & Data Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="glass-panel" style={{ padding: isMobile ? '16px' : '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardDriveDownload size={18} color="#3b82f6" />
              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Data Safety & JSON Backups
              </h3>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
              Your store data is saved locally on your device. Download a periodic backup to prevent data loss.
            </p>

            <button onClick={exportDataJSON} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
              <HardDriveDownload size={16} /> Download Full JSON Backup
            </button>

            <hr style={{ borderColor: 'var(--border-color)', margin: '2px 0' }} />

            <div>
              <label className="form-label">
                Restore Data from Backup
              </label>

              <label className="btn btn-secondary" style={{ width: '100%', padding: '10px', cursor: 'pointer', fontSize: '13px' }}>
                <HardDriveUpload size={16} /> Select Backup File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {importStatus && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11.5px',
                  backgroundColor: importStatus.success ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                  color: importStatus.success ? '#10b981' : '#f43f5e',
                  border: '1px solid',
                  borderColor: importStatus.success ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'
                }}>
                  {importStatus.message}
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(244,63,94,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertCircle size={16} color="#f43f5e" />
              <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: '#f43f5e', margin: 0 }}>Reset Demo Records</h4>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Reset all inventory, customers, and invoice records back to default sample state.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data to default demo state?')) {
                  resetToDefaults();
                }
              }}
              className="btn btn-danger"
              style={{ width: '100%', fontSize: '12px', padding: '8px' }}
            >
              <RefreshCw size={13} /> Reset to Demo Defaults
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
