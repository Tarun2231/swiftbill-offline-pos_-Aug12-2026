import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Phone, 
  Award,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function StaffManagement() {
  const { 
    staffMembers, 
    addStaffMember, 
    updateStaffMember, 
    deleteStaffMember, 
    invoices, 
    settings, 
    auth, 
    currentUser 
  } = useBilling();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPinModal, setShowPinModal] = useState(null);
  const [selectedStaffReport, setSelectedStaffReport] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('Cashier');
  const [phone, setPhone] = useState('');
  const [showPinInTable, setShowPinInTable] = useState({});

  // Reset PIN Form State
  const [newStaffPin, setNewStaffPin] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const staffList = staffMembers || [];

  // Calculate Sales & Work per Staff Member from Invoices
  const staffSalesAnalytics = useMemo(() => {
    const map = {};

    // Initialize all staff
    staffList.forEach((s) => {
      map[s.id] = {
        id: s.id,
        name: s.name,
        username: s.username,
        role: s.role,
        totalSales: 0,
        billsCount: 0,
        cashCollected: 0,
        upiCollected: 0,
        cardCollected: 0,
        creditBills: 0,
        invoices: []
      };
    });

    // Also include Admin bills
    map['admin'] = {
      id: 'admin',
      name: 'Master Admin',
      username: 'admin',
      role: 'Master Admin',
      totalSales: 0,
      billsCount: 0,
      cashCollected: 0,
      upiCollected: 0,
      cardCollected: 0,
      creditBills: 0,
      invoices: []
    };

    (invoices || []).forEach((inv) => {
      if (inv.status === 'Cancelled') return;
      const cId = inv.cashierId || (inv.cashier?.id) || 'admin';
      
      if (!map[cId]) {
        map[cId] = {
          id: cId,
          name: inv.cashierName || 'Staff',
          username: 'staff',
          role: inv.cashierRole || 'Cashier',
          totalSales: 0,
          billsCount: 0,
          cashCollected: 0,
          upiCollected: 0,
          cardCollected: 0,
          creditBills: 0,
          invoices: []
        };
      }

      const total = inv.grandTotal || 0;
      map[cId].totalSales += total;
      map[cId].billsCount += 1;
      map[cId].invoices.push(inv);

      if (inv.paymentMethod === 'Cash') map[cId].cashCollected += total;
      else if (inv.paymentMethod === 'UPI') map[cId].upiCollected += total;
      else if (inv.paymentMethod === 'Card') map[cId].cardCollected += total;
      else if (inv.paymentMethod === 'Credit') map[cId].creditBills += total;
    });

    return map;
  }, [staffList, invoices]);

  // Overall KPI
  const totalStaffCount = staffList.length;
  const activeStaffCount = staffList.filter((s) => s.active !== false).length;
  const totalStaffSales = Object.values(staffSalesAnalytics).reduce((acc, s) => acc + s.totalSales, 0);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setUsername('');
    setPin('1111');
    setRole('Cashier');
    setPhone('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);
    setName(staff.name);
    setUsername(staff.username);
    setPin(staff.pin);
    setRole(staff.role);
    setPhone(staff.phone || '');
    setShowAddModal(true);
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !pin.trim()) return;

    if (editingStaff) {
      updateStaffMember(editingStaff.id, {
        name,
        username: username.toLowerCase().trim(),
        pin: pin.trim(),
        role,
        phone
      });
    } else {
      addStaffMember({
        name,
        username: username.toLowerCase().trim(),
        pin: pin.trim(),
        role,
        phone
      });
    }
    setShowAddModal(false);
  };

  const handleSaveStaffPin = (e) => {
    e.preventDefault();
    if (!newStaffPin.trim() || !showPinModal) return;

    updateStaffMember(showPinModal.id, { pin: newStaffPin.trim() });
    alert(`PIN for ${showPinModal.name} updated to "${newStaffPin.trim()}"!`);
    setShowPinModal(null);
    setNewStaffPin('');
  };

  const togglePinVisibility = (id) => {
    setShowPinInTable(prev => ({ ...prev, [id]: !prev[id] }));
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
            <span className="badge badge-info" style={{ fontSize: '11px' }}>Admin Control</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Staff Accounts & Shift Performance
            </h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Assign employee login credentials, passwords, and track individual sales & cash collections per shift.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ padding: '8px 18px', fontSize: '13px', fontWeight: '700', gap: '6px', alignSelf: isMobile ? 'stretch' : 'center' }}
        >
          <UserPlus size={16} /> + Add New Employee
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="glass-panel" style={{ padding: '14px 16px', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Staff Members</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#3b82f6', margin: '2px 0 0 0' }}>
            {totalStaffCount}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px 16px', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Active Cashiers</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', margin: '2px 0 0 0' }}>
            {activeStaffCount} Active
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px 16px', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Shift Revenue</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b', margin: '2px 0 0 0' }}>
            {settings.currency}{totalStaffSales.toLocaleString()}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px 16px', borderLeft: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Current Session</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>
              {currentUser?.name || 'Master Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* STAFF LIST & SALES BREAKDOWN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Employee Credentials & Sales Ledger
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '14px'
        }}>
          {staffList.map((staff) => {
            const stats = staffSalesAnalytics[staff.id] || { totalSales: 0, billsCount: 0, cashCollected: 0, upiCollected: 0, cardCollected: 0 };
            const isRevealed = Boolean(showPinInTable[staff.id]);
            const avgBill = stats.billsCount > 0 ? Math.round(stats.totalSales / stats.billsCount) : 0;

            return (
              <div
                key={staff.id}
                className="glass-panel card-hover"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {/* Top Profile */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '800'
                    }}>
                      {staff.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        {staff.name}
                      </h4>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        @{staff.username} • {staff.role}
                      </span>
                    </div>
                  </div>

                  <span className={`badge badge-${staff.active !== false ? 'success' : 'secondary'}`} style={{ fontSize: '10px' }}>
                    {staff.active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Login Credentials Box */}
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '10.5px', display: 'block' }}>Login Username:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{staff.username}</strong>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '10.5px', display: 'block' }}>Login PIN / Password:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ fontWeight: '800', color: '#10b981', letterSpacing: isRevealed ? '2px' : '4px' }}>
                        {isRevealed ? staff.pin : '••••'}
                      </span>
                      <button
                        onClick={() => togglePinVisibility(staff.id)}
                        className="btn-icon"
                        style={{ padding: '2px', color: 'var(--text-muted)' }}
                        title="Reveal / Hide PIN"
                      >
                        {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shift Sales Accountability Strip */}
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.05)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Shift Sales:</span>
                    <span className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>
                      {settings.currency}{stats.totalSales.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                    <span>{stats.billsCount} Bills Generated</span>
                    <span>Avg: {settings.currency}{avgBill}/bill</span>
                  </div>

                  {/* Payment split breakdown */}
                  <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', borderTop: '1px dashed var(--border-color)', paddingTop: '4px', marginTop: '2px' }}>
                    <span style={{ color: '#10b981' }}>💵 Cash: {settings.currency}{stats.cashCollected}</span>
                    <span style={{ color: '#3b82f6' }}>📱 UPI: {settings.currency}{stats.upiCollected}</span>
                    <span style={{ color: '#8b5cf6' }}>💳 Card: {settings.currency}{stats.cardCollected}</span>
                  </div>
                </div>

                {/* Admin Actions */}
                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '4px' }}>
                  <button
                    onClick={() => {
                      setShowPinModal(staff);
                      setNewStaffPin(staff.pin);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '6px', fontSize: '11.5px', height: '30px', fontWeight: '600', gap: '4px' }}
                    title="Change password for this employee"
                  >
                    <KeyRound size={13} color="#10b981" /> Set PIN
                  </button>

                  <button
                    onClick={() => handleOpenEdit(staff)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '11.5px', height: '30px' }}
                    title="Edit Employee"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${staff.name}?`)) deleteStaffMember(staff.id);
                    }}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px', fontSize: '11.5px', height: '30px' }}
                    title="Delete Employee"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="modal-overlay" style={{ padding: '16px' }}>
          <div className="modal-container" style={{ maxWidth: '440px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus color="#10b981" size={18} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {editingStaff ? 'Edit Employee Details' : 'Add New Employee'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Full Employee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingStaff && !username) {
                      setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                    }
                  }}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Login PIN / Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1111"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="form-input mono"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Employee Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  >
                    <option value="Cashier">Cashier / Billing Counter</option>
                    <option value="Floor Server / Waiter">Floor Server / Waiter</option>
                    <option value="Service Technician">Service Technician</option>
                    <option value="Store Manager">Store Manager</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Mobile Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>
                  {editingStaff ? 'Save Changes' : 'Create Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE INDIVIDUAL STAFF PIN MODAL */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '380px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound color="#10b981" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Set PIN for {showPinModal.name}
                </h3>
              </div>
              <button onClick={() => setShowPinModal(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStaffPin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Assign a new login PIN/Password for <b>@{showPinModal.username}</b>:
              </p>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>New Employee PIN *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="e.g. 4321"
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value)}
                  className="form-input mono"
                  style={{ height: '36px', minHeight: '36px', fontSize: '14px', fontWeight: '800', textAlign: 'center' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowPinModal(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
