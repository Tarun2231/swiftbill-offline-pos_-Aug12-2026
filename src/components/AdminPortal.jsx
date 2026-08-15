import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Car, 
  Utensils, 
  Package, 
  KeyRound, 
  Lock, 
  ArrowRight, 
  Sun, 
  Moon, 
  Users, 
  UserCheck, 
  Delete, 
  Eye, 
  EyeOff,
  Sparkles,
  X,
  ArrowLeft
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
    const result = login(pinInput);
    if (result.success) {
      setUnlocked(true);
      setErrorMessage('');
    } else {
      setErrorMessage(result.message);
      setPinInput('');
    }
  };

  // Staff Login Submit
  const handleStaffLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedStaffUser) {
      setErrorMessage('Please select or enter an employee username.');
      return;
    }
    const result = staffLogin(selectedStaffUser, staffPinInput);
    if (result.success) {
      switchBusiness(selectedBizForStaff);
      setErrorMessage('');
    } else {
      setErrorMessage(result.message);
      setStaffPinInput('');
    }
  };

  const handleKeypadPress = (num) => {
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

  const handleLaunchBusiness = (businessId) => {
    switchBusiness(businessId);
    login(adminPin);
  };

  const businessCards = [
    {
      id: 'grocery',
      title: 'Fresh Mart Grocery & Produce',
      subtitle: 'Fruits, Vegetables, Staples, Poultry & Weight Billing',
      badge: 'Weighted Produce',
      color: '#10b981',
      icon: ShoppingBag
    },
    {
      id: 'automotive',
      title: 'Apex Auto Detailing & Garage',
      subtitle: 'Ceramic Coating, Car Wash, Repair Labor & Parts',
      badge: 'Vehicle Service',
      color: '#3b82f6',
      icon: Car
    },
    {
      id: 'restaurant',
      title: 'Bistro 99 Cafe & Restaurant',
      subtitle: 'Table Seating Map, KDS Kitchen Tickets & Dine-in POS',
      badge: 'Table Dining',
      color: '#f59e0b',
      icon: Utensils
    },
    {
      id: 'retail',
      title: 'TechNova Retail Superstore',
      subtitle: 'Electronics, Barcode Labels, Gadgets & Retail',
      badge: 'Barcode Retail',
      color: '#8b5cf6',
      icon: Package
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px 12px' : '36px 20px',
      position: 'relative'
    }}>
      {/* Day / Night Toggle Top Right */}
      <div style={{
        position: isMobile ? 'static' : 'absolute',
        top: '20px',
        right: '24px',
        marginBottom: isMobile ? '12px' : '0',
        alignSelf: isMobile ? 'flex-end' : 'auto'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: theme === 'dark' ? '#fbbf24' : '#3b82f6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Day' : 'Night'}
        </button>
      </div>

      {/* Main Container */}
      <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '16px' : '24px' }}>
        
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: isMobile ? '46px' : '54px',
            height: isMobile ? '46px' : '54px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)'
          }}>
            <ShieldCheck size={isMobile ? 26 : 30} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', margin: '4px 0 0 0' }}>
            SwiftBill POS Suite
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '440px', lineHeight: '1.4', margin: 0 }}>
            Offline POS & Multi-User Shift Management
          </p>
        </div>

        {/* STEP 1: AUTHENTICATION CONTAINER */}
        {!unlocked ? (
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '420px',
            padding: isMobile ? '18px 14px' : '26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            
            {/* Top Bar with Mode Indicator & Back to Admin */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {loginMode === 'admin' ? '🛡️ Master Admin Terminal' : '👤 Employee Shift Sign-In'}
              </span>

              {loginMode === 'staff' ? (
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('admin');
                    setStaffPinInput('');
                    setErrorMessage('');
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '11px', height: '24px', gap: '3px', fontWeight: '600' }}
                  title="Cancel and return to Master Admin Login"
                >
                  <ArrowLeft size={12} /> Back to Admin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPinInput('');
                    setErrorMessage('');
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '11px', height: '24px', gap: '3px', fontWeight: '600' }}
                  title="Clear PIN input"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* LOGIN MODE TABS (ADMIN vs EMPLOYEE) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setErrorMessage('');
                }}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: loginMode === 'admin' ? 'var(--bg-card)' : 'transparent',
                  color: loginMode === 'admin' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: loginMode === 'admin' ? '800' : '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: loginMode === 'admin' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <ShieldCheck size={14} color="#10b981" /> Master Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('staff');
                  setErrorMessage('');
                }}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: loginMode === 'staff' ? 'var(--bg-card)' : 'transparent',
                  color: loginMode === 'staff' ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: loginMode === 'staff' ? '800' : '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: loginMode === 'staff' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Users size={14} color="#3b82f6" /> Staff / Cashier
              </button>
            </div>

            {/* A. MASTER ADMIN LOGIN FORM */}
            {loginMode === 'admin' ? (
              <form onSubmit={handleAdminPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Master Admin Unlock
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Access all settings, staff controls, and revenue reports
                  </span>
                </div>

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
                      padding: '8px 36px 8px 12px',
                      height: '46px',
                      fontWeight: '800'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showAdminPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errorMessage && (
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '6px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Touch Numeric Keypad on Mobile */}
                {isMobile && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleKeypadPress(n.toString())}
                        style={{
                          padding: '10px',
                          fontSize: '18px',
                          fontWeight: '700',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPinInput('')}
                      style={{ padding: '10px', fontSize: '11px', fontWeight: '700', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      style={{ padding: '10px', fontSize: '18px', fontWeight: '700', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleKeypadBackspace}
                      style={{ padding: '10px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Delete size={18} />
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setPinInput('');
                      setErrorMessage('');
                    }}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-muted)'
                    }}
                    title="Clear PIN input"
                  >
                    <X size={14} /> Clear
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '10px', fontSize: '13.5px', fontWeight: '700' }}
                  >
                    <Lock size={15} /> Unlock Admin Portal
                  </button>
                </div>
              </form>
            ) : (
              /* B. EMPLOYEE / CASHIER LOGIN FORM */
              <form onSubmit={handleStaffLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Employee Shift Sign-In
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Your sales & shift metrics will be recorded
                  </span>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Select Employee / Cashier</label>
                  <select
                    value={selectedStaffUser}
                    onChange={(e) => setSelectedStaffUser(e.target.value)}
                    className="form-select"
                    style={{ height: '38px', minHeight: '38px', fontSize: '13px' }}
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.username}>
                        👤 {s.name} ({s.role} - @{s.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Assigned Store Workspace</label>
                  <select
                    value={selectedBizForStaff}
                    onChange={(e) => setSelectedBizForStaff(e.target.value)}
                    className="form-select"
                    style={{ height: '38px', minHeight: '38px', fontSize: '13px' }}
                  >
                    <option value="grocery">🛒 Fresh Mart Grocery & Produce</option>
                    <option value="restaurant">🍕 Bistro 99 Cafe & Restaurant</option>
                    <option value="automotive">🚗 Apex Auto Detailing & Garage</option>
                    <option value="retail">📦 TechNova Retail Superstore</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Employee PIN / Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showStaffPin ? "text" : "password"}
                      maxLength={8}
                      required
                      placeholder="Enter assigned PIN"
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

                {errorMessage && (
                  <div style={{ padding: '8px 10px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '6px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('admin');
                      setStaffPinInput('');
                      setErrorMessage('');
                    }}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-muted)'
                    }}
                    title="Cancel and return to Master Admin page"
                  >
                    <ArrowLeft size={14} /> Back to Admin
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '10px', fontSize: '13.5px', fontWeight: '700', backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
                  >
                    <UserCheck size={16} /> Start Shift & Open POS
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* STEP 2: BUSINESS WORKSPACE HUB (FOR ADMIN) */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-success" style={{ marginBottom: '6px' }}>
                Master Admin Verified
              </span>
              <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Select Business Workspace
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Tap to launch register with full admin privileges.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: isMobile ? '12px' : '16px'
            }}>
              {businessCards.map((biz) => {
                const Icon = biz.icon;

                return (
                  <div
                    key={biz.id}
                    onClick={() => handleLaunchBusiness(biz.id)}
                    className="glass-panel card-hover"
                    style={{
                      padding: isMobile ? '16px' : '24px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      cursor: 'pointer',
                      border: `1.5px solid var(--border-color)`,
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-input)',
                        color: biz.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <Icon size={24} />
                      </div>

                      <span className="badge" style={{ backgroundColor: 'var(--bg-input)', color: biz.color, border: `1px solid ${biz.color}`, fontSize: '10px' }}>
                        {biz.badge}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: isMobile ? '15.5px' : '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        {biz.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                        {biz.subtitle}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: biz.color,
                      fontWeight: '700',
                      fontSize: '13px',
                      marginTop: 'auto',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span>Launch Register</span>
                      <ArrowRight size={15} />
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
