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
  Sparkles,
  Delete
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function AdminPortal() {
  const { login, businesses, switchBusiness, theme, toggleTheme } = useBilling();

  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePinSubmit = (e) => {
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

  const handleKeypadPress = (num) => {
    if (pinInput.length < 6) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      if (nextPin.length === 4 && nextPin === '1234') {
        const result = login(nextPin);
        if (result.success) {
          setUnlocked(true);
          setErrorMessage('');
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleLaunchBusiness = (businessId) => {
    switchBusiness(businessId);
    login('1234');
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
      padding: isMobile ? '20px 14px' : '40px 24px',
      position: 'relative'
    }}>
      {/* Day / Night Toggle Top Right */}
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
      <div style={{ width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '20px' : '28px' }}>
        
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)',
            marginBottom: '2px'
          }}>
            <ShieldCheck size={isMobile ? 28 : 34} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: isMobile ? '22px' : '30px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 }}>
            SwiftBill POS Suite
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '480px', lineHeight: '1.4', margin: 0 }}>
            Offline Billing, Multi-Business Workspace Hub & Point-of-Sale.
          </p>
        </div>

        {/* STEP 1: PIN UNLOCK SCREEN */}
        {!unlocked ? (
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '380px',
            padding: isMobile ? '20px 16px' : '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16,185,129,0.12)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                <KeyRound size={20} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Enter Admin PIN
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Default Master PIN: <strong style={{ color: '#10b981' }}>1234</strong>
              </p>
            </div>

            <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••"
                  readOnly={isMobile}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="form-input mono"
                  style={{
                    fontSize: '24px',
                    letterSpacing: '10px',
                    textAlign: 'center',
                    padding: '8px',
                    height: '48px',
                    fontWeight: '800'
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ padding: '8px 12px', backgroundColor: 'rgba(244,63,94,0.12)', borderRadius: '6px', color: '#f43f5e', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                  {errorMessage}
                </div>
              )}

              {/* Touch Numeric Keypad on Mobile */}
              {isMobile && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleKeypadPress(n.toString())}
                      style={{
                        padding: '12px',
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
                    style={{
                      padding: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    style={{
                      padding: '12px',
                      fontSize: '18px',
                      fontWeight: '700',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Delete size={18} />
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '700', marginTop: '4px' }}
              >
                <Lock size={16} /> Unlock Workspaces
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: BUSINESS WORKSPACE HUB */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-success" style={{ marginBottom: '6px' }}>
                Admin Verified
              </span>
              <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Select Business Workspace
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Tap to open the POS billing register for your store.
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
