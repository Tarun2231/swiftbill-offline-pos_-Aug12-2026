import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Search, 
  Trash2, 
  ArrowRightCircle, 
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function QuotationsManager({ onConvertInvoice }) {
  const { quotations, settings, convertQuotationToInvoice, deleteQuotation } = useBilling();
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = quotations.filter((q) =>
    q.id.toLowerCase().includes(search.toLowerCase()) ||
    q.customer?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConvert = (qtnId) => {
    const inv = convertQuotationToInvoice(qtnId);
    if (inv) {
      onConvertInvoice(inv);
    }
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
      <div>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Quotations & Price Estimates
        </h2>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Draft estimates for customers. Inventory stock is only deducted upon 1-click conversion to Tax Bill.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
        <input
          type="text"
          placeholder="Search by Quote ID or Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '42px', fontSize: '13.5px' }}
        />
      </div>

      {/* MOBILE VIEW: Quotation Cards (<= 768px) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <FileCheck size={36} opacity={0.3} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13.5px' }}>No price estimates created yet.</p>
            </div>
          ) : (
            filtered.map((qtn) => {
              const isConverted = qtn.status === 'Converted';

              return (
                <div
                  key={qtn.id}
                  className="glass-panel"
                  style={{
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity: isConverted ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {qtn.id}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                        {qtn.customer?.name}
                      </h4>
                    </div>

                    <span className={`badge badge-${isConverted ? 'success' : 'warning'}`}>
                      {qtn.status}
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
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Date: {new Date(qtn.date).toLocaleDateString()}
                    </span>

                    <span className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>
                      {settings.currency}{qtn.grandTotal.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                    {!isConverted && (
                      <button
                        onClick={() => handleConvert(qtn.id)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px' }}
                      >
                        <ArrowRightCircle size={14} /> Convert to Bill
                      </button>
                    )}

                    <button
                      onClick={() => deleteQuotation(qtn.id)}
                      className="btn-icon"
                      style={{ color: '#f43f5e', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
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
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>Quote ID</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>Customer</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>Total Estimate</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No price quotations created yet. Use the POS Billing counter to generate an estimate!
                    </td>
                  </tr>
                ) : (
                  filtered.map((qtn) => {
                    const isConverted = qtn.status === 'Converted';

                    return (
                      <tr key={qtn.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: isConverted ? 0.6 : 1 }} className="card-hover">
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--text-main)' }} className="mono">
                          {qtn.id}
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {new Date(qtn.date).toLocaleDateString()}
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '14px', color: 'var(--text-main)' }}>
                          {qtn.customer?.name}
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '15px', fontWeight: '800', textAlign: 'right', color: '#10b981' }} className="mono">
                          {settings.currency}{qtn.grandTotal.toLocaleString()}
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span className={`badge badge-${isConverted ? 'success' : 'warning'}`}>
                            {qtn.status}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            {!isConverted && (
                              <button
                                onClick={() => handleConvert(qtn.id)}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                title="Convert to Official Tax Bill & Deduct Stock"
                              >
                                <ArrowRightCircle size={14} />
                                Convert to Bill
                              </button>
                            )}

                            <button
                              onClick={() => deleteQuotation(qtn.id)}
                              className="btn-icon"
                              style={{ color: '#f43f5e' }}
                              title="Delete Quotation"
                            >
                              <Trash2 size={16} />
                            </button>
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
