import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Receipt, 
  FileCheck, 
  DollarSign, 
  Barcode, 
  Sun, 
  Moon, 
  HardDriveDownload, 
  RotateCcw, 
  Store, 
  LogOut, 
  Car, 
  Utensils, 
  Flame, 
  Wrench, 
  Banknote, 
  LayoutGrid,
  X,
  ArrowRightLeft
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenSwitchBusiness, isOpen, onClose }) {
  const { 
    settings, 
    theme, 
    toggleTheme, 
    exportDataJSON, 
    activeBusiness, 
    activeBusinessId, 
    kitchenOrders,
    serviceJobs,
    logout 
  } = useBilling();

  const activeKOTCount = (kitchenOrders || []).filter(k => k.status !== 'Served').length;
  const activeJobsCount = (serviceJobs || []).filter(j => j.status !== 'Delivered').length;

  const baseNavItems = [
    { id: 'pos', label: 'POS Billing', icon: ShoppingBag, badge: 'F2' },
    
    // Restaurant Specific Navigation
    ...(activeBusinessId === 'restaurant' ? [
      { id: 'floorplan', label: 'Table Floorplan', icon: LayoutGrid },
      { id: 'kds', label: 'Kitchen Display (KOT)', icon: Flame, badge: activeKOTCount > 0 ? `${activeKOTCount}` : null }
    ] : []),

    // Automotive Specific Navigation
    ...(activeBusinessId === 'automotive' ? [
      { id: 'jobs', label: 'Service Bay Cards', icon: Wrench, badge: activeJobsCount > 0 ? `${activeJobsCount}` : null }
    ] : []),

    { id: 'products', label: 'Inventory & Items', icon: Package },
    { id: 'quotations', label: 'Quotations / Estimates', icon: FileCheck },
    { id: 'invoices', label: 'Invoice Records', icon: FileText },
    { id: 'returns', label: 'Returns & Credit Notes', icon: RotateCcw },
    { id: 'shift', label: 'Cash Shift & Z-Report', icon: Banknote },
    { id: 'expenses', label: 'Expense Tracker', icon: DollarSign },
    { id: 'customers', label: 'Customer Ledger', icon: Users },
    { id: 'barcode', label: 'Barcode Labels', icon: Barcode },
    { id: 'reports', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const getBusinessColor = () => {
    if (activeBusinessId === 'grocery') return '#10b981';
    if (activeBusinessId === 'automotive') return '#3b82f6';
    if (activeBusinessId === 'restaurant') return '#f59e0b';
    return '#8b5cf6';
  };

  const bizColor = getBusinessColor();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Sidebar Drawer Container */}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Receipt size={19} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0, lineHeight: '1.2' }}>
                SwiftBill
              </h1>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px' }}>
                OFFLINE POS SUITE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={toggleTheme}
              className="btn-icon"
              style={{ padding: '6px', color: theme === 'dark' ? '#fbbf24' : '#3b82f6' }}
              title="Toggle Day/Night Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={onClose}
              className="btn-icon"
              style={{ display: isOpen ? 'flex' : 'none' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PROMINENT ACTIVE BUSINESS PROFILE CARD */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            border: `1.5px solid ${bizColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '9.5px',
                fontWeight: '800',
                color: bizColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: bizColor }}></span>
                ACTIVE WORKSPACE
              </span>

              <span className="badge" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-dim)', fontSize: '9px', padding: '1px 5px' }}>
                {activeBusinessId.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                color: bizColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid var(--border-color)'
              }}>
                {activeBusinessId === 'grocery' ? <ShoppingBag size={18} /> : activeBusinessId === 'automotive' ? <Car size={18} /> : activeBusinessId === 'restaurant' ? <Utensils size={18} /> : <Package size={18} />}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{
                  fontSize: '13.5px',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {settings.storeName}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                  {activeBusiness.type}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenSwitchBusiness();
                if (onClose) onClose();
              }}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '11.5px',
                fontWeight: '700',
                gap: '6px',
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <ArrowRightLeft size={13} color={bizColor} /> Switch Workspace
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
          {baseNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive 
                    ? 'linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 100%)' 
                    : 'transparent',
                  color: isActive ? '#10b981' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  borderLeft: isActive ? '3.5px solid #10b981' : '3.5px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} color={isActive ? '#10b981' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-input)',
                    color: isActive ? '#10b981' : 'var(--text-dim)',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Quick Backup & Admin Lock */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            onClick={exportDataJSON}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '12px', padding: '7px 10px' }}
            title="Backup all data to JSON file"
          >
            <HardDriveDownload size={14} />
            JSON Backup
          </button>

          <button
            onClick={logout}
            className="btn btn-danger"
            style={{ width: '100%', fontSize: '12px', padding: '7px 10px' }}
            title="Lock Admin Portal"
          >
            <LogOut size={14} />
            Admin Lock
          </button>
        </div>
      </aside>
    </>
  );
}
