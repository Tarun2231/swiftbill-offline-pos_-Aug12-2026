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
  AlertCircle,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function SettingsBackup() {
  const { 
    settings, 
    updateSettings, 
    exportDataJSON, 
    importDataJSON, 
    resetToDefaults, 
    adminPin, 
    changePin 
  } = useBilling();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [form, setForm] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // CHANGE PIN STATE
  const [showPinSection, setShowPinSection] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  
  const [pinChangeStatus, setPinChangeStatus] = useState(null);

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

  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    if (!currentPinInput.trim() || !newPinInput.trim()) {
      setPinChangeStatus({ success: false, message: 'Please fill all PIN fields.' });
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinChangeStatus({ success: false, message: 'New PIN and Confirm PIN do not match.' });
      return;
    }

    if (newPinInput.length < 4) {
      setPinChangeStatus({ success: false, message: 'New PIN must be at least 4 digits/characters.' });
      return;
    }

    const res = changePin(currentPinInput, newPinInput);
    setPinChangeStatus(res);

    if (res.success) {
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setTimeout(() => {
        setPinChangeStatus(null);
        setShowPinSection(false);
      }, 3000);
    }
  };

  return (
    <div style={{
      padding: isMobile ? '14px' : '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '14px' : '20px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Store Settings & Security
        </h2>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Business details, tax numbers, Master Admin PIN / Password change, and offline data backups.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
        gap: isMobile ? '14px' : '20px'
      }}>
        
        {/* Left Column: Business Profile Form */}
        <div className="glass-panel" style={{ padding: isMobile ? '16px' : '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Store size={18} color="#10b981" />
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Business Profile & Tax Setup
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div>
              <label className="form-label" style={{ fontSize: '12px' }}>Business / Store Name *</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="form-input"
                style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px' }}>Tagline / Business Subheading</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="form-input"
                style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Default Currency Symbol</label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="form-input"
                  placeholder="₹, $, €, £"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px' }}>Store Address</label>
              <textarea
                rows="2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="form-input"
                style={{ fontSize: '13px' }}
              ></textarea>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px' }}>Invoice Terms & Footer Disclaimer</label>
              <textarea
                rows="2"
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
                className="form-input"
                style={{ fontSize: '13px' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              {savedSuccess ? (
                <span style={{ color: '#10b981', fontSize: '12.5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={15} /> Settings saved!
                </span>
              ) : <span></span>}

              <button type="submit" className="btn btn-primary" style={{ padding: '9px 18px', fontWeight: '700' }}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Admin PIN + Backups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '18px' }}>
          
          {/* SECURITY & ADMIN PIN CHANGE CARD */}
          <div className="glass-panel" style={{
            padding: isMobile ? '16px' : '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1.5px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <KeyRound size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Security & Admin PIN
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Protect session lock & store config
                  </span>
                </div>
              </div>

              <span className="badge badge-success" style={{ fontSize: '10px' }}>
                Active
              </span>
            </div>

            {/* Current PIN Status Banner */}
            <div style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Current Master PIN:</span>
                <span className="mono" style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: showCurrentPin ? '2px' : '4px' }}>
                  {showCurrentPin ? adminPin : '••••'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowCurrentPin(!showCurrentPin)}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', gap: '4px', height: '28px' }}
                title="Toggle PIN Visibility"
              >
                {showCurrentPin ? <EyeOff size={13} /> : <Eye size={13} />}
                {showCurrentPin ? 'Hide' : 'Reveal'}
              </button>
            </div>

            {/* Toggle Change PIN Form Button */}
            {!showPinSection ? (
              <button
                type="button"
                onClick={() => {
                  setShowPinSection(true);
                  setPinChangeStatus(null);
                }}
                className="btn btn-primary"
                style={{ padding: '9px', fontSize: '12.5px', fontWeight: '700', gap: '6px' }}
              >
                <Lock size={14} /> Change Admin PIN / Password
              </button>
            ) : (
              <form onSubmit={handleChangePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Current Admin PIN *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPin ? "text" : "password"}
                      inputMode="numeric"
                      required
                      placeholder="Enter current PIN e.g. 1234"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      className="form-input mono"
                      style={{ paddingRight: '36px', height: '36px', minHeight: '36px', fontSize: '13px' }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      style={{ position: 'absolute', right: '8px', top: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showCurrentPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>New Admin PIN / Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPin ? "text" : "password"}
                      inputMode="numeric"
                      required
                      placeholder="Enter new PIN (min 4 digits)"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className="form-input mono"
                      style={{ paddingRight: '36px', height: '36px', minHeight: '36px', fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      style={{ position: 'absolute', right: '8px', top: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showNewPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Confirm New PIN *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPin ? "text" : "password"}
                      inputMode="numeric"
                      required
                      placeholder="Re-enter new PIN"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      className="form-input mono"
                      style={{ paddingRight: '36px', height: '36px', minHeight: '36px', fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      style={{ position: 'absolute', right: '8px', top: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showConfirmPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {pinChangeStatus && (
                  <div style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    backgroundColor: pinChangeStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    color: pinChangeStatus.success ? '#10b981' : '#f43f5e',
                    border: `1px solid ${pinChangeStatus.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                  }}>
                    {pinChangeStatus.message}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinSection(false);
                      setPinChangeStatus(null);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px', fontWeight: '700' }}
                  >
                    Save New PIN
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* BACKUP & DATA CONTROLS */}
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

            <button onClick={exportDataJSON} className="btn btn-primary" style={{ padding: '9px', fontSize: '12.5px', fontWeight: '700' }}>
              <HardDriveDownload size={15} /> Download Full JSON Backup
            </button>

            <hr style={{ borderColor: 'var(--border-color)', margin: '2px 0' }} />

            <div>
              <label className="form-label" style={{ fontSize: '11.5px' }}>
                Restore Data from Backup
              </label>

              <label className="btn btn-secondary" style={{ width: '100%', padding: '9px', cursor: 'pointer', fontSize: '12.5px' }}>
                <HardDriveUpload size={15} /> Select Backup File (.json)
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

          {/* RESET DEMO RECORDS */}
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
