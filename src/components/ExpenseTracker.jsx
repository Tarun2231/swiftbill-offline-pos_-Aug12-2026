import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, DollarSign, Calendar, Tag, FileText, X } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ExpenseTracker() {
  const { expenses, addExpense, deleteExpense, settings } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rent & Utilities');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [notes, setNotes] = useState('');

  const expenseCategories = [
    'Rent & Utilities',
    'Staff Salaries',
    'Supplies & Packaging',
    'Maintenance & Repairs',
    'Marketing & Ads',
    'Fuel & Transport',
    'Miscellaneous'
  ];

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCat === 'All' || e.category === selectedCat;
    return matchSearch && matchCat;
  });

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addExpense({
      title,
      category,
      amount: parseFloat(amount) || 0,
      paymentMode,
      notes
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '22px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header & Total Summary */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Business Expense Tracker
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Daily store expenses, staff wages, utilities, and vendor payouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Outflow:</span>
            <span className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#f43f5e' }}>
              {settings.currency}{totalExpenseAmount.toLocaleString()}
            </span>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '9px 16px', fontSize: '13px' }}>
            <Plus size={15} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '10px',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            placeholder="Search expenses by title or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '42px', fontSize: '13.5px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {['All', ...expenseCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedCat === cat ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: selectedCat === cat ? 'rgba(16,185,129,0.15)' : 'var(--bg-card)',
                color: selectedCat === cat ? '#10b981' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE VIEW: Expense Cards (<= 768px) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredExpenses.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <FileText size={36} opacity={0.3} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13.5px' }}>No expenses recorded.</p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="glass-panel"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                      {exp.title}
                    </h4>
                    <span className="badge badge-info" style={{ fontSize: '9.5px', marginTop: '4px' }}>
                      {exp.category}
                    </span>
                  </div>

                  <span className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#f43f5e' }}>
                    -{settings.currency}{exp.amount.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-dim)', paddingTop: '4px' }}>
                  <span>{new Date(exp.date).toLocaleDateString()} • {exp.paymentMode}</span>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="btn-icon"
                    style={{ color: '#f43f5e', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* DESKTOP VIEW: Data Table (> 768px) */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>TITLE / DESCRIPTION</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORY</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>DATE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>PAYMENT METHOD</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>AMOUNT</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No expenses recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{exp.title}</div>
                        {exp.notes && <div style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>{exp.notes}</div>}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span className="badge badge-info">{exp.category}</span>
                      </td>

                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {new Date(exp.date).toLocaleDateString()}
                      </td>

                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {exp.paymentMode}
                      </td>

                      <td style={{ padding: '14px 18px', fontSize: '14.5px', fontWeight: '800', textAlign: 'right', color: '#f43f5e' }} className="mono">
                        -{settings.currency}{exp.amount.toLocaleString()}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="btn-icon"
                          style={{ color: '#f43f5e' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '24px' }}>
          <div className="modal-container" style={{ maxWidth: '500px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Record Business Expense
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Bill, Staff Lunch, Packaging Boxes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Expense Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {expenseCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Amount ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Paid Via</label>
                <select
                  className="form-select"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="Cash">Cash (from Shift Drawer)</option>
                  <option value="UPI">UPI / Bank Transfer</option>
                  <option value="Card">Business Card</option>
                </select>
              </div>

              <div>
                <label className="form-label">Optional Notes</label>
                <input
                  type="text"
                  placeholder="Receipt # / Vendor details"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
