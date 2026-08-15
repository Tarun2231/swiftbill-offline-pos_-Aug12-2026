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
  Store,
  CheckCircle2,
  X
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function AdminPortal() {
  const { 
    login, 
    staffLogin, 
    adminPin, 
    staffMembers, 
    businesses, 
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
      setErrorMessage('Please enter your Master PIN.');
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
      setErrorMessage('Please select an employee account.');
      return;
    }
    if (!staffPinInput.trim()) {
      setErrorMessage('Please enter employee PIN.');
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
    {
      id: 'grocery',
      title: 'Fresh Mart Grocery',
      subtitle: 'Produce, Staples, Poultry & Weight Billing',
      badge: 'Produce',
      color: '#10b981',
      icon: ShoppingBag
    },
    {
      id: 'automotive',
      title: 'Apex Auto Detailing',
      subtitle: 'Vehicle Detailing, Garage & Parts',
      badge: 'Garage',
      color: '#3b82f6',
      icon: Car
    },
    {
      id: 'restaurant',
      title: 'Bistro 99 Dining',
      subtitle: 'Table Floorplan, KDS & Restaurant POS',
      badge: 'Dining',
      color: '#f59e0b',
      icon: Utensils
    },
    {
      id: 'retail',
      title: 'TechNova Superstore',
      subtitle: 'Electronics, Barcode Labels & Retail',
      badge: 'Retail',
      color: '#8b5cf6',
      icon: Package
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'center',
      padding: isMobile ? '20px 14px 40px 14px' : '40px 20px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Theme Toggle Top Right */}
      <div style={{
        position: isMobile ? 'static' : 'absolute',
        top: '24px',
        right: '24px',
        marginBottom: isMobile ? '16px' : '0',
        alignSelf: isMobile ? 'flex-end' : 'auto'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '7px 12px',
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
            transition: 'all 0.15s ease'
          }}
          title="Toggle Day/Night Theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div style={{ width: '100%', maxWidth: unlocked ? '880px' : '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
        {/* Minimalist Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0c831f 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(12, 131, 31, 0.3)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.4px', margin: '2px 0 0 0' }}>
            SwiftBill
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Offline POS & Multi-User Shift Terminal
          </p>
        </div>

        {/* STEP 1: AUTHENTICATION CARD */}
        {!unlocked ? (
          <div className="glass-panel" style={{
            width: '100%',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)'
          }}>
            
            {/* Minimalist Segmented Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '3px',
              borderRadius: '10px',
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
                  padding: '8px',
                  borderRadius: '8px',
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
                  boxShadow: loginMode === 'admin' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
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
                  borderRadius: '8px',
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
                  boxShadow: loginMode === 'staff' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Users size={14} color="#3b82f6" /> Staff Login
              </button>
            </div>

            {/* A. MASTER ADMIN LOGIN FORM */}
            {loginMode === 'admin' ? (
              <form onSubmit={handleAdminPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px', textAlign: 'center', marginBottom: '8px' }}>
                    Enter Master PIN
                  </label>
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
                        letterSpacing: showAdminPin ? '2px' : '10px',
                        textAlign: 'center',
                        padding: '8px 40px 8px 12px',
                        height: '46px',
                        fontWeight: '800',
                        borderRadius: '10px'
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPin(!showAdminPin)}
                      style={{ position: 'absolute', right: '12px', top: '13px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title={showAdminPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showAdminPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '8px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Minimalist Touch Numeric Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '2px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '11px',
                        fontSize: '18px',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.12s ease'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  
                  {/* Cancel Button (Replaced Clear) */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '11px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
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
                      padding: '11px',
                      fontSize: '18px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  {/* Backspace */}
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '11px',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Backspace"
                  >
                    <span style={{ fontSize: '17px', fontWeight: 'bold' }}>⌫</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '11px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-muted)',
                      borderRadius: '10px'
                    }}
                    title="Cancel entry"
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
                      borderRadius: '10px'
                    }}
                  >
                    <Lock size={15} /> Unlock Admin
                  </button>
                </div>
              </form>
            ) : (
              /* B. EMPLOYEE / CASHIER LOGIN FORM */
              <form onSubmit={handleStaffLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>
                    Select Employee Account
                  </label>
                  <select
                    value={selectedStaffUser}
                    onChange={(e) => setSelectedStaffUser(e.target.value)}
                    className="form-select"
                    style={{ height: '40px', minHeight: '40px', fontSize: '13px', borderRadius: '8px' }}
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
                    Assigned Store
                  </label>
                  <select
                    value={selectedBizForStaff}
                    onChange={(e) => setSelectedBizForStaff(e.target.value)}
                    className="form-select"
                    style={{ height: '40px', minHeight: '40px', fontSize: '13px', borderRadius: '8px' }}
                  >
                    <option value="grocery">🛒 Fresh Mart Grocery & Produce</option>
                    <option value="restaurant">🍕 Bistro 99 Cafe & Restaurant</option>
                    <option value="automotive">🚗 Apex Auto Detailing & Garage</option>
                    <option value="retail">📦 TechNova Retail Superstore</option>
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
                      required
                      placeholder="••••"
                      value={staffPinInput}
                      onChange={(e) => setStaffPinInput(e.target.value)}
                      className="form-input mono"
                      style={{
                        fontSize: '20px',
                        letterSpacing: showStaffPin ? '2px' : '8px',
                        textAlign: 'center',
                        padding: '8px 40px 8px 12px',
                        height: '44px',
                        fontWeight: '800',
                        borderRadius: '8px'
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPin(!showStaffPin)}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title={showStaffPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showStaffPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '8px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Touch Numeric Keypad for Staff PIN */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '2px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '11px',
                        fontSize: '18px',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
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
                      padding: '11px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
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
                      padding: '11px',
                      fontSize: '18px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '11px',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Backspace"
                  >
                    <span style={{ fontSize: '17px', fontWeight: 'bold' }}>⌫</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '11px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-muted)',
                      borderRadius: '10px'
                    }}
                    title="Cancel and return to Master Admin"
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
                      borderRadius: '10px'
                    }}
                  >
                    <UserCheck size={16} /> Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* STEP 2: MINIMALIST WORKSPACE SELECTOR (FOR ADMIN) */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                <CheckCircle2 size={15} /> Admin Unlocked
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Select Store Workspace
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
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
                      padding: '18px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      cursor: 'pointer',
                      border: `1px solid var(--border-color)`,
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-card)'
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
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} />
                      </div>

                      <span className="badge" style={{ backgroundColor: 'var(--bg-input)', color: biz.color, border: `1px solid ${biz.color}`, fontSize: '9.5px', padding: '2px 6px' }}>
                        {biz.badge}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                        {biz.title}
                      </h3>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3', margin: '2px 0 0 0' }}>
                        {biz.subtitle}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: biz.color,
                      fontWeight: '700',
                      fontSize: '12px',
                      marginTop: 'auto',
                      paddingTop: '6px'
                    }}>
                      <span>Launch POS</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
