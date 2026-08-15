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
  CheckCircle2,
  Sparkles,
  Store
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
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  const staffList = (staffMembers || []).filter(s => s.active !== false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      setErrorMessage(result.message || 'Invalid Master PIN');
      setPinInput('');
    }
  };

  // Staff Login Submit
  const handleStaffLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedStaffUser) {
      setErrorMessage('Select an employee account');
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
      setErrorMessage(result.message || 'Invalid Employee PIN');
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
    { id: 'grocery', title: 'Fresh Mart Grocery', badge: 'Produce', color: '#10b981', icon: ShoppingBag, desc: 'Produce, weight billing & staples' },
    { id: 'restaurant', title: 'Bistro 99 Dining', badge: 'Dining', color: '#f59e0b', icon: Utensils, desc: 'Floorplan, tables & KDS KOT' },
    { id: 'automotive', title: 'Apex Auto Detailing', badge: 'Garage', color: '#3b82f6', icon: Car, desc: 'Service jobs, repairs & parts' },
    { id: 'retail', title: 'TechNova Superstore', badge: 'Retail', color: '#8b5cf6', icon: Package, desc: 'Electronics & barcode labels' }
  ];

  const currentPinValue = loginMode === 'admin' ? pinInput : staffPinInput;
  const pinLength = currentPinValue.length;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'center',
      padding: isMobile ? '24px 14px 40px 14px' : '40px 20px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Top Header Controls (Theme Toggle) */}
      <div style={{
        position: isMobile ? 'static' : 'absolute',
        top: '20px',
        right: '24px',
        marginBottom: isMobile ? '16px' : '0',
        alignSelf: isMobile ? 'flex-end' : 'auto'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: theme === 'dark' ? '#fbbf24' : '#3b82f6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          title="Toggle Day / Night Mode"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Day' : 'Night'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div style={{ width: '100%', maxWidth: unlocked ? '740px' : '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0c831f 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(12, 131, 31, 0.28)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.4px', margin: 0 }}>
              SwiftBill
            </h1>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(12, 131, 31, 0.12)',
              color: 'var(--instamart-green)',
              fontWeight: '800',
              textTransform: 'uppercase'
            }}>
              POS Terminal
            </span>
          </div>
        </div>

        {/* STEP 1: AUTHENTICATION CARD */}
        {!unlocked ? (
          <div className="glass-panel" style={{
            width: '100%',
            padding: isMobile ? '20px 16px' : '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderRadius: '18px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            boxSizing: 'border-box'
          }}>
            
            {/* Segmented Mode Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setErrorMessage('');
                  setPinInput('');
                }}
                style={{
                  padding: '8px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: loginMode === 'admin' ? 'var(--bg-card)' : 'transparent',
                  color: loginMode === 'admin' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: loginMode === 'admin' ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: loginMode === 'admin' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShieldCheck size={14} color="#10b981" /> Master Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('staff');
                  setErrorMessage('');
                  setStaffPinInput('');
                }}
                style={{
                  padding: '8px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: loginMode === 'staff' ? 'var(--bg-card)' : 'transparent',
                  color: loginMode === 'staff' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: loginMode === 'staff' ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: loginMode === 'staff' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Users size={14} color="#3b82f6" /> Staff Sign-In
              </button>
            </div>

            {/* A. MASTER ADMIN FORM */}
            {loginMode === 'admin' ? (
              <form onSubmit={handleAdminPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* PIN Display & Input Box */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Enter Master PIN
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAdminPin(!showAdminPin)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                    >
                      {showAdminPin ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{showAdminPin ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={showAdminPin ? "text" : "password"}
                      maxLength={8}
                      placeholder="••••"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="form-input mono"
                      style={{
                        fontSize: '22px',
                        letterSpacing: showAdminPin ? '3px' : '10px',
                        textAlign: 'center',
                        padding: '8px 12px',
                        height: '46px',
                        fontWeight: '800',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-input)'
                      }}
                      autoFocus
                    />
                  </div>

                  {/* PIN Dots Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                    {[0, 1, 2, 3].map((idx) => {
                      const isFilled = pinLength > idx;
                      return (
                        <div
                          key={idx}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: isFilled ? '#10b981' : 'var(--border-color)',
                            transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '8px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Sleek Touch Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '2px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '12px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease, background 0.1s ease'
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
                      padding: '12px 0',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease'
                    }}
                    title="Cancel and reset PIN"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    style={{
                      padding: '12px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '12px 0',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Backspace"
                  >
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>⌫</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '11px',
                      fontSize: '13px',
                      fontWeight: '600',
                      borderRadius: '12px',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      flex: 2,
                      padding: '11px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      borderRadius: '12px'
                    }}
                  >
                    <Lock size={15} /> Unlock Admin
                  </button>
                </div>
              </form>
            ) : (
              /* B. STAFF LOGIN FORM */
              <form onSubmit={handleStaffLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Select Employee Account
                  </label>
                  <select
                    value={selectedStaffUser}
                    onChange={(e) => setSelectedStaffUser(e.target.value)}
                    className="form-select"
                    style={{ height: '40px', minHeight: '40px', fontSize: '13px', borderRadius: '10px' }}
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.username}>
                        👤 {s.name} ({s.role} - @{s.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Assigned Store Workspace
                  </label>
                  <select
                    value={selectedBizForStaff}
                    onChange={(e) => setSelectedBizForStaff(e.target.value)}
                    className="form-select"
                    style={{ height: '40px', minHeight: '40px', fontSize: '13px', borderRadius: '10px' }}
                  >
                    <option value="grocery">🛒 Fresh Mart Grocery & Produce</option>
                    <option value="restaurant">🍕 Bistro 99 Cafe & Restaurant</option>
                    <option value="automotive">🚗 Apex Auto Detailing & Garage</option>
                    <option value="retail">📦 TechNova Retail Superstore</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                      Employee PIN / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowStaffPin(!showStaffPin)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                    >
                      {showStaffPin ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{showStaffPin ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={showStaffPin ? "text" : "password"}
                      maxLength={8}
                      required
                      placeholder="••••"
                      value={staffPinInput}
                      onChange={(e) => setStaffPinInput(e.target.value)}
                      className="form-input mono"
                      style={{
                        fontSize: '20px',
                        letterSpacing: showStaffPin ? '3px' : '8px',
                        textAlign: 'center',
                        padding: '8px 12px',
                        height: '42px',
                        fontWeight: '800',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-input)'
                      }}
                      autoFocus
                    />
                  </div>

                  {/* PIN Dots Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                    {[0, 1, 2, 3].map((idx) => {
                      const isFilled = staffPinInput.length > idx;
                      return (
                        <div
                          key={idx}
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: isFilled ? '#3b82f6' : 'var(--border-color)',
                            transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '8px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Touch Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '2px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '11px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
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
                      padding: '11px 0',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
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
                      padding: '11px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '11px 0',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Backspace"
                  >
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>⌫</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '11px',
                      fontSize: '13px',
                      fontWeight: '600',
                      borderRadius: '12px',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      flex: 2,
                      padding: '11px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      backgroundColor: '#3b82f6',
                      borderColor: '#3b82f6',
                      borderRadius: '12px'
                    }}
                  >
                    <UserCheck size={16} /> Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* STEP 2: STORE WORKSPACE SELECTION (FOR ADMIN) */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: '700' }}>
                <CheckCircle2 size={15} /> Master Admin Verified
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0 0 0' }}>
                Select Store Workspace
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {businessCards.map((biz) => {
                const Icon = biz.icon;

                return (
                  <div
                    key={biz.id}
                    onClick={() => handleLaunchBusiness(biz.id)}
                    className="glass-panel card-hover"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      cursor: 'pointer',
                      border: `1.5px solid var(--border-color)`,
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-card)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-input)',
                        color: biz.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <Icon size={20} />
                      </div>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-input)', color: biz.color, border: `1px solid ${biz.color}`, fontSize: '10px', padding: '2px 7px' }}>
                        {biz.badge}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {biz.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {biz.desc}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: biz.color,
                      fontWeight: '700',
                      fontSize: '12.5px',
                      marginTop: 'auto',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span>Launch Store Register</span>
                      <ArrowRight size={14} />
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
                padding: '12px',
                fontSize: '13px',
                fontWeight: '700',
                gap: '8px',
                color: '#10b981',
                borderColor: 'rgba(16,185,129,0.3)',
                backgroundColor: 'rgba(16,185,129,0.08)',
                borderRadius: '12px'
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
