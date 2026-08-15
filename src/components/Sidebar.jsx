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
  ArrowRightLeft,
  KeyRound,
  UserCheck
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
    currentUser,
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
      { id: 'jobs', label: 'Service Job Cards', icon: Wrench, badge: activeJobsCount > 0 ? `${activeJobsCount}` : null }
    ] : []),

    { id: 'products', label: 'Inventory & Items', icon: Package },
    { id: 'quotations', label: 'Quotations & Estimates', icon: FileCheck },
    { id: 'invoices', label: 'Invoice Records', icon: FileText },
    { id: 'returns', label: 'Returns & Credit Notes', icon: RotateCcw },
    { id: 'shift', label: 'Cash Shift & Z-Report', icon: Banknote },
    { id: 'staff', label: 'Staff & Shift Reports', icon: UserCheck },
    { id: 'expenses', label: 'Expense Tracker', icon: DollarSign },
    { id: 'customers', label: 'Customer Ledger', icon: Users },
    { id: 'barcode', label: 'Barcode Generator', icon: Barcode },
    { id: 'reports', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const getBusinessColor = () => {
    if (activeBusinessId === 'grocery') return '#0c831f';
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
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: '#0c831f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(12, 131, 31, 0.3)'
            }}>
              <Receipt size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  SwiftBill
                </h1>
                <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 5px' }}>
                  v2.0
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                Offline POS System
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={toggleTheme}
              className="btn-icon"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: theme === 'dark' ? '#fbbf24' : '#3b82f6'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              onClick={onClose}
              className="btn-icon"
              style={{ display: isOpen ? 'flex' : 'none', padding: '6px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ACTIVE WORKSPACE CARD */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                Active Store
              </div>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--text-main)',
                margin: '2px 0 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {settings.storeName}
              </h3>
            </div>

            <button
              onClick={() => {
                onOpenSwitchBusiness();
                if (onClose) onClose();
              }}
              className="btn btn-secondary"
              style={{
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: '600',
                height: '28px',
                gap: '4px'
              }}
              title="Switch Business Workspace"
            >
              <ArrowRightLeft size={12} color={bizColor} /> Switch
            </button>
          </div>

          {/* Logged-In User / Staff Session Indicator */}
          <div style={{
            marginTop: '8px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: currentUser?.role === 'Master Admin' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
            border: `1px solid ${currentUser?.role === 'Master Admin' ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: currentUser?.role === 'Master Admin' ? '#10b981' : '#3b82f6',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '800'
              }}>
                {(currentUser?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'Master Admin'}
                </div>
                <div style={{ fontSize: '9.5px', color: currentUser?.role === 'Master Admin' ? '#10b981' : '#3b82f6', fontWeight: '700' }}>
                  {currentUser?.role || 'Staff'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '4px',
                textDecoration: 'underline'
              }}
              title="End Shift / Switch Cashier"
            >
              Switch
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '8px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
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
                  background: isActive ? 'var(--instamart-green-light)' : 'transparent',
                  color: isActive ? 'var(--instamart-green)' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  borderLeft: isActive ? '3px solid var(--instamart-green)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} color={isActive ? 'var(--instamart-green)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? 'rgba(12,131,31,0.2)' : 'var(--bg-input)',
                    color: isActive ? 'var(--instamart-green)' : 'var(--text-dim)',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Quick PIN Change & Admin Lock */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleNavClick('settings')}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '11px', padding: '6px 8px', height: '30px', fontWeight: '600', gap: '4px' }}
              title="Change Admin PIN / Password"
            >
              <KeyRound size={13} color="#10b981" />
              Change PIN
            </button>

            <button
              onClick={exportDataJSON}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '11px', padding: '6px 8px', height: '30px', fontWeight: '600', gap: '4px' }}
              title="Export JSON Backup"
            >
              <HardDriveDownload size={13} />
              JSON Backup
            </button>
          </div>

          <button
            onClick={logout}
            className="btn btn-danger"
            style={{ width: '100%', fontSize: '11.5px', padding: '6px 10px', height: '30px', fontWeight: '600', gap: '4px' }}
            title="Lock Admin Session"
          >
            <LogOut size={13} />
            Lock Admin Session
          </button>
        </div>
      </aside>
    </>
  );
}
