import React, { useState, useEffect } from 'react';
import { Utensils, CheckCircle2, Clock, Flame, AlertCircle } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function KitchenDisplayBoard() {
  const { kitchenOrders, updateKOTStatus } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeOrders = kitchenOrders.filter((k) => k.status !== 'Served');

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '22px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '10px' : '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-warning">Live KDS</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Kitchen Orders (KOT)
            </h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live ticket board for kitchen staff. Mark orders as Preparing, Ready, or Served.
          </p>
        </div>

        <span className="badge badge-info" style={{ fontSize: '12px', padding: '6px 12px', alignSelf: isMobile ? 'flex-start' : 'center' }}>
          {activeOrders.length} Active Orders
        </span>
      </div>

      {/* Orders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px',
        alignContent: 'start'
      }}>
        {activeOrders.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Utensils size={40} opacity={0.3} style={{ margin: '0 auto 8px auto' }} />
            <p style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>All orders served!</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>New food orders from POS counter will appear here.</p>
          </div>
        ) : (
          activeOrders.map((kot) => {
            const isReady = kot.status === 'Ready to Serve';

            return (
              <div
                key={kot.id}
                className="glass-panel"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  border: isReady ? '2px solid #10b981' : '1px solid var(--border-color)',
                  backgroundColor: isReady ? 'rgba(16,185,129,0.06)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {kot.id}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#10b981', marginTop: '2px', margin: 0 }}>
                      {kot.tableNo}
                    </h3>
                  </div>

                  <span className={`badge badge-${isReady ? 'success' : 'warning'}`}>
                    {kot.status}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  Ordered: {new Date(kot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({kot.orderType})
                </div>

                {/* Item List */}
                <div style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {kot.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {item.name}
                      </span>
                      <span className="mono" style={{ fontWeight: '800', color: '#10b981' }}>
                        x{item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '4px' }}>
                  {kot.status === 'Preparing' ? (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Ready to Serve')}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                    >
                      <Flame size={14} /> Mark Ready
                    </button>
                  ) : (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Served')}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '8px', fontSize: '12px', color: '#10b981' }}
                    >
                      <CheckCircle2 size={14} /> Mark Served
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
