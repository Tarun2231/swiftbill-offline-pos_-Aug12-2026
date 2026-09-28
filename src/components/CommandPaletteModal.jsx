import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  RotateCcw, 
  Flame, 
  Wrench, 
  Banknote, 
  LayoutGrid, 
  DollarSign, 
  Barcode, 
  FileCheck, 
  Store, 
  ArrowRight, 
  X, 
  Zap, 
  Plus, 
  UserCheck 
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function CommandPaletteModal({ isOpen, onClose, onNavigate }) {
  const { 
    products, 
    customers, 
    businesses, 
    activeBusinessId, 
    switchBusiness, 
    settings 
  } = useBilling();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const navigationItems = [
    { id: 'pos', title: 'POS Billing & Counter', category: 'Pages', icon: ShoppingBag, shortcut: 'F2' },
    { id: 'floorplan', title: 'Table Floorplan & Seating', category: 'Pages', icon: LayoutGrid },
    { id: 'kds', title: 'Kitchen Display Board (KOT)', category: 'Pages', icon: Flame },
    { id: 'jobs', title: 'Vehicle Service Job Cards', category: 'Pages', icon: Wrench },
    { id: 'products', title: 'Inventory & Item Catalog', category: 'Pages', icon: Package },
    { id: 'quotations', title: 'Quotations & Estimates', category: 'Pages', icon: FileCheck },
    { id: 'invoices', title: 'Invoice Records & History', category: 'Pages', icon: FileText },
    { id: 'returns', title: 'Sales Returns & Credit Notes', category: 'Pages', icon: RotateCcw },
    { id: 'shift', title: 'Cash Shift Register & Z-Report', category: 'Pages', icon: Banknote },
    { id: 'customers', title: 'Customer Ledger & Udhar Balance', category: 'Pages', icon: Users },
    { id: 'expenses', title: 'Business Expense Tracker', category: 'Pages', icon: DollarSign },
    { id: 'staff', title: 'Staff Accounts & Shift PINs', category: 'Pages', icon: UserCheck },
    { id: 'barcode', title: 'Barcode & Sticker Generator', category: 'Pages', icon: Barcode },
    { id: 'reports', title: 'Sales & Revenue Analytics', category: 'Pages', icon: BarChart3 },
    { id: 'settings', title: 'Store Configuration & Backup', category: 'Pages', icon: Settings }
  ];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return navigationItems.slice(0, 8);
    }

    const matchedNav = navigationItems.filter(item => 
      item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );

    const matchedProducts = products.filter(p => 
      p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q))
    ).slice(0, 5).map(p => ({
      id: `prod_${p.id}`,
      title: `${p.name} (SKU: ${p.sku || 'N/A'}) - ${settings.currency}${p.price}`,
      category: 'Inventory Items',
      icon: Package,
      action: () => {
        onNavigate('pos');
        onClose();
      }
    }));

    const matchedCustomers = customers.filter(c => 
      c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))
    ).slice(0, 4).map(c => ({
      id: `cust_${c.id}`,
      title: `${c.name} (${c.phone !== '-' ? c.phone : 'No Phone'})`,
      category: 'Customers',
      icon: Users,
      action: () => {
        onNavigate('customers');
        onClose();
      }
    }));

    const matchedWorkspaces = Object.values(businesses).filter(b => 
      b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)
    ).map(b => ({
      id: `biz_${b.id}`,
      title: `Switch Workspace to: ${b.name}`,
      category: 'Workspaces',
      icon: Store,
      action: () => {
        switchBusiness(b.id);
        onNavigate('pos');
        onClose();
      }
    }));

    return [...matchedNav, ...matchedProducts, ...matchedCustomers, ...matchedWorkspaces];
  }, [query, products, customers, businesses, settings]);

  const handleSelect = (item) => {
    if (item.action) {
      item.action();
    } else {
      onNavigate(item.id);
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 99999, padding: '12px' }} onClick={onClose}>
      <div 
        className="modal-container" 
        style={{
          maxWidth: '580px',
          width: '100%',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-input)'
        }}>
          <Search size={20} color="var(--instamart-green)" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, page name, SKU, or customer phone... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '15px',
              fontWeight: '600'
            }}
          />
          <span className="mono" style={{
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-dim)',
            border: '1px solid var(--border-color)'
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
              No commands, products, or pages matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon || Zap;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'transparent',
                    color: isSelected ? 'var(--instamart-green)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.1s ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--instamart-green)' : 'var(--bg-input)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: isSelected ? '800' : '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '10.5px', color: isSelected ? 'var(--instamart-green)' : 'var(--text-dim)' }}>
                        {item.category || 'Command'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {item.shortcut && (
                      <span className="mono" style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-input)', color: 'var(--text-dim)' }}>
                        {item.shortcut}
                      </span>
                    )}
                    {isSelected && <ArrowRight size={14} color="var(--instamart-green)" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-dim)'
        }}>
          <span>Use <strong style={{ color: 'var(--text-main)' }}>↑ ↓</strong> to navigate</span>
          <span>Press <strong style={{ color: 'var(--text-main)' }}>Enter</strong> to select</span>
        </div>
      </div>
    </div>
  );
}
