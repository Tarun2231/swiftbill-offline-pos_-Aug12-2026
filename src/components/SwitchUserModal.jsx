import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  UserCheck, 
  X, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  LogOut,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function SwitchUserModal({ isOpen, onClose }) {
  const { 
    auth, 
    currentUser, 
    staffMembers, 
    login, 
    staffLogin, 
    logout,
    adminPin 
  } = useBilling();

  const isAdmin = auth?.role === 'admin' || currentUser?.role === 'Master Admin';

  const [mode, setMode] = useState(isAdmin ? 'staff' : 'admin');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [selectedStaffUser, setSelectedStaffUser] = useState('');
  const [staffPinInput, setStaffPinInput] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showStaffPin, setShowStaffPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const staffList = (staffMembers || []).filter(s => s.active !== false);

  useEffect(() => {
    if (isOpen) {
      setMode(isAdmin ? 'staff' : 'admin');
      setAdminPinInput('');
      setStaffPinInput('');
      setErrorMessage('');
      setSuccessMessage('');
      if (staffList.length > 0) {
        setSelectedStaffUser(staffList[0].username);
      }
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const handleAdminSwitch = (e) => {
    if (e) e.preventDefault();
    if (!adminPinInput.trim()) {
      setErrorMessage('Please enter the Master Admin PIN.');
      return;
    }
    const result = login(adminPinInput);
    if (result.success) {
      setSuccessMessage('Switched to Master Admin!');
      setTimeout(() => {
        onClose();
      }, 400);
    } else {
      setErrorMessage(result.message || 'Invalid Master PIN.');
      setAdminPinInput('');
    }
  };

  const handleStaffSwitch = (e) => {
    if (e) e.preventDefault();
    if (!selectedStaffUser) {
      setErrorMessage('Please select an employee.');
      return;
    }
    if (!staffPinInput.trim()) {
      setErrorMessage('Please enter the employee PIN.');
      return;
    }
    const result = staffLogin(selectedStaffUser, staffPinInput);
    if (result.success) {
      setSuccessMessage(`Switched to ${result.user?.name || 'Staff'}!`);
      setTimeout(() => {
        onClose();
      }, 400);
    } else {
      setErrorMessage(result.message || 'Invalid Employee PIN.');
      setStaffPinInput('');
    }
  };

  const handleFullLogout = () => {
    if (window.confirm('Are you sure you want to lock the POS terminal and completely sign out?')) {
      onClose();
      logout();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="modal-container" 
        style={{ 
          maxWidth: '440px', 
          padding: '24px 20px', 
          backgroundColor: 'var(--bg-modal)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Switch User Account
            </h3>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Active:</span>
              <span className="badge" style={{ 
                backgroundColor: isAdmin ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)', 
                color: isAdmin ? '#10b981' : '#3b82f6',
                fontWeight: '700',
                padding: '1px 6px'
              }}>
                {currentUser?.name || 'User'} ({currentUser?.role || 'Staff'})
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="btn-icon" 
            style={{ padding: '6px', color: 'var(--text-muted)' }}
            title="Cancel and return to current session"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Mode Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--bg-input)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          gap: '4px',
          marginBottom: '14px'
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setErrorMessage('');
            }}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: mode === 'admin' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'admin' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: mode === 'admin' ? '800' : '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: mode === 'admin' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <ShieldCheck size={14} color="#10b981" /> 👑 Master Admin
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('staff');
              setErrorMessage('');
            }}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: mode === 'staff' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'staff' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: mode === 'staff' ? '800' : '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: mode === 'staff' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Users size={14} color="#3b82f6" /> 👤 Staff / Cashier
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(244,63,94,0.12)',
            borderRadius: '6px',
            color: '#f43f5e',
            fontSize: '12px',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(16,185,129,0.12)',
            borderRadius: '6px',
            color: '#10b981',
            fontSize: '12px',
            textAlign: 'center',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={16} /> {successMessage}
          </div>
        )}

        {/* ADMIN FORM */}
        {mode === 'admin' ? (
          <form onSubmit={handleAdminSwitch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '11.5px' }}>
                Master Admin PIN / Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showAdminPin ? "text" : "password"}
                  maxLength={8}
                  placeholder="Enter Master PIN"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="form-input mono"
                  style={{
                    fontSize: '18px',
                    letterSpacing: showAdminPin ? '2px' : '6px',
                    textAlign: 'center',
                    padding: '8px 36px 8px 12px',
                    height: '42px',
                    fontWeight: '800'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPin(!showAdminPin)}
                  style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showAdminPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--text-muted)'
                }}
                title="Cancel and stay in current session without entering password"
              >
                ✕ Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, padding: '10px', fontSize: '13.5px', fontWeight: '700' }}
              >
                <ShieldCheck size={15} /> Switch to Admin
              </button>
            </div>
          </form>
        ) : (
          /* STAFF FORM */
          <form onSubmit={handleStaffSwitch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '11.5px' }}>
                Select Employee Account
              </label>
              <select
                value={selectedStaffUser}
                onChange={(e) => setSelectedStaffUser(e.target.value)}
                className="form-select"
                style={{ height: '40px', minHeight: '40px', fontSize: '13px' }}
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.username}>
                    👤 {s.name} ({s.role} - @{s.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '11.5px' }}>
                Employee PIN / Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showStaffPin ? "text" : "password"}
                  maxLength={8}
                  placeholder="Enter employee PIN"
                  value={staffPinInput}
                  onChange={(e) => setStaffPinInput(e.target.value)}
                  className="form-input mono"
                  style={{
                    fontSize: '18px',
                    letterSpacing: showStaffPin ? '2px' : '6px',
                    textAlign: 'center',
                    padding: '8px 36px 8px 12px',
                    height: '42px',
                    fontWeight: '800'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowStaffPin(!showStaffPin)}
                  style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showStaffPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--text-muted)'
                }}
                title="Cancel and stay in current session without entering password"
              >
                ✕ Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  flex: 2,
                  padding: '10px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  backgroundColor: '#3b82f6',
                  borderColor: '#3b82f6'
                }}
              >
                <UserCheck size={15} /> Switch to Staff
              </button>
            </div>
          </form>
        )}

        {/* Lock Terminal Full Logout Footer */}
        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={handleFullLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#f43f5e',
              fontSize: '11.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <LogOut size={13} /> Lock Terminal & Sign Out Entirely
          </button>
        </div>
      </div>
    </div>
  );
}
