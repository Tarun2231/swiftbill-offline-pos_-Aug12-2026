import React, { useState, useEffect, useMemo } from 'react';
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
  Timer,
  Trash2,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRightLeft,
  Calendar,
  Split,
  Maximize2,
  TrendingUp,
  Armchair
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function RestaurantFloorplan({ onSelectTableOrder }) {
  const { 
    restaurantTables, 
    settings, 
    clearTable, 
    addTable,
    deleteTable,
    transferTable,
    mergeTables,
    reserveTable,
    updateItemCookingStatus 
  } = useBilling();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [filterSection, setFilterSection] = useState('All');
  
  // Modals State
  const [activeTimingTable, setActiveTimingTable] = useState(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showLifecycleGuide, setShowLifecycleGuide] = useState(false);

  // Selected Table for Operations
  const [selectedOpTable, setSelectedOpTable] = useState(null);
  const [targetTransferTable, setTargetTransferTable] = useState('');
  
  // Reservation Form State
  const [resGuestName, setResGuestName] = useState('');
  const [resTime, setResTime] = useState('08:00 PM');
  
  // Split Bill State
  const [splitCount, setSplitCount] = useState(2);

  // Add Table Form State
  const [newTableName, setNewTableName] = useState('');
  const [newTableSection, setNewTableSection] = useState('Main Dining Hall');
  const [newTableShape, setNewTableShape] = useState('rectangle');
  const [newTableCapacity, setNewTableCapacity] = useState('4');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tables = restaurantTables || [];

  // Sections
  const defaultSections = ['All', 'Main Dining Hall', 'Private Lounge', 'Outdoor Terrace', 'AC Family Hall', 'Rooftop Bar'];
  const customSections = Array.from(new Set(tables.map(t => t.section || 'Main Dining Hall')));
  const sections = Array.from(new Set([...defaultSections, ...customSections]));

  const filteredTables = tables.filter(
    (t) => filterSection === 'All' || t.section === filterSection || (filterSection === 'Main Dining Hall' && t.section?.includes('Main'))
  );

  // KPI Metrics
  const totalTables = tables.length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied');
  const availableCount = tables.filter((t) => t.status === 'available').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;
  const occupancyPercent = totalTables > 0 ? Math.round((occupiedTables.length / totalTables) * 100) : 0;
  
  const totalRunningTabs = useMemo(() => {
    return tables.reduce((acc, t) => {
      const itemsTotal = (t.currentItems || []).reduce((sum, i) => sum + (i.price * i.qty), 0);
      return acc + itemsTotal;
    }, 0);
  }, [tables]);

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

  const handleCreateNewTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    addTable({
      name: newTableName,
      section: newTableSection,
      shape: newTableShape,
      capacity: parseInt(newTableCapacity) || 4
    });

    setNewTableName('');
    setShowAddTableModal(false);
  };

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    if (!selectedOpTable || !targetTransferTable) return;
    transferTable(selectedOpTable.name, targetTransferTable);
    setShowTransferModal(false);
    setSelectedOpTable(null);
    setTargetTransferTable('');
    alert(`Moved guests from ${selectedOpTable.name} to ${targetTransferTable}!`);
  };

  const handleExecuteReservation = (e) => {
    e.preventDefault();
    if (!selectedOpTable || !resGuestName.trim()) return;
    reserveTable(selectedOpTable.name, resGuestName, resTime);
    setShowReserveModal(false);
    setSelectedOpTable(null);
    setResGuestName('');
  };

  const getTableShapeIcon = (shape) => {
    if (shape === 'round') return '⭕';
    if (shape === 'booth') return '🛋️';
    if (shape === 'patio') return '⛱️';
    if (shape === 'bar') return '🍸';
    return '🪑';
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
            <span className="badge badge-warning" style={{ fontSize: '11px' }}>Restaurant Floorplan</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Table Seating & Live Floor Map
            </h2>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Real-time table status • Live cooking tracker • Split bill • Table transfer & reservations
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setShowLifecycleGuide(!showLifecycleGuide)}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px', fontWeight: '600', gap: '6px' }}
          >
            <HelpCircle size={15} color="#3b82f6" /> {showLifecycleGuide ? 'Hide Guide' : 'How Dine-In Works'}
          </button>

          <button
            onClick={() => setShowAddTableModal(true)}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '13px', fontWeight: '700', gap: '6px' }}
          >
            <Plus size={16} /> + Add New Table
          </button>
        </div>
      </div>

      {/* Real-time Floorplan KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="glass-panel" style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid #0c831f'
        }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(12,131,31,0.12)', color: '#0c831f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Vacant Tables</span>
            <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {availableCount} / {totalTables}
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Occupancy Rate</span>
            <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', margin: 0 }}>
              {occupancyPercent}% ({occupiedTables.length} Active)
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Live Running Tabs</span>
            <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>
              {settings.currency}{totalRunningTabs.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Reserved Tables</span>
            <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#8b5cf6', margin: 0 }}>
              {reservedCount} Booked
            </h3>
          </div>
        </div>
      </div>

      {/* DINE-IN SERVING TILL BILLING LIFECYCLE GUIDE */}
      {showLifecycleGuide && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid var(--instamart-green)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--instamart-green)" />
              <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Dine-In Lifecycle: From Seating & Serving Till Billing
              </h3>
            </div>
            <button onClick={() => setShowLifecycleGuide(false)} className="btn-icon" style={{ padding: '3px' }}>
              <X size={15} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
            gap: '10px',
            marginTop: '4px'
          }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#0c831f' }}>1. Seat Table</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Tap <b>Seat & Take Order</b> on any vacant table to open the POS menu with that table selected.
              </p>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b' }}>2. Fire KOT</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Select food dishes and click <b>🔥 Send KOT</b>. The ticket instantly goes to the kitchen & the table stays occupied!
              </p>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6' }}>3. Track Timing</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                When customers ask <i>"How much time for our pizza?"</i>, click <b>⏱️ Check Timing</b> to view live elapsed time & cooking status.
              </p>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6' }}>4. Multi-Rounds</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                If guests want extra drinks or desserts while dining, click <b>+ Add Dishes</b> to fire Round 2 into the same table tab.
              </p>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#0c831f' }}>5. Settle & Pay</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                After eating, click <b>💳 Settle Bill</b>. Collect UPI QR/Cash/Card payment, print receipt, and table auto-clears to Vacant!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Filter Chips & Live Counts */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: '10px'
      }}>
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
      </div>

      {/* Table Floorplan Grid with Enhanced Shapes & Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(170px, 1fr))' : 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: isMobile ? '10px' : '14px'
      }}>
        {filteredTables.map((t) => {
          const isOcc = t.status === 'occupied';
          const isAvail = t.status === 'available';
          const isRes = t.status === 'reserved';
          const items = t.currentItems || [];
          const runningBill = getTableRunningTotal(items);
          const cookingSummary = getTableCookingSummary(items);
          const elapsedText = getElapsedTime(t.seatedAt);
          const shapeIcon = getTableShapeIcon(t.shape || 'rectangle');

          const statusColor = isAvail ? '#0c831f' : isRes ? '#8b5cf6' : '#f59e0b';
          const statusBg = isAvail ? 'rgba(12,131,31,0.04)' : isRes ? 'rgba(139,92,246,0.05)' : 'rgba(245,158,11,0.05)';

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
                borderRadius: t.shape === 'round' ? '20px' : 'var(--radius-md)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{shapeIcon}</span>
                  <div>
                    <h3 style={{ fontSize: isMobile ? '15px' : '16.5px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      {t.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {t.capacity} Seats • {t.section}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="badge" style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}`, fontSize: '10px', padding: '2px 6px', fontWeight: '700' }}>
                    {isOcc ? 'DINING' : isRes ? 'RESERVED' : 'VACANT'}
                  </span>

                  {/* Delete Table button (if vacant) */}
                  {isAvail && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete ${t.name}?`)) deleteTable(t.id);
                      }}
                      className="btn-icon"
                      style={{ padding: '3px', color: 'var(--text-dim)' }}
                      title="Delete Table"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status details */}
              {isOcc ? (
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Running Tab:</span>
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
              ) : isRes ? (
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: '11.5px', color: '#8b5cf6' }}>
                  <strong>Reserved:</strong> {t.reservation?.guestName || 'Guest'} at {t.reservation?.time || '8:00 PM'}
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>
                  Vacant & Ready for Guests
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                {isAvail ? (
                  <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                    <button
                      onClick={() => onSelectTableOrder(t.name)}
                      className="btn btn-primary"
                      style={{ flex: 2, padding: '7px', fontSize: '12px', fontWeight: '700' }}
                    >
                      <Plus size={14} /> Seat & Order
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOpTable(t);
                        setShowReserveModal(true);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '6px 8px', fontSize: '11px', color: '#8b5cf6' }}
                      title="Reserve Table"
                    >
                      <Calendar size={13} />
                    </button>
                  </div>
                ) : isRes ? (
                  <button
                    onClick={() => onSelectTableOrder(t.name)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '7px', fontSize: '12px', fontWeight: '700' }}
                  >
                    Check-in Guest & Order
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => onSelectTableOrder(t.name)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '6px 4px', fontSize: '11px', height: '28px', fontWeight: '600' }}
                        title="Add more food dishes"
                      >
                        + Add
                      </button>

                      <button
                        onClick={() => setActiveTimingTable(t)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 8px', fontSize: '11px', height: '28px', color: '#3b82f6', gap: '3px', fontWeight: '600' }}
                        title="Check order timing & cooking status"
                      >
                        <Timer size={12} /> Timing
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOpTable(t);
                          setShowTransferModal(true);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 8px', fontSize: '11px', height: '28px', color: '#f59e0b' }}
                        title="Transfer / Move Table"
                      >
                        <ArrowRightLeft size={12} /> Move
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOpTable(t);
                          setShowSplitBillModal(true);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 8px', fontSize: '11px', height: '28px', color: '#8b5cf6' }}
                        title="Split Bill Calculator"
                      >
                        <Split size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
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

      {/* ADD NEW TABLE MODAL */}
      {showAddTableModal && (
        <div className="modal-overlay" style={{ padding: '16px' }}>
          <div className="modal-container" style={{ maxWidth: '440px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils color="var(--instamart-green)" size={18} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Add New Dining Table
                </h3>
              </div>
              <button onClick={() => setShowAddTableModal(false)} className="btn-icon" style={{ padding: '4px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewTable} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Table Name / Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 6, VIP Booth 3, Rooftop Patio 2"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Table Shape</label>
                  <select
                    className="form-select"
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value)}
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  >
                    <option value="rectangle">🪑 Rectangle</option>
                    <option value="round">⭕ Round Table</option>
                    <option value="booth">🛋️ VIP Booth</option>
                    <option value="patio">⛱️ Outdoor Patio</option>
                    <option value="bar">🍸 Bar Counter</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Capacity (Seats)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Dining Section / Area</label>
                <select
                  className="form-select"
                  value={newTableSection}
                  onChange={(e) => setNewTableSection(e.target.value)}
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                >
                  <option value="Main Dining Hall">Main Dining Hall</option>
                  <option value="Private Lounge">Private Lounge / VIP</option>
                  <option value="Outdoor Terrace">Outdoor Terrace / Patio</option>
                  <option value="AC Family Hall">AC Family Hall</option>
                  <option value="Rooftop Bar">Rooftop Bar</option>
                  <option value="Garden Deck">Garden Deck</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddTableModal(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12.5px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '12.5px', fontWeight: '700' }}>
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE / TRANSFER TABLE MODAL */}
      {showTransferModal && selectedOpTable && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '400px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowRightLeft color="#f59e0b" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Transfer Table ({selectedOpTable.name})
                </h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Move all active dishes and seated time from <b>{selectedOpTable.name}</b> to another table:
              </p>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Select Target Table *</label>
                <select
                  className="form-select"
                  required
                  value={targetTransferTable}
                  onChange={(e) => setTargetTransferTable(e.target.value)}
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                >
                  <option value="">-- Choose Target Table --</option>
                  {tables.filter(t => t.name !== selectedOpTable.name).map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.status === 'available' ? 'Vacant' : 'Merge with active tab'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>
                  Confirm Move
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESERVATION MODAL */}
      {showReserveModal && selectedOpTable && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '400px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar color="#8b5cf6" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Book {selectedOpTable.name}
                </h3>
              </div>
              <button onClick={() => setShowReserveModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteReservation} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Khanna"
                  value={resGuestName}
                  onChange={(e) => setResGuestName(e.target.value)}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  autoFocus
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Reservation Time</label>
                <input
                  type="text"
                  placeholder="e.g. 08:30 PM"
                  value={resTime}
                  onChange={(e) => setResTime(e.target.value)}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowReserveModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#8b5cf6', fontWeight: '700' }}>
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SPLIT BILL CALCULATOR MODAL */}
      {showSplitBillModal && selectedOpTable && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '380px', padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Split color="#8b5cf6" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Split Bill • {selectedOpTable.name}
                </h3>
              </div>
              <button onClick={() => setShowSplitBillModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Total Table Bill:</span>
              <div className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#0c831f' }}>
                {settings.currency}{getTableRunningTotal(selectedOpTable.currentItems || []).toLocaleString()}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '6px' }}>
                Number of Guests to Split:
              </label>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSplitCount(num)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: splitCount === num ? '#8b5cf6' : 'var(--border-color)',
                      backgroundColor: splitCount === num ? '#8b5cf6' : 'var(--bg-card)',
                      color: splitCount === num ? '#ffffff' : 'var(--text-main)',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: '8px', border: '1px solid #8b5cf6' }}>
              <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>Per Person Share:</span>
              <div className="mono" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                {settings.currency}{Math.round(getTableRunningTotal(selectedOpTable.currentItems || []) / splitCount).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTableOrder(selectedOpTable.name);
                setShowSplitBillModal(false);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '9px', marginTop: '12px', fontWeight: '700' }}
            >
              Proceed to Bill Settlement
            </button>
          </div>
        </div>
      )}

      {/* LIVE TABLE TIMING & STATUS TRACKER MODAL */}
      {(() => {
        const liveTimingTable = activeTimingTable ? tables.find(t => t.name === activeTimingTable.name || t.id === activeTimingTable.id) : null;
        if (!liveTimingTable) return null;

        const liveItems = liveTimingTable.currentItems || [];
        const isAllServed = liveItems.length > 0 && liveItems.every(i => i.status === 'Served');
        const anyReady = liveItems.some(i => i.status === 'Ready');

        return (
          <div className="modal-overlay" style={{ padding: '12px' }}>
            <div className="modal-container" style={{ maxWidth: '480px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Timer color="#3b82f6" size={18} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      {liveTimingTable.name} • Status & Timing Tracker
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      Seated {getElapsedTime(liveTimingTable.seatedAt)}
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
                    {settings.currency}{getTableRunningTotal(liveItems).toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Overall Kitchen Status:</span>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: isAllServed ? '#0c831f' : anyReady ? '#3b82f6' : '#f59e0b' }}>
                    {isAllServed ? '🍽️ All Dishes Served' : anyReady ? '🔔 Ready to Serve' : '🔥 Food Cooking in Kitchen'}
                  </div>
                </div>
              </div>

              {/* Quick 1-Click Mark All As Served */}
              {liveItems.length > 0 && !isAllServed && (
                <button
                  onClick={() => {
                    liveItems.forEach((_, idx) => updateItemCookingStatus(liveTimingTable.name, idx, 'Served'));
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '11.5px', padding: '6px', color: '#0c831f', borderColor: '#0c831f', fontWeight: '700' }}
                >
                  <CheckCircle2 size={13} /> Mark All {liveItems.length} Dishes as Served
                </button>
              )}

              {/* Item-by-item tracker with 3-state cycling */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                {liveItems.length === 0 ? (
                  <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
                    No dishes ordered yet for this table.
                  </p>
                ) : (
                  liveItems.map((item, idx) => {
                    const status = item.status || 'Cooking';

                    const nextStatus = status === 'Cooking' ? 'Ready' : status === 'Ready' ? 'Served' : 'Cooking';
                    const badgeClass = status === 'Served' ? 'badge-success' : status === 'Ready' ? 'badge-info' : 'badge-warning';
                    const label = status === 'Served' ? '🍽️ Served' : status === 'Ready' ? '🔔 Ready' : '🔥 Cooking';

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
                            {status === 'Cooking' ? `Est. Prep Time: ${item.estMins || 12} mins` : status === 'Ready' ? 'Hot & ready on kitchen counter' : 'Served at dining table'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => updateItemCookingStatus(liveTimingTable.name, idx, nextStatus)}
                            className={`badge ${badgeClass}`}
                            style={{ cursor: 'pointer', border: 'none', padding: '5px 10px', fontSize: '11px', fontWeight: '700' }}
                            title="Click to advance status: Cooking ➔ Ready ➔ Served"
                          >
                            {label}
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
                    onSelectTableOrder(liveTimingTable.name);
                    setActiveTimingTable(null);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '12px', fontWeight: '600' }}
                >
                  + Add More Food
                </button>
                <button
                  onClick={() => {
                    onSelectTableOrder(liveTimingTable.name);
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
        );
      })()}
    </div>
  );
}
