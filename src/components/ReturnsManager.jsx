import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Search, CheckCircle, Trash2, X, AlertCircle } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ReturnsManager() {
  const { returns, invoices, processReturn, settings } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [returnReason, setReturnReason] = useState('Damaged Product');
  const [returnItems, setReturnItems] = useState([]);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredReturns = returns.filter(
    (r) =>
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvoiceSelect = (invId) => {
    setSelectedInvoiceId(invId);
    const found = invoices.find((i) => i.id === invId);
    if (found) {
      setReturnItems(
        found.items.map((i) => ({
          ...i,
          maxQty: i.qty,
          returnQty: 0
        }))
      );
    } else {
      setReturnItems([]);
    }
  };

  const handleQtyChange = (itemId, qty) => {
    const parsed = parseFloat(qty) || 0;
    setReturnItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, returnQty: Math.min(i.maxQty, Math.max(0, parsed)) } : i))
    );
  };

  const totalRefund = returnItems.reduce((acc, i) => acc + (i.price * i.returnQty * (1 + i.taxRate / 100)), 0);

  const handleSubmitReturn = (e) => {
    e.preventDefault();
    const itemsToReturn = returnItems.filter((i) => i.returnQty > 0);
    if (itemsToReturn.length === 0) {
      alert('Please specify at least 1 item quantity to return.');
      return;
    }

    const origInv = invoices.find((i) => i.id === selectedInvoiceId);

    processReturn({
      invoiceId: selectedInvoiceId,
      customer: origInv?.customer || { name: 'Customer' },
      reason: returnReason,
      returnedItems: itemsToReturn,
      totalRefund: Math.round(totalRefund)
    });

    setShowAddModal(false);
    setSelectedInvoiceId('');
    setReturnItems([]);
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
      
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Sales Returns & Credit Notes
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Process customer returns, issue credit notes, and auto-restock inventory.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
          <Plus size={16} /> New Sales Return
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
        <input
          type="text"
          placeholder="Search by Credit Note #, Invoice #, or Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '42px', fontSize: '13.5px' }}
        />
      </div>

      {/* MOBILE VIEW: Returns Cards (<= 768px) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredReturns.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <RotateCcw size={36} opacity={0.3} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13.5px' }}>No sales returns processed yet.</p>
            </div>
          ) : (
            filteredReturns.map((r) => (
              <div
                key={r.id}
                className="glass-panel"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {r.id}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                      {r.customer?.name}
                    </h4>
                  </div>

                  <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                    Credit Note
                  </span>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Inv: {r.invoiceId}</span>
                  <span>{new Date(r.date).toLocaleDateString()}</span>
                </div>

                <div style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Refund Amount:</span>
                  <span className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#f43f5e' }}>
                    {settings.currency}{r.totalRefund.toLocaleString()}
                  </span>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Reason: <em>{r.reason}</em>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* DESKTOP VIEW: Table (> 768px) */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>CREDIT NOTE ID</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>DATE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>ORIGINAL INVOICE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>CUSTOMER</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>RETURN REASON</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>REFUND AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No sales returns recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: '800' }} className="mono">
                        {r.id}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px' }} className="mono">
                        {r.invoiceId}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600' }}>
                        {r.customer?.name}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {r.reason}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '14.5px', fontWeight: '800', textAlign: 'right', color: '#f43f5e' }} className="mono">
                        {settings.currency}{r.totalRefund.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Return Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '24px' }}>
          <div className="modal-container" style={{ maxWidth: '580px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Process Sales Return
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Select Original Invoice *</label>
                <select
                  className="form-select"
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceSelect(e.target.value)}
                  required
                >
                  <option value="">-- Choose Invoice to Return --</option>
                  {invoices.filter((i) => i.status !== 'Cancelled').map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.id} - {inv.customer?.name} ({settings.currency}{inv.grandTotal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Reason for Return</label>
                <select
                  className="form-select"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                >
                  <option value="Damaged / Defective Goods">Damaged / Defective Goods</option>
                  <option value="Customer Changed Mind">Customer Changed Mind</option>
                  <option value="Incorrect Item Sold">Incorrect Item Sold</option>
                  <option value="Expired Product">Expired Product</option>
                </select>
              </div>

              {returnItems.length > 0 && (
                <div>
                  <label className="form-label">Select Quantities to Restock & Refund:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {returnItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '10px',
                          backgroundColor: 'var(--bg-input)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            Rate: {settings.currency}{item.price}/{item.unit} (Sold: {item.maxQty})
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Return:</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            max={item.maxQty}
                            value={item.returnQty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            className="form-input"
                            style={{ width: '65px', padding: '4px', textAlign: 'center', height: '32px', fontSize: '13px', fontWeight: '700' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Credit Refund:</span>
                <span className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#f43f5e' }}>
                  {settings.currency}{Math.round(totalRefund).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
