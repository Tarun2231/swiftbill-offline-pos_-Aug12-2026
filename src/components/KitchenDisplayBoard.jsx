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
      padding: isMobile ? '14px' : '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '14px' : '20px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-warning" style={{ fontSize: '11px' }}>Kitchen KDS</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Kitchen Orders (KOT Board)
            </h2>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Live ticket board for kitchen staff. Mark orders as Preparing, Ready, or Served.
          </span>
        </div>

        <span className="badge badge-info" style={{ fontSize: '12px', padding: '6px 14px', alignSelf: isMobile ? 'flex-start' : 'center', fontWeight: '700' }}>
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
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '44px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Utensils size={40} opacity={0.3} style={{ margin: '0 auto 10px auto' }} />
            <p style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>All dishes served!</p>
            <p style={{ fontSize: '12.5px', marginTop: '4px' }}>New food orders from tables will appear here.</p>
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
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  border: isReady ? '2px solid #0c831f' : '1px solid var(--border-color)',
                  backgroundColor: isReady ? 'rgba(12,131,31,0.05)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {kot.id}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0c831f', marginTop: '2px', margin: 0 }}>
                      {kot.tableNo}
                    </h3>
                  </div>

                  <span className={`badge badge-${isReady ? 'success' : 'warning'}`} style={{ fontSize: '10px', padding: '3px 8px', fontWeight: '700' }}>
                    {isReady ? 'Ready to Serve' : 'Preparing'}
                  </span>
                </div>

                {/* Timing strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  padding: '4px 8px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)'
                }}>
                  <span style={{ color: 'var(--text-dim)' }}>
                    Ordered: {new Date(kot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({kot.orderType})
                  </span>

                  <span style={{ fontWeight: '700', color: timerColor, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Timer size={12} /> {elapsed}m elapsed
                  </span>
                </div>

                {/* Item List */}
                <div style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {kot.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {item.name}
                      </span>
                      <span className="mono" style={{ fontWeight: '800', color: '#0c831f' }}>
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
                      style={{ width: '100%', padding: '8px', fontSize: '12px', height: '30px', fontWeight: '700' }}
                    >
                      <Flame size={14} /> Mark Ready to Serve
                    </button>
                  ) : (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Served')}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '8px', fontSize: '12px', color: '#0c831f', height: '30px', fontWeight: '700' }}
                    >
                      <CheckCircle2 size={14} /> Mark as Served
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
