import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Timer, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Layers, 
  Pizza, 
  Coffee, 
  Soup, 
  X,
  AlertCircle
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function KitchenDisplayBoard() {
  const { kitchenOrders, updateKOTStatus, settings } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [nowTime, setNowTime] = useState(Date.now());
  const [selectedStation, setSelectedStation] = useState('All');
  const [kotPrintModalData, setKotPrintModalData] = useState(null);

  // Checked items state per KOT
  const [checkedItemsMap, setCheckedItemsMap] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time tick every 20 seconds for live order timer badges
  useEffect(() => {
    const interval = setInterval(() => setNowTime(Date.now()), 20000);
    return () => clearInterval(interval);
  }, []);

  const orders = kitchenOrders || [];
  const activeOrders = orders.filter((k) => k.status !== 'Served');
  const servedOrders = orders.filter((k) => k.status === 'Served');

  const stations = [
    { id: 'All', label: 'All Stations', icon: Layers },
    { id: 'Pizza', label: 'Pizza & Oven', icon: Pizza },
    { id: 'Grill', label: 'Main Grill / Kitchen', icon: Soup },
    { id: 'Bar', label: 'Beverages & Bar', icon: Coffee }
  ];

  const getElapsedMins = (isoString) => {
    if (!isoString) return 0;
    const diffMs = nowTime - new Date(isoString).getTime();
    return Math.max(1, Math.floor(diffMs / 60000));
  };

  const toggleItemChecked = (kotId, itemIndex) => {
    const key = `${kotId}_${itemIndex}`;
    setCheckedItemsMap(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrintKOT = (kot) => {
    setKotPrintModalData(kot);
  };

  const handlePrintWindow = () => {
    window.print();
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
            <span className="badge badge-warning" style={{ fontSize: '11px' }}>Chef KDS Board</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Kitchen Orders (KOT Live Board)
            </h2>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Live ticket board for chefs • Multi-station routing • Item checkoff • Print KOT slip
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {servedOrders.length > 0 && (
            <button
              onClick={() => {
                const lastServed = servedOrders[0];
                updateKOTStatus(lastServed.id, 'Ready to Serve');
                alert(`Recalled ${lastServed.id} (${lastServed.tableNo}) back to KDS!`);
              }}
              className="btn btn-secondary"
              style={{ padding: '7px 12px', fontSize: '12px', gap: '5px', fontWeight: '600' }}
              title="Recall last bumped order"
            >
              <RotateCcw size={13} /> Recall Last Order
            </button>
          )}

          <span className="badge badge-info" style={{ fontSize: '12px', padding: '6px 14px', fontWeight: '700' }}>
            {activeOrders.length} Active Orders
          </span>
        </div>
      </div>

      {/* Station Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {stations.map((st) => {
          const Icon = st.icon;
          const isSelected = selectedStation === st.id;

          return (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: isSelected ? '#0c831f' : 'var(--border-color)',
                backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                color: isSelected ? '#0c831f' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: isSelected ? '700' : '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              {st.label}
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '14px',
        alignContent: 'start'
      }}>
        {activeOrders.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '48px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Utensils size={44} opacity={0.3} style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>All Dishes Prepared & Served!</h3>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>New food orders fired from tables or POS will immediately appear here.</p>
          </div>
        ) : (
          activeOrders.map((kot) => {
            const isReady = kot.status === 'Ready to Serve';
            const elapsed = getElapsedMins(kot.time);
            
            const timerColor = elapsed > 20 ? '#f43f5e' : elapsed > 10 ? '#f59e0b' : '#0c831f';
            const timerBg = elapsed > 20 ? 'rgba(244,63,94,0.12)' : elapsed > 10 ? 'rgba(245,158,11,0.12)' : 'rgba(12,131,31,0.12)';

            return (
              <div
                key={kot.id}
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: isReady ? '2px solid #0c831f' : elapsed > 20 ? '2px solid #f43f5e' : '1px solid var(--border-color)',
                  backgroundColor: isReady ? 'rgba(12,131,31,0.04)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: elapsed > 20 ? '0 4px 16px rgba(244,63,94,0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dim)' }}>
                        {kot.id}
                      </span>
                      <span className="badge badge-info" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                        {kot.orderType || 'Dine-In'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0c831f', marginTop: '2px', margin: 0 }}>
                      {kot.tableNo}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handlePrintKOT(kot)}
                      className="btn-icon"
                      style={{ padding: '5px' }}
                      title="Print KOT Slip (Thermal 80mm)"
                    >
                      <Printer size={15} />
                    </button>

                    <span className={`badge badge-${isReady ? 'success' : 'warning'}`} style={{ fontSize: '10.5px', padding: '3px 8px', fontWeight: '700' }}>
                      {isReady ? 'Ready to Serve' : 'Preparing'}
                    </span>
                  </div>
                </div>

                {/* Timing Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  padding: '6px 10px',
                  backgroundColor: timerBg,
                  borderRadius: 'var(--radius-xs)',
                  border: `1px solid ${timerColor}`
                }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                    Fired at: {new Date(kot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <span style={{ fontWeight: '800', color: timerColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Timer size={13} /> {elapsed}m elapsed
                  </span>
                </div>

                {/* Chef Notes (if any) */}
                {kot.chefNotes && (
                  <div style={{ padding: '6px 10px', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-xs)', border: '1px dashed #f59e0b', fontSize: '11.5px', color: '#f59e0b' }}>
                    <strong>Note:</strong> {kot.chefNotes}
                  </div>
                )}

                {/* Item List with Interactive Check-off */}
                <div style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {kot.items.map((item, idx) => {
                    const isChecked = Boolean(checkedItemsMap[`${kot.id}_${idx}`]);

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleItemChecked(kot.id, idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          backgroundColor: isChecked ? 'rgba(12,131,31,0.1)' : 'transparent',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ cursor: 'pointer', accentColor: '#0c831f' }}
                          />
                          <span style={{
                            fontWeight: '700',
                            color: isChecked ? 'var(--text-dim)' : 'var(--text-main)',
                            textDecoration: isChecked ? 'line-through' : 'none'
                          }}>
                            {item.name}
                          </span>
                        </div>

                        <span className="mono" style={{ fontWeight: '800', color: '#0c831f' }}>
                          x{item.qty}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Status Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '4px' }}>
                  {kot.status === 'Preparing' ? (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Ready to Serve')}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '9px', fontSize: '13px', fontWeight: '700' }}
                    >
                      <Flame size={15} /> Mark Ready to Serve
                    </button>
                  ) : (
                    <button
                      onClick={() => updateKOTStatus(kot.id, 'Served')}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '9px', fontSize: '13px', color: '#0c831f', fontWeight: '700', borderColor: '#0c831f' }}
                    >
                      <CheckCircle2 size={15} /> Mark as Served to Table
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* KOT THERMAL PRINT MODAL */}
      {kotPrintModalData && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '380px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Printer color="var(--instamart-green)" size={18} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Kitchen Order Ticket (KOT)
                </h3>
              </div>
              <button onClick={() => setKotPrintModalData(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            {/* Thermal Ticket Format */}
            <div style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #000000', paddingBottom: '6px' }}>
                <strong style={{ fontSize: '15px' }}>*** KITCHEN ORDER TICKET ***</strong>
                <div>{settings.storeName}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>KOT: {kotPrintModalData.id}</span>
                <span>Type: {kotPrintModalData.orderType}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '14px' }}>TABLE: {kotPrintModalData.tableNo}</strong>
                <span>{new Date(kotPrintModalData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div style={{ borderBottom: '1px dashed #000000', paddingBottom: '4px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>ITEM</span>
                  <span>QTY</span>
                </div>
              </div>

              {kotPrintModalData.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>{item.name}</span>
                  <span>x{item.qty}</span>
                </div>
              ))}

              {kotPrintModalData.chefNotes && (
                <div style={{ borderTop: '1px dashed #000000', paddingTop: '4px', marginTop: '4px', fontSize: '11px' }}>
                  <strong>Chef Note:</strong> {kotPrintModalData.chefNotes}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setKotPrintModalData(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Close
              </button>
              <button onClick={handlePrintWindow} className="btn btn-primary" style={{ flex: 1, fontWeight: '700' }}>
                <Printer size={15} /> Print KOT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
