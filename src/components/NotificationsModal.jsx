import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  Clock, 
  Users, 
  Pause, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function NotificationsModal({ isOpen, onClose, onNavigate }) {
  const { 
    products, 
    customers, 
    restaurantTables, 
    heldCarts, 
    settings 
  } = useBilling();

  if (!isOpen) return null;

  // Calculate alerts
  const lowStockProducts = products.filter(p => p.stock <= (p.minStockAlert || 5));
  const longDiningTables = (restaurantTables || []).filter(t => {
    if (t.status !== 'occupied' || !t.seatedAt) return false;
    const diffMins = (Date.now() - new Date(t.seatedAt).getTime()) / 60000;
    return diffMins > 30;
  });
  const highPendingCustomers = customers.filter(c => (c.balance || 0) > 1000);
  const activeHeldCarts = heldCarts || [];

  const totalAlertsCount = lowStockProducts.length + longDiningTables.length + highPendingCustomers.length + activeHeldCarts.length;

  return (
    <div className="modal-overlay" style={{ zIndex: 99999, padding: '12px' }} onClick={onClose}>
      <div 
        className="modal-container" 
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '22px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Operational Alerts & Notifications ({totalAlertsCount})
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Real-time inventory alerts, dining timers & credit balances
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        {totalAlertsCount === 0 ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={44} color="#10b981" />
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>All Systems Nominal!</p>
            <span style={{ fontSize: '12px' }}>Inventory stock levels, dining tables, and customer credit balances are all clear.</span>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
            
            {/* 1. Low Stock Products */}
            {lowStockProducts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertTriangle size={14} /> Low Stock Threshold Alerts ({lowStockProducts.length})
                </div>

                {lowStockProducts.map((p) => (
                  <div key={p.id} style={{
                    padding: '10px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700' }}>
                        Remaining Stock: {p.stock} {p.unit} (Min alert: {p.minStockAlert || 5})
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('products');
                        onClose();
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '700', height: '28px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      Reorder ➔
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Long Dining Timers */}
            {longDiningTables.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} /> Long Dining Session Alerts ({longDiningTables.length})
                </div>

                {longDiningTables.map((t) => (
                  <div key={t.id} style={{
                    padding: '10px 12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {t.name} • Dining ({Math.floor((Date.now() - new Date(t.seatedAt).getTime()) / 60000)} mins)
                      </div>
                      <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                        {t.currentItems?.length || 0} active dishes at table
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('floorplan');
                        onClose();
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '700', height: '28px', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                    >
                      View Table ➔
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 3. High Pending Credit / Udhar */}
            {highPendingCustomers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Users size={14} /> High Pending Credit Ledgers ({highPendingCustomers.length})
                </div>

                {highPendingCustomers.map((c) => (
                  <div key={c.id} style={{
                    padding: '10px 12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                        👤 {c.name} ({c.phone})
                      </div>
                      <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>
                        Outstanding Balance: {settings.currency}{(c.balance || 0).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('customers');
                        onClose();
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '700', height: '28px', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}
                    >
                      Collect Udhar ➔
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Active Held Carts */}
            {activeHeldCarts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Pause size={14} /> Paused Customer Carts ({activeHeldCarts.length})
                </div>

                {activeHeldCarts.map((h) => (
                  <div key={h.id} style={{
                    padding: '10px 12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                        👤 {h.customer?.name} {h.note ? `(${h.note})` : ''}
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981' }}>
                        {h.itemCount} items • {settings.currency}{h.grandTotal}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('pos');
                        onClose();
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '700', height: '28px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                    >
                      Resume Cart ➔
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '9px', fontSize: '13px', fontWeight: '700', marginTop: '4px' }}
        >
          Close Operational Alerts
        </button>
      </div>
    </div>
  );
}
