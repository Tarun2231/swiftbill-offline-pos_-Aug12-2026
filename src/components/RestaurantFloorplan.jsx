import React, { useState, useEffect } from 'react';
import { Utensils, Users, Plus, CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function RestaurantFloorplan({ onSelectTableOrder }) {
  const { settings } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [tables, setTables] = useState([
    { id: 'T1', name: 'Table 1', section: 'Main Dining Hall', capacity: 2, status: 'available', currentBill: 0, orderTime: null },
    { id: 'T2', name: 'Table 2', section: 'Main Dining Hall', capacity: 4, status: 'occupied', currentBill: 838, orderTime: '24 mins ago' },
    { id: 'T3', name: 'Table 3', section: 'Main Dining Hall', capacity: 4, status: 'available', currentBill: 0, orderTime: null },
    { id: 'T4', name: 'Table 4', section: 'Main Dining Hall', capacity: 6, status: 'billed', currentBill: 1450, orderTime: '55 mins ago' },
    { id: 'VIP1', name: 'VIP Booth A', section: 'Private Lounge', capacity: 8, status: 'occupied', currentBill: 2990, orderTime: '40 mins ago' },
    { id: 'VIP2', name: 'VIP Booth B', section: 'Private Lounge', capacity: 8, status: 'available', currentBill: 0, orderTime: null },
    { id: 'P1', name: 'Patio Table 1', section: 'Outdoor Terrace', capacity: 4, status: 'available', currentBill: 0, orderTime: null },
    { id: 'P2', name: 'Patio Table 2', section: 'Outdoor Terrace', capacity: 4, status: 'occupied', currentBill: 620, orderTime: '15 mins ago' }
  ]);

  const [filterSection, setFilterSection] = useState('All');
  const sections = ['All', 'Main Dining Hall', 'Private Lounge', 'Outdoor Terrace'];

  const filteredTables = tables.filter(
    (t) => filterSection === 'All' || t.section === filterSection
  );

  const toggleTableStatus = (id, newStatus) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              currentBill: newStatus === 'available' ? 0 : t.currentBill,
              orderTime: newStatus === 'occupied' ? 'Just seated' : null
            }
          : t
      )
    );
  };

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const availableCount = tables.filter((t) => t.status === 'available').length;

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
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-warning">Floor Map</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Table & Seating Map
            </h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live table vacancies. Tap any table to take orders, view running tab, or mark vacant.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '10px', fontSize: '11.5px', fontWeight: '700', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Available ({availableCount})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f43f5e' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f43f5e' }}></span>
            Occupied ({occupiedCount})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
            Billed ({tables.length - availableCount - occupiedCount})
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
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterSection === sec ? 'var(--primary)' : 'var(--border-color)',
              backgroundColor: filterSection === sec ? 'rgba(16,185,129,0.15)' : 'var(--bg-card)',
              color: filterSection === sec ? '#10b981' : 'var(--text-muted)',
              fontSize: '12.5px',
              fontWeight: '600',
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
        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: isMobile ? '10px' : '16px'
      }}>
        {filteredTables.map((t) => {
          const isOcc = t.status === 'occupied';
          const isBilled = t.status === 'billed';
          const isAvail = t.status === 'available';

          const statusColor = isAvail ? '#10b981' : isOcc ? '#f43f5e' : '#f59e0b';
          const statusBg = isAvail ? 'rgba(16,185,129,0.06)' : isOcc ? 'rgba(244,63,94,0.06)' : 'rgba(245,158,11,0.06)';

          return (
            <div
              key={t.id}
              className="glass-panel card-hover"
              style={{
                padding: isMobile ? '12px' : '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: `1.5px solid ${statusColor}`,
                backgroundColor: statusBg
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {t.name}
                  </h3>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block', marginTop: '2px' }}>
                    {t.capacity} Seats
                  </span>
                </div>

                <span className="badge" style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}`, fontSize: '9.5px', padding: '1px 6px' }}>
                  {t.status.toUpperCase()}
                </span>
              </div>

              {/* Status details */}
              {isOcc ? (
                <div style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <span>Tab:</span>
                    <span className="mono" style={{ fontWeight: '800', color: '#10b981' }}>
                      {settings.currency}{t.currentBill.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {t.orderTime}
                  </div>
                </div>
              ) : isBilled ? (
                <div style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Bill:</span>
                    <span className="mono" style={{ fontWeight: '800', color: '#f59e0b' }}>
                      {settings.currency}{t.currentBill.toLocaleString()}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Cleaning up</span>
                </div>
              ) : (
                <div style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '11.5px' }}>
                  Vacant & Ready
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                {isAvail ? (
                  <button
                    onClick={() => {
                      toggleTableStatus(t.id, 'occupied');
                      onSelectTableOrder(t.name);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '6px', fontSize: '11.5px' }}
                  >
                    <Plus size={13} /> Seat Table
                  </button>
                ) : isOcc ? (
                  <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                    <button
                      onClick={() => onSelectTableOrder(t.name)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '6px 4px', fontSize: '11px' }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => toggleTableStatus(t.id, 'billed')}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '6px 4px', fontSize: '11px', backgroundColor: '#f59e0b' }}
                    >
                      Bill
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleTableStatus(t.id, 'available')}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '6px', fontSize: '11.5px', color: '#10b981' }}
                  >
                    <CheckCircle2 size={13} /> Vacant
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
