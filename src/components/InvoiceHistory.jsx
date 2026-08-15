import React, { useState, useEffect } from 'react';
import { Search, Eye, XCircle, FileText, Calendar, Filter } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function InvoiceHistory({ onViewInvoice }) {
  const { invoices, cancelInvoice, settings } = useBilling();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.automotiveDetails?.vehicleNo && inv.automotiveDetails.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchPayment = paymentFilter === 'All' || inv.paymentMethod === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  const totalSalesRevenue = invoices
    .filter((i) => i.status !== 'Cancelled')
    .reduce((acc, i) => acc + i.grandTotal, 0);

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '22px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header & Revenue Summary */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Invoice History & Sales Records
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Past invoices, tax bills, thermal slips, and cancellation records.
          </p>
        </div>

        <div className="glass-panel" style={{
          padding: isMobile ? '10px 16px' : '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Invoiced:</span>
          <span className="mono" style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: '#10b981' }}>
            {settings.currency}{totalSalesRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
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
            placeholder="Search by Invoice #, Customer, or Vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '42px', fontSize: '13.5px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', minWidth: isMobile ? 'auto' : '360px' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ fontSize: '12.5px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className="form-select"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{ fontSize: '12.5px' }}
          >
            <option value="All">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI QR</option>
            <option value="Card">Card</option>
            <option value="Credit">Credit (Udhar)</option>
          </select>
        </div>
      </div>

      {/* MOBILE VIEW: Invoice Cards (<= 768px) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredInvoices.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <FileText size={36} opacity={0.3} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13.5px' }}>No invoices found matching your filter.</p>
            </div>
          ) : (
            filteredInvoices.map((inv) => {
              const isCancelled = inv.status === 'Cancelled';
              const formattedDate = new Date(inv.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={inv.id}
                  className="glass-panel"
                  style={{
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity: isCancelled ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {inv.id}
                      </span>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                        {inv.customer?.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        👤 Cashier: <strong>{inv.cashierName || inv.cashier?.name || 'Master Admin'}</strong>
                      </div>
                    </div>

                    <span className={`badge badge-${
                      inv.status === 'Paid' ? 'success' : inv.status === 'Cancelled' ? 'danger' : 'warning'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formattedDate} • {inv.paymentMethod}</span>
                    <span>{inv.items.length} items</span>
                  </div>

                  {inv.automotiveDetails?.vehicleNo && (
                    <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600' }}>
                      🚗 Vehicle: {inv.automotiveDetails.vehicleNo}
                    </div>
                  )}

                  {inv.restaurantDetails?.tableNo && (
                    <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>
                      🍽️ {inv.restaurantDetails.tableNo} ({inv.restaurantDetails.orderType})
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '2px'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Amount:</span>
                    <span className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>
                      {settings.currency}{inv.grandTotal.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                    <button
                      onClick={() => onViewInvoice(inv)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
                    >
                      <Eye size={13} /> View & Print Bill
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Cancel Invoice ${inv.id}? Stock will be returned.`)) {
                            cancelInvoice(inv.id);
                          }
                        }}
                        className="btn btn-danger"
                        style={{ padding: '7px 10px', fontSize: '12px' }}
                        title="Cancel Invoice"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* DESKTOP VIEW: Data Table (> 768px) */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>INVOICE ID</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>DATE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>CUSTOMER</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>ITEMS</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>PAYMENT</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>AMOUNT</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>STATUS</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No invoices found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isCancelled = inv.status === 'Cancelled';
                    const formattedDate = new Date(inv.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: isCancelled ? 0.6 : 1 }}>
                        <td style={{ padding: '14px 18px' }}>
                          <span className="mono" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                            {inv.id}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '12.5px', color: 'var(--text-dim)' }}>
                          {formattedDate}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                            {inv.customer?.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            👤 Billed by: <strong style={{ color: 'var(--text-main)' }}>{inv.cashierName || inv.cashier?.name || 'Master Admin'}</strong>
                          </div>
                          {inv.automotiveDetails?.vehicleNo && (
                            <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600' }}>
                              🚗 {inv.automotiveDetails.vehicleNo}
                            </div>
                          )}
                          {inv.restaurantDetails?.tableNo && (
                            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>
                              🍽️ {inv.restaurantDetails.tableNo}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {inv.items.length} items
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {inv.paymentMethod}
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '14.5px', fontWeight: '800', textAlign: 'right' }} className="mono">
                          {settings.currency}{inv.grandTotal.toLocaleString()}
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span className={`badge badge-${
                            inv.status === 'Paid' ? 'success' : inv.status === 'Cancelled' ? 'danger' : 'warning'
                          }`}>
                            {inv.status}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => onViewInvoice(inv)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              title="View & Print Invoice"
                            >
                              <Eye size={13} /> View
                            </button>

                            {!isCancelled && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Cancel Invoice ${inv.id}? Stock will be returned.`)) {
                                    cancelInvoice(inv.id);
                                  }
                                }}
                                className="btn btn-danger"
                                style={{ padding: '6px 8px', fontSize: '12px' }}
                                title="Cancel Invoice"
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
