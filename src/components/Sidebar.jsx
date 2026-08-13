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
    { id: 'pos', label: 'POS', icon: ShoppingBag, badge: 'F2' },
    
    // Restaurant Specific Navigation
    ...(activeBusinessId === 'restaurant' ? [
      { id: 'floorplan', label: 'Floor', icon: LayoutGrid },
      { id: 'kds', label: 'KDS', icon: Flame, badge: activeKOTCount > 0 ? `${activeKOTCount}` : null }
    ] : []),

    // Automotive Specific Navigation
    ...(activeBusinessId === 'automotive' ? [
      { id: 'jobs', label: 'Service', icon: Wrench, badge: activeJobsCount > 0 ? `${activeJobsCount}` : null }
    ] : []),

    { id: 'products', label: 'Items', icon: Package },
    { id: 'quotations', label: 'Estimates', icon: FileCheck },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'shift', label: 'Shift', icon: Banknote },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'customers', label: 'Ledger', icon: Users },
    { id: 'barcode', label: 'Barcode', icon: Barcode },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
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
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#0c831f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(12, 131, 31, 0.3)'
            }}>
              <Receipt size={16} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <h1 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  SwiftBill
                </h1>
                <span className="badge badge-success" style={{ fontSize: '8.5px', padding: '1px 4px' }}>
                  v2
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={toggleTheme}
              className="btn-icon"
              style={{
                padding: '5px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: theme === 'dark' ? '#fbbf24' : '#3b82f6'
              }}
              title="Theme"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            <button
              onClick={onClose}
              className="btn-icon"
              style={{ display: isOpen ? 'flex' : 'none', padding: '5px' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ACTIVE WORKSPACE CARD */}
        <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-main)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {settings.storeName}
              </h3>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                {activeBusinessId}
              </span>
            </div>

            <button
              onClick={() => {
                onOpenSwitchBusiness();
                if (onClose) onClose();
              }}
              className="btn btn-secondary"
              style={{
                padding: '4px 8px',
                fontSize: '10.5px',
                height: '24px',
                gap: '4px'
              }}
              title="Switch Store"
            >
              <ArrowRightLeft size={10} color={bizColor} /> Switch
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '6px 6px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
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
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: isActive ? 'var(--instamart-green-light)' : 'transparent',
                  color: isActive ? 'var(--instamart-green)' : 'var(--text-muted)',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  borderLeft: isActive ? '3px solid var(--instamart-green)' : '3px solid transparent',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={15} color={isActive ? 'var(--instamart-green)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '9.5px',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    backgroundColor: isActive ? 'rgba(12,131,31,0.2)' : 'var(--bg-input)',
                    color: isActive ? 'var(--instamart-green)' : 'var(--text-dim)',
                    fontWeight: '600'
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
          padding: '8px 10px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          display: 'flex',
          gap: '6px'
        }}>
          <button
            onClick={exportDataJSON}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '11px', padding: '6px 8px', height: '28px' }}
            title="Backup data"
          >
            <HardDriveDownload size={12} />
            Backup
          </button>

          <button
            onClick={logout}
            className="btn btn-danger"
            style={{ flex: 1, fontSize: '11px', padding: '6px 8px', height: '28px' }}
            title="Lock"
          >
            <LogOut size={12} />
            Lock
          </button>
        </div>
      </aside>
    </>
  );
}
