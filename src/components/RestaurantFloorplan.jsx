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

  const sections = ['All', 'Main Dining Hall', 'Private Lounge', 'Outdoor Terrace'];

  const tables = restaurantTables || [];

  const filteredTables = tables.filter(
    (t) => filterSection === 'All' || t.section === filterSection || (filterSection === 'Main Dining Hall' && t.section?.includes('Main'))
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
            <span className="badge badge-warning" style={{ fontSize: '11px' }}>Table Floorplan</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Dining Tables & Seating Map
            </h2>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Real-time table status • Order on table • Track cooking time • Pay after dining
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: '700', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0c831f' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0c831f' }}></span>
            Vacant ({availableCount})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
            Dining & Occupied ({occupiedCount})
          </div>
        </div>
      </div>

      {/* Section Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setFilterSection(sec)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterSection === sec ? '#0c831f' : 'var(--border-color)',
              backgroundColor: filterSection === sec ? 'var(--instamart-green-light)' : 'var(--bg-card)',
              color: filterSection === sec ? '#0c831f' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: filterSection === sec ? '700' : '500',
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
        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: isMobile ? '10px' : '14px'
      }}>
        {filteredTables.map((t) => {
          const isOcc = t.status === 'occupied';
          const isAvail = t.status === 'available';
          const items = t.currentItems || [];
          const runningBill = getTableRunningTotal(items);
          const cookingSummary = getTableCookingSummary(items);
          const elapsedText = getElapsedTime(t.seatedAt);

          const statusColor = isAvail ? '#0c831f' : '#f59e0b';
          const statusBg = isAvail ? 'rgba(12,131,31,0.04)' : 'rgba(245,158,11,0.05)';

          return (
            <div
              key={t.id}
              className="glass-panel card-hover"
              style={{
                padding: isMobile ? '12px' : '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: `1.5px solid ${statusColor}`,
                backgroundColor: statusBg,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: isMobile ? '15px' : '16.5px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {t.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {t.capacity} Seats • {t.section}
                  </span>
                </div>

                <span className="badge" style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}`, fontSize: '10px', padding: '2px 6px', fontWeight: '700' }}>
                  {isOcc ? 'OCCUPIED' : 'VACANT'}
                </span>
              </div>

              {/* Status details */}
              {isOcc ? (
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Running Total:</span>
                    <span className="mono" style={{ fontWeight: '800', color: '#0c831f' }}>
                      {settings.currency}{runningBill.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: 'var(--text-dim)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {elapsedText}
                    </span>
                    <span>{items.length} dishes ordered</span>
                  </div>

                  {cookingSummary && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                      {cookingSummary.cooking > 0 && (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: '600' }}>
                          🔥 {cookingSummary.cooking} cooking
                        </span>
                      )}
                      {cookingSummary.served > 0 && (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'rgba(12,131,31,0.15)', color: '#0c831f', fontWeight: '600' }}>
                          🍽️ {cookingSummary.served} served
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>
                  Vacant & Ready for Guests
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                {isAvail ? (
                  <button
                    onClick={() => onSelectTableOrder(t.name)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '7px', fontSize: '12px', fontWeight: '700' }}
                  >
                    <Plus size={14} /> Seat Table & Take Order
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => onSelectTableOrder(t.name)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '6px', fontSize: '11.5px', height: '28px', fontWeight: '600' }}
                        title="Add dishes to table"
                      >
                        + Add Dishes
                      </button>
                      <button
                        onClick={() => setActiveTimingTable(t)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11.5px', height: '28px', color: '#3b82f6', gap: '4px', fontWeight: '600' }}
                        title="Check order timing & cooking status"
                      >
                        <Timer size={13} /> Check Timing
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => onSelectTableOrder(t.name)}
                        className="btn btn-primary"
                        style={{ flex: 2, padding: '6px', fontSize: '11.5px', height: '28px', fontWeight: '700' }}
                      >
                        <Receipt size={12} /> Settle Bill
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Mark ${t.name} vacant?`)) clearTable(t.name);
                        }}
                        className="btn btn-danger"
                        style={{ flex: 1, padding: '6px', fontSize: '11px', height: '28px', fontWeight: '600' }}
                        title="Mark table vacant"
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
        <div className="modal-overlay" style={{ padding: '12px' }}>
          <div className="modal-container" style={{ maxWidth: '460px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer color="#3b82f6" size={18} />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {activeTimingTable.name} • Status & Timing Tracker
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Seated {getElapsedTime(activeTimingTable.seatedAt)}
                  </span>
                </div>
              </div>

              <button onClick={() => setActiveTimingTable(null)} className="btn-icon" style={{ padding: '5px' }}>
                <X size={16} />
              </button>
            </div>

            {/* Overall ETA Strip */}
            <div style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Running Total:</span>
                <div className="mono" style={{ fontSize: '17px', fontWeight: '800', color: '#0c831f' }}>
                  {settings.currency}{getTableRunningTotal(activeTimingTable.currentItems || []).toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Kitchen Status:</span>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#f59e0b' }}>
                  🔥 Food in Preparation
                </div>
              </div>
            </div>

            {/* Item-by-item tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
              {(activeTimingTable.currentItems || []).length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
                  No dishes ordered yet for this table.
                </p>
              ) : (
                (activeTimingTable.currentItems || []).map((item, idx) => {
                  const isCooking = item.status === 'Cooking';

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {item.name} <span style={{ color: '#0c831f' }}>x{item.qty}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {isCooking ? `Est. Cooking Time: ${item.estMins || 12} mins` : 'Served at table'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => updateItemCookingStatus(activeTimingTable.name, idx, isCooking ? 'Served' : 'Cooking')}
                          className={`badge badge-${isCooking ? 'warning' : 'success'}`}
                          style={{ cursor: 'pointer', border: 'none', padding: '4px 8px', fontSize: '11px', fontWeight: '700' }}
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

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => {
                  onSelectTableOrder(activeTimingTable.name);
                  setActiveTimingTable(null);
                }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '12px', fontWeight: '600' }}
              >
                + Add More Food
              </button>
              <button
                onClick={() => {
                  onSelectTableOrder(activeTimingTable.name);
                  setActiveTimingTable(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '12px', fontWeight: '700' }}
              >
                Settle & Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
