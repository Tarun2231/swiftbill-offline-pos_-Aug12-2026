import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  DollarSign, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  CheckCircle2,
  History,
  ShoppingBag,
  Calendar,
  Eye,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import InvoicePrintModal from './InvoicePrintModal';

export default function CustomerLedger() {
  const { customers, invoices, addCustomer, recordCustomerPayment, settings } = useBilling();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustForPayment, setSelectedCustForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedCustForHistory, setSelectedCustForHistory] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [historySearch, setHistorySearch] = useState('');

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // New Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const totalOutstanding = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

  // Helper to get customer purchase orders
  const getCustomerInvoices = (customer) => {
    if (!customer) return [];
    return invoices.filter((inv) => 
      (inv.customer?.id && inv.customer.id === customer.id) ||
      (inv.customer?.name && inv.customer.name.toLowerCase() === customer.name.toLowerCase()) ||
      (customer.phone !== '-' && inv.customer?.phone && inv.customer.phone === customer.phone)
    );
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name,
      phone: phone || '-',
      email: email || '-',
      address: address || '-',
      gstin: gstin || '-',
      balance: parseFloat(openingBalance) || 0
    });

    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setGstin('');
    setOpeningBalance('');
    setShowAddModal(false);
  };

  const handleSettlePayment = (e) => {
    e.preventDefault();
    if (!selectedCustForPayment || !paymentAmount) return;

    recordCustomerPayment(selectedCustForPayment.id, paymentAmount);
    setSelectedCustForPayment(null);
    setPaymentAmount('');
  };

  // Metrics for customer currently opened in History modal
  const customerHistoryInvoices = useMemo(() => {
    if (!selectedCustForHistory) return [];
    return getCustomerInvoices(selectedCustForHistory);
  }, [selectedCustForHistory, invoices]);

  const customerFilteredHistory = useMemo(() => {
    if (!historySearch.trim()) return customerHistoryInvoices;
    return customerHistoryInvoices.filter((inv) =>
      inv.id.toLowerCase().includes(historySearch.toLowerCase()) ||
      inv.items.some((i) => i.name.toLowerCase().includes(historySearch.toLowerCase()))
    );
  }, [customerHistoryInvoices, historySearch]);

  const customerTotalLifetimeSpent = customerHistoryInvoices.reduce((acc, i) => acc + i.grandTotal, 0);

  // Aggregate items purchased by customer
  const customerTopPurchasedItems = useMemo(() => {
    const map = {};
    customerHistoryInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = { name: item.name, totalQty: 0, unit: item.unit || 'pcs', totalSpend: 0 };
        }
        map[item.name].totalQty += item.qty;
        map[item.name].totalSpend += (item.price * item.qty);
      });
    });
    return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
  }, [customerHistoryInvoices]);

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '22px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header & Stats Cards */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Customer Ledger & Order Records
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Track complete customer purchase logs, items bought, order dates, and credit balances.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Registered Customers</span>
          <h3 className="mono" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            {customers.length}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Customers with Dues</span>
          <h3 className="mono" style={{ fontSize: '22px', fontWeight: '800', color: '#f59e0b', margin: 0 }}>
            {customers.filter((c) => (c.balance || 0) > 0).length}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Outstanding Due</span>
          <h3 className="mono" style={{ fontSize: '22px', fontWeight: '800', color: '#f43f5e', margin: 0 }}>
            {settings.currency}{totalOutstanding.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
        <input
          type="text"
          placeholder="Search by customer name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '42px', fontSize: '13.5px' }}
        />
      </div>

      {/* MOBILE VIEW: Customer Cards (<= 768px) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCustomers.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <Users size={36} opacity={0.3} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13.5px' }}>No customer records found.</p>
            </div>
          ) : (
            filteredCustomers.map((c) => {
              const hasDue = (c.balance || 0) > 0;
              const pastInvoices = getCustomerInvoices(c);

              return (
                <div
                  key={c.id}
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
                      <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                        {c.name}
                      </h4>
                      {c.phone !== '-' && (
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginTop: '2px' }}>
                          Ph: {c.phone}
                        </span>
                      )}
                    </div>

                    <span className="badge" style={{ backgroundColor: hasDue ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)', color: hasDue ? '#f43f5e' : '#10b981' }}>
                      {hasDue ? 'Has Due' : 'All Clear'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Total Bills:</span>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {pastInvoices.length} Orders
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due Balance:</span>
                      <div className="mono" style={{ fontSize: '15px', fontWeight: '800', color: hasDue ? '#f43f5e' : '#10b981' }}>
                        {settings.currency}{(c.balance || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', paddingTop: '2px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedCustForHistory(c)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '7px 10px', fontSize: '11.5px' }}
                    >
                      <History size={13} /> Orders ({pastInvoices.length})
                    </button>

                    {hasDue && c.phone && c.phone !== '-' && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${c.name}, this is a gentle payment reminder from ${settings.storeName || 'our store'}. Your outstanding balance is ${settings.currency}${c.balance}. Kindly clear at your earliest convenience. Thank you!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '7px 10px', fontSize: '11.5px', color: '#25D366', borderColor: 'rgba(37,211,102,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Send WhatsApp Payment Reminder"
                      >
                        📱 WhatsApp
                      </a>
                    )}

                    {hasDue && (
                      <button
                        onClick={() => setSelectedCustForPayment(c)}
                        className="btn btn-primary"
                        style={{ padding: '7px 10px', fontSize: '11.5px', fontWeight: '700' }}
                      >
                        <DollarSign size={13} /> Settle Due
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
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>CUSTOMER NAME</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>PHONE NUMBER</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>ORDER HISTORY</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>DUE BALANCE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => {
                    const hasDue = (c.balance || 0) > 0;
                    const pastInvoices = getCustomerInvoices(c);

                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{c.address}</div>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {c.phone}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <button
                            onClick={() => setSelectedCustForHistory(c)}
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '11.5px', gap: '5px' }}
                            title="View what this customer purchased & dates"
                          >
                            <History size={13} color="#10b981" />
                            {pastInvoices.length} Bills • View Purchases
                          </button>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '14.5px', fontWeight: '800', textAlign: 'right' }} className="mono">
                          <span style={{ color: hasDue ? '#f43f5e' : '#10b981' }}>
                            {settings.currency}{(c.balance || 0).toLocaleString()}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {hasDue && c.phone && c.phone !== '-' && (
                              <a
                                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${c.name}, this is a gentle payment reminder from ${settings.storeName || 'our store'}. Your outstanding balance is ${settings.currency}${c.balance}. Kindly clear at your earliest convenience. Thank you!`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-secondary"
                                style={{ padding: '6px 10px', fontSize: '11.5px', color: '#25D366', borderColor: 'rgba(37,211,102,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Send WhatsApp Payment Reminder"
                              >
                                📱 Reminder
                              </a>
                            )}
                            {hasDue ? (
                              <button
                                onClick={() => setSelectedCustForPayment(c)}
                                className="btn btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '12px', color: '#10b981' }}
                              >
                                <DollarSign size={13} /> Record Payment
                              </button>
                            ) : (
                              <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>All Clear</span>
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

      {/* CUSTOMER DETAILED PURCHASE HISTORY MODAL */}
      {selectedCustForHistory && (
        <div className="modal-overlay" style={{ padding: isMobile ? '8px' : '24px' }}>
          <div className="modal-container" style={{
            maxWidth: '850px',
            padding: isMobile ? '16px' : '28px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={22} color="#10b981" />
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {selectedCustForHistory.name}'s Purchase History
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', margin: '3px 0 0 0' }}>
                  Phone: {selectedCustForHistory.phone} {selectedCustForHistory.gstin !== '-' ? `• GST: ${selectedCustForHistory.gstin}` : ''}
                </p>
              </div>

              <button onClick={() => setSelectedCustForHistory(null)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            {/* Customer Lifetime KPI Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Orders Placed</span>
                <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                  {customerHistoryInvoices.length} Bills
                </div>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lifetime Total Spend</span>
                <div className="mono" style={{ fontSize: '17px', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                  {settings.currency}{customerTotalLifetimeSpent.toLocaleString()}
                </div>
              </div>

              <div style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                gridColumn: isMobile ? 'span 2' : 'auto'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Due Balance</span>
                <div className="mono" style={{ fontSize: '17px', fontWeight: '800', color: (selectedCustForHistory.balance || 0) > 0 ? '#f43f5e' : '#10b981', marginTop: '2px' }}>
                  {settings.currency}{(selectedCustForHistory.balance || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Top Purchased Items Quick Pill Bar */}
            {customerTopPurchasedItems.length > 0 && (
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Items Frequently Bought by {selectedCustForHistory.name}:
                </span>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {customerTopPurchasedItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11.5px',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShoppingBag size={12} color="#10b981" />
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</span>
                      <span className="badge badge-success" style={{ fontSize: '10px', padding: '1px 5px' }}>
                        {item.totalQty} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Search inside orders */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="text"
                placeholder="Search items bought, invoice #..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', height: '38px', fontSize: '12.5px' }}
              />
            </div>

            {/* Order History Timeline List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '2px' }}>
              {customerFilteredHistory.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <ShoppingBag size={36} opacity={0.3} style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '13.5px' }}>No purchase records found for this customer.</p>
                </div>
              ) : (
                customerFilteredHistory.map((inv) => {
                  const formattedDate = new Date(inv.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={inv.id}
                      style={{
                        padding: '14px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      {/* Order top bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="mono" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                            {inv.id}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '10.5px' }}>
                            {inv.paymentMethod}
                          </span>
                          <span className={`badge badge-${inv.status === 'Paid' ? 'success' : 'warning'}`} style={{ fontSize: '10.5px' }}>
                            {inv.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>
                            {formattedDate}
                          </span>

                          <button
                            onClick={() => setViewingInvoice(inv)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            <Eye size={12} /> View Bill
                          </button>
                        </div>
                      </div>

                      {/* Items Purchased in this Bill */}
                      <div style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                          Items Purchased in this Order ({inv.items.length}):
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {inv.items.map((item, iIdx) => (
                            <div key={iIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                              <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                                • {item.name} <span style={{ color: 'var(--text-dim)', fontWeight: 'normal' }}>({item.qty} {item.unit || 'pcs'} @ {settings.currency}{item.price})</span>
                              </span>
                              <span className="mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                                {settings.currency}{(Math.round(item.price * item.qty * 100) / 100).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bill Total Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>
                          {inv.automotiveDetails?.vehicleNo ? `🚗 Vehicle: ${inv.automotiveDetails.vehicleNo}` : ''}
                          {inv.restaurantDetails?.tableNo ? `🍽️ ${inv.restaurantDetails.tableNo}` : ''}
                        </span>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '6px' }}>Grand Total:</span>
                          <span className="mono" style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>
                            {settings.currency}{inv.grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '24px' }}>
          <div className="modal-container" style={{ maxWidth: '520px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Add New Customer
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    placeholder="27AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  placeholder="Shop / Area, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Opening Due Balance ({settings.currency})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Customer Payment Modal */}
      {selectedCustForPayment && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '24px' }}>
          <div className="modal-container" style={{ maxWidth: '420px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Record Payment Receipt
              </h3>
              <button onClick={() => setSelectedCustForPayment(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              <div style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                {selectedCustForPayment.name}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Current Due: <strong style={{ color: '#f43f5e' }}>{settings.currency}{selectedCustForPayment.balance.toLocaleString()}</strong>
              </div>
            </div>

            <form onSubmit={handleSettlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Amount Paid ({settings.currency}) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedCustForPayment.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="form-input"
                  placeholder="Enter amount"
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setSelectedCustForPayment(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Viewer Modal */}
      {viewingInvoice && (
        <InvoicePrintModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
}
