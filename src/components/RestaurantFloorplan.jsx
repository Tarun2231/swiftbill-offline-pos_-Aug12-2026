import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Receipt, 
  ArrowRight,
  Eye,
  X,
  ChefHat,
  Timer
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function RestaurantFloorplan({ onSelectTableOrder }) {
  const { 
    restaurantTables, 
    settings, 
    clearTable, 
    updateItemCookingStatus 
  } = useBilling();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [filterSection, setFilterSection] = useState('All');
  
  // Selected Table for Status & Timing Tracker Modal
  const [activeTimingTable, setActiveTimingTable] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = ['All', 'Main Hall', 'Lounge', 'Terrace'];

  const tables = restaurantTables || [];

  const filteredTables = tables.filter(
    (t) => filterSection === 'All' || t.section === filterSection || (filterSection === 'Main Hall' && t.section?.includes('Main'))
  );

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const availableCount = tables.filter((t) => t.status === 'available').length;

  const getElapsedTime = (isoString) => {
    if (!isoString) return 'Just seated';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    return `${mins}m ago`;
  };

  const getTableRunningTotal = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const getTableCookingSummary = (items = []) => {
    if (!items.length) return null;
    const cooking = items.filter(i => i.status === 'Cooking').length;
    const ready = items.filter(i => i.status === 'Ready').length;
    const served = items.filter(i => i.status === 'Served').length;
    return { cooking, ready, served, total: items.length };
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
            <span className="badge badge-warning" style={{ fontSize: '9.5px' }}>Floor Map</span>
            <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Tables
            </h2>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Live status • Seated orders • Bill after dining
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: '600', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0c831f' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0c831f' }}></span>
            Vacant ({availableCount})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
            Dining ({occupiedCount})
          </div>
        </div>
      </div>

      {/* Section Filter Chips */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setFilterSection(sec)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterSection === sec ? '#0c831f' : 'var(--border-color)',
              backgroundColor: filterSection === sec ? 'var(--instamart-green-light)' : 'var(--bg-card)',
              color: filterSection === sec ? '#0c831f' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: filterSection === sec ? '600' : '400',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Table Floorplan Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(150px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: isMobile ? '8px' : '12px'
      }}>
        {filteredTables.map((t) => {
          const isOcc = t.status === 'occupied';
          const isAvail = t.status === 'available';
          const items = t.currentItems || [];
          const runningBill = getTableRunningTotal(items);
          const cookingSummary = getTableCookingSummary(items);
          const elapsedText = getElapsedTime(t.seatedAt);

          const statusColor = isAvail ? '#0c831f' : '#f59e0b';
          const statusBg = isAvail ? 'rgba(12,131,31,0.03)' : 'rgba(245,158,11,0.04)';

          return (
            <div
              key={t.id}
              className="glass-panel card-hover"
              style={{
                padding: isMobile ? '10px' : '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: `1px solid ${statusColor}`,
                backgroundColor: statusBg,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: isMobile ? '13.5px' : '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {t.name}
                  </h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    {t.capacity} Seats • {t.section}
                  </span>
                </div>

                <span className="badge" style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}`, fontSize: '9px', padding: '1px 5px' }}>
                  {isOcc ? 'DINING' : 'VACANT'}
                </span>
              </div>

              {/* Status details */}
              {isOcc ? (
                <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Running Tab:</span>
                    <span className="mono" style={{ fontWeight: '700', color: '#0c831f' }}>
                      {settings.currency}{runningBill.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', color: 'var(--text-dim)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={9} /> {elapsedText}
                    </span>
                    <span>{items.length} dishes</span>
                  </div>

                  {cookingSummary && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                      {cookingSummary.cooking > 0 && (
                        <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '2px', backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                          🔥 {cookingSummary.cooking} cook
                        </span>
                      )}
                      {cookingSummary.served > 0 && (
                        <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '2px', backgroundColor: 'rgba(12,131,31,0.15)', color: '#0c831f' }}>
                          🍽️ {cookingSummary.served} served
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '11px' }}>
                  Vacant & Ready
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
                {isAvail ? (
                  <button
                    onClick={() => onSelectTableOrder(t.name)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '5px', fontSize: '11px' }}
                  >
                    <Plus size={12} /> Seat & Order
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <button
                        onClick={() => onSelectTableOrder(t.name)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '4px 2px', fontSize: '10.5px', height: '24px' }}
                        title="Add dishes to table"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => setActiveTimingTable(t)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 6px', fontSize: '10.5px', height: '24px', color: '#3b82f6' }}
                        title="Check timing & cooking status"
                      >
                        <Timer size={11} /> Status
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '3px' }}>
                      <button
                        onClick={() => onSelectTableOrder(t.name)}
                        className="btn btn-primary"
                        style={{ flex: 2, padding: '4px', fontSize: '10.5px', height: '24px' }}
                      >
                        <Receipt size={10} /> Settle Bill
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Mark ${t.name} vacant?`)) clearTable(t.name);
                        }}
                        className="btn btn-danger"
                        style={{ flex: 1, padding: '4px 2px', fontSize: '10px', height: '24px' }}
                        title="Clear table"
                      >
                        Vacant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE TABLE TIMING & STATUS TRACKER MODAL */}
      {activeTimingTable && (
        <div className="modal-overlay" style={{ padding: '10px' }}>
          <div className="modal-container" style={{ maxWidth: '420px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Timer color="#3b82f6" size={16} />
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {activeTimingTable.name} • Status & Timing
                  </h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    Seated {getElapsedTime(activeTimingTable.seatedAt)}
                  </span>
                </div>
              </div>

              <button onClick={() => setActiveTimingTable(null)} className="btn-icon" style={{ padding: '4px' }}>
                <X size={15} />
              </button>
            </div>

            {/* Overall ETA Strip */}
            <div style={{
              padding: '8px 10px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Running Total:</span>
                <div className="mono" style={{ fontSize: '15px', fontWeight: '700', color: '#0c831f' }}>
                  {settings.currency}{getTableRunningTotal(activeTimingTable.currentItems || []).toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Kitchen Status:</span>
                <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#f59e0b' }}>
                  🔥 Preparing Food
                </div>
              </div>
            </div>

            {/* Item-by-item tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
              {(activeTimingTable.currentItems || []).length === 0 ? (
                <p style={{ fontSize: '11.5px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                  No items ordered yet.
                </p>
              ) : (
                (activeTimingTable.currentItems || []).map((item, idx) => {
                  const isCooking = item.status === 'Cooking';
                  const isServed = item.status === 'Served';

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '8px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>
                          {item.name} <span style={{ color: '#0c831f' }}>x{item.qty}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                          {isCooking ? `Est: ${item.estMins || 12} mins` : 'Served to table'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={() => updateItemCookingStatus(activeTimingTable.name, idx, isCooking ? 'Served' : 'Cooking')}
                          className={`badge badge-${isCooking ? 'warning' : 'success'}`}
                          style={{ cursor: 'pointer', border: 'none', padding: '3px 6px', fontSize: '10px' }}
                          title="Click to toggle status"
                        >
                          {isCooking ? '🔥 Cooking' : '🍽️ Served'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                onClick={() => {
                  onSelectTableOrder(activeTimingTable.name);
                  setActiveTimingTable(null);
                }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '6px', fontSize: '11px' }}
              >
                + Add More Food
              </button>
              <button
                onClick={() => {
                  onSelectTableOrder(activeTimingTable.name);
                  setActiveTimingTable(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '6px', fontSize: '11px' }}
              >
                Settle Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
