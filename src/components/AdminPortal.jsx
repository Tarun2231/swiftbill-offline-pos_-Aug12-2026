import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Car, 
  Utensils, 
  Package, 
  Lock, 
  ArrowRight, 
  Sun, 
  Moon, 
  Users, 
  UserCheck, 
  Eye, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function AdminPortal({ onOpenStaff }) {
  const { 
    login, 
    staffLogin, 
    adminPin, 
    staffMembers, 
    switchBusiness, 
    theme, 
    toggleTheme 
  } = useBilling();

  const [loginMode, setLoginMode] = useState('admin'); // 'admin' | 'staff'
  const [pinInput, setPinInput] = useState('');
  const [selectedStaffUser, setSelectedStaffUser] = useState('');
  const [staffPinInput, setStaffPinInput] = useState('');
  const [selectedBizForStaff, setSelectedBizForStaff] = useState('grocery');
  
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showStaffPin, setShowStaffPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const staffList = (staffMembers || []).filter(s => s.active !== false);

  useEffect(() => {
    if (staffList.length > 0 && !selectedStaffUser) {
      setSelectedStaffUser(staffList[0].username);
    }
  }, [staffList]);

  // Admin PIN Submit
  const handleAdminPinSubmit = (e) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMessage('Enter Master PIN');
      return;
    }
    const result = login(pinInput);
    if (result.success) {
      setUnlocked(true);
      setErrorMessage('');
    } else {
      setErrorMessage(result.message || 'Invalid PIN');
      setPinInput('');
    }
  };

  // Staff Login Submit
  const handleStaffLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedStaffUser) {
      setErrorMessage('Select an employee');
      return;
    }
    if (!staffPinInput.trim()) {
      setErrorMessage('Enter employee PIN');
      return;
    }
    const result = staffLogin(selectedStaffUser, staffPinInput);
    if (result.success) {
      switchBusiness(selectedBizForStaff);
      setErrorMessage('');
    } else {
      setErrorMessage(result.message || 'Invalid PIN');
      setStaffPinInput('');
    }
  };

  const handleKeypadPress = (num) => {
    setErrorMessage('');
    if (loginMode === 'admin') {
      if (pinInput.length < 8) {
        const nextPin = pinInput + num;
        setPinInput(nextPin);
        if (nextPin.length >= 4 && nextPin === adminPin) {
          const result = login(nextPin);
          if (result.success) {
            setUnlocked(true);
            setErrorMessage('');
          }
        }
      }
    } else {
      if (staffPinInput.length < 8) {
        setStaffPinInput(prev => prev + num);
      }
    }
  };

  const handleKeypadBackspace = () => {
    if (loginMode === 'admin') {
      setPinInput((prev) => prev.slice(0, -1));
    } else {
      setStaffPinInput((prev) => prev.slice(0, -1));
    }
  };

  const handleCancel = () => {
    setPinInput('');
    setStaffPinInput('');
    setErrorMessage('');
    if (loginMode === 'staff') {
      setLoginMode('admin');
    }
  };

  const handleLaunchBusiness = (businessId) => {
    switchBusiness(businessId);
    login(adminPin);
  };

  const businessCards = [
    { id: 'grocery', title: 'Fresh Mart Grocery', badge: 'Produce', color: '#10b981', icon: ShoppingBag },
    { id: 'restaurant', title: 'Bistro 99 Restaurant', badge: 'Dining', color: '#f59e0b', icon: Utensils },
    { id: 'automotive', title: 'Apex Auto Garage', badge: 'Garage', color: '#3b82f6', icon: Car },
    { id: 'retail', title: 'TechNova Superstore', badge: 'Retail', color: '#8b5cf6', icon: Package }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 12px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Theme Toggle Top Right */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '6px 10px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          color: theme === 'dark' ? '#fbbf24' : '#3b82f6',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11.5px',
          fontWeight: '600'
        }}
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      {/* Center Container */}
      <div style={{ width: '100%', maxWidth: unlocked ? '720px' : '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        
        {/* Compact Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #0c831f 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(12, 131, 31, 0.3)'
          }}>
            <ShieldCheck size={18} color="#ffffff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
            SwiftBill
          </span>
        </div>

        {/* STEP 1: MINIMAL LOGIN CARD */}
        {!unlocked ? (
          <div className="glass-panel" style={{
            width: '100%',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            boxSizing: 'border-box'
          }}>
            
            {/* Segmented Mode Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '3px',
              borderRadius: '8px',
              gap: '3px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setErrorMessage('');
                  setPinInput('');
                }}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: loginMode === 'admin' ? 'var(--bg-card)' : 'transparent',
                  color: loginMode === 'admin' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: loginMode === 'admin' ? '700' : '500',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: loginMode === 'admin' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <ShieldCheck size={13} color="#10b981" /> Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('staff');
                  setErrorMessage('');
                  setStaffPinInput('');
                }}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: loginMode === 'staff' ? 'var(--bg-card)' : 'transparent',
                  color: loginMode === 'staff' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: loginMode === 'staff' ? '700' : '500',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: loginMode === 'staff' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Users size={13} color="#3b82f6" /> Staff
              </button>
            </div>

            {/* A. ADMIN FORM */}
            {loginMode === 'admin' ? (
              <form onSubmit={handleAdminPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminPin ? "text" : "password"}
                    maxLength={8}
                    placeholder="Enter Master PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="form-input mono"
                    style={{
                      fontSize: '20px',
                      letterSpacing: showAdminPin ? '2px' : '8px',
                      textAlign: 'center',
                      padding: '6px 36px 6px 12px',
                      height: '42px',
                      fontWeight: '800',
                      borderRadius: '8px'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title={showAdminPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showAdminPin ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {errorMessage && (
                  <div style={{ padding: '6px 8px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '6px', color: '#f43f5e', fontSize: '11.5px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Compact Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '8px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Cancel entry"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    style={{
                      padding: '8px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '8px 0',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Backspace"
                  >
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>⌫</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '9px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '9px', fontSize: '12.5px', fontWeight: '700' }}
                  >
                    <Lock size={13} /> Unlock
                  </button>
                </div>
              </form>
            ) : (
              /* B. STAFF FORM */
              <form onSubmit={handleStaffLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '3px' }}>Employee</label>
                  <select
                    value={selectedStaffUser}
                    onChange={(e) => setSelectedStaffUser(e.target.value)}
                    className="form-select"
                    style={{ height: '36px', minHeight: '36px', fontSize: '12.5px', borderRadius: '6px' }}
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.username}>
                        👤 {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '3px' }}>Store</label>
                  <select
                    value={selectedBizForStaff}
                    onChange={(e) => setSelectedBizForStaff(e.target.value)}
                    className="form-select"
                    style={{ height: '36px', minHeight: '36px', fontSize: '12.5px', borderRadius: '6px' }}
                  >
                    <option value="grocery">🛒 Fresh Mart Grocery</option>
                    <option value="restaurant">🍕 Bistro 99 Restaurant</option>
                    <option value="automotive">🚗 Apex Auto Garage</option>
                    <option value="retail">📦 TechNova Superstore</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '3px' }}>PIN</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showStaffPin ? "text" : "password"}
                      maxLength={8}
                      required
                      placeholder="Enter PIN"
                      value={staffPinInput}
                      onChange={(e) => setStaffPinInput(e.target.value)}
                      className="form-input mono"
                      style={{
                        fontSize: '18px',
                        letterSpacing: showStaffPin ? '2px' : '6px',
                        textAlign: 'center',
                        padding: '6px 36px 6px 12px',
                        height: '40px',
                        fontWeight: '800',
                        borderRadius: '6px'
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPin(!showStaffPin)}
                      style={{ position: 'absolute', right: '10px', top: '11px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title={showStaffPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showStaffPin ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ padding: '6px 8px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '6px', color: '#f43f5e', fontSize: '11.5px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Touch Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '8px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Cancel and switch back to Admin"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    style={{
                      padding: '8px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '8px 0',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Backspace"
                  >
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>⌫</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '9px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '9px', fontSize: '12.5px', fontWeight: '700', backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
                  >
                    <UserCheck size={14} /> Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* STEP 2: MINIMAL WORKSPACE SELECTOR */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '12px', fontWeight: '700' }}>
                <CheckCircle2 size={14} /> Admin Unlocked
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                Select Store
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '8px'
            }}>
              {businessCards.map((biz) => {
                const Icon = biz.icon;

                return (
                  <div
                    key={biz.id}
                    onClick={() => handleLaunchBusiness(biz.id)}
                    className="glass-panel card-hover"
                    style={{
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      cursor: 'pointer',
                      border: `1px solid var(--border-color)`,
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-input)',
                        color: biz.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} />
                      </div>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-input)', color: biz.color, fontSize: '9px', padding: '1px 5px' }}>
                        {biz.badge}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {biz.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: biz.color, fontWeight: '700', fontSize: '11px', marginTop: 'auto' }}>
                      <span>Launch</span>
                      <ArrowRight size={11} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action: Manage Staff Credentials */}
            <button
              onClick={() => {
                login(adminPin);
                if (onOpenStaff) onOpenStaff();
              }}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '13px',
                fontWeight: '700',
                gap: '8px',
                color: '#10b981',
                borderColor: 'rgba(16,185,129,0.3)',
                backgroundColor: 'rgba(16,185,129,0.06)',
                borderRadius: '10px'
              }}
              title="Add Employees, Assign Passwords & Track Shifts"
            >
              <Users size={16} color="#10b981" /> 👥 Manage Staff Accounts & Set PINs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
