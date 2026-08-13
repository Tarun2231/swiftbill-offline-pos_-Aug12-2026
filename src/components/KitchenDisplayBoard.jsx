import React, { useState, useEffect } from 'react';
import { Utensils, CheckCircle2, Clock, Flame, Timer } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function KitchenDisplayBoard() {
  const { kitchenOrders, updateKOTStatus } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [nowTime, setNowTime] = useState(Date.now());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time tick every 30 seconds for live order timer badges
  useEffect(() => {
    const interval = setInterval(() => setNowTime(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = (kitchenOrders || []).filter((k) => k.status !== 'Served');

  const getElapsedMins = (isoString) => {
    if (!isoString) return 0;
    const diffMs = nowTime - new Date(isoString).getTime();
    return Math.max(1, Math.floor(diffMs / 60000));
  };

  return (
    <div style={{
      padding: isMobile ? '12px' : '20px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '10px' : '16px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-warning" style={{ fontSize: '9.5px' }}>Live KDS</span>
            <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              KDS
            </h2>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Kitchen orders & live cooking tickets
          </span>
        </div>

        <span className="badge badge-info" style={{ fontSize: '11px', padding: '4px 10px', alignSelf: isMobile ? 'flex-start' : 'center' }}>
          {activeOrders.length} Cooking
        </span>
      </div>

      {/* Orders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '10px',
        alignContent: 'start'
      }}>
        {activeOrders.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '36px 16px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Utensils size={32} opacity={0.3} style={{ margin: '0 auto 8px auto' }} />
            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>All dishes served!</p>
            <p style={{ fontSize: '11.5px', marginTop: '2px' }}>New food orders from tables will appear here.</p>
          </div>
        ) : (
          activeOrders.map((kot) => {
            const isReady = kot.status === 'Ready to Serve';
            const elapsed = getElapsedMins(kot.time);
            
            const timerColor = elapsed > 20 ? '#f43f5e' : elapsed > 10 ? '#f59e0b' : '#0c831f';

            return (
              <div
                key={kot.id}
                className="glass-panel"
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: isReady ? '1.5px solid #0c831f' : '1px solid var(--border-color)',
                  backgroundColor: isReady ? 'rgba(12,131,31,0.04)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {kot.id}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0c831f', marginTop: '1px', margin: 0 }}>
                      {kot.tableNo}
                    </h3>
                  </div>

                  <span className={`badge badge-${isReady ? 'success' : 'warning'}`} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                    {isReady ? 'Ready' : 'Cooking'}
                  </span>
                </div>

                {/* Timing strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  padding: '3px 6px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)'
                }}>
                  <span style={{ color: 'var(--text-dim)' }}>
                    {new Date(kot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({kot.orderType})
                  </span>

                  <span style={{ fontWeight: '700', color: timerColor, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Timer size={10} /> {elapsed}m elapsed
                  </span>
                </div>

                {/* Item List */}
                <div style={{
                  padding: '6px 8px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  {kot.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {item.name}
                      </span>
                      <span className="mono" style={{ fontWeight: '700', color: '#0c831f' }}>
                        x{item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div style={{ display: 'flex', gap: '4px', marginTop: 'auto', paddingTop: '2px' }}>
                  {kot.status === 'Preparing' ? (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Ready to Serve')}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '6px', fontSize: '11px', height: '26px' }}
                    >
                      <Flame size={12} /> Ready
                    </button>
                  ) : (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Served')}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '6px', fontSize: '11px', color: '#0c831f', height: '26px' }}
                    >
                      <CheckCircle2 size={12} /> Served
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
