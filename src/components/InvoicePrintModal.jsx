import React, { useState, useEffect } from 'react';
import { Printer, Download, X, FileText, CheckCircle2, Car, Utensils, Scale, ArrowLeft } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function InvoicePrintModal({ invoice, onClose }) {
  const { settings, activeBusinessId } = useBilling();
  
  // Mobile detection: default to 'thermal' on mobile for perfect phone fit, 'a4' on desktop
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [printFormat, setPrintFormat] = useState(typeof window !== 'undefined' && window.innerWidth <= 768 ? 'thermal' : 'a4');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(invoice.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="modal-overlay" style={{ padding: isMobile ? '8px' : '20px' }}>
      <div className="modal-container" style={{
        maxWidth: '900px',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: isMobile ? '96vh' : '90vh',
        borderRadius: isMobile ? '12px' : '18px'
      }}>
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print" style={{
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-card)',
          gap: isMobile ? '10px' : '16px'
        }}>
          {/* Header title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 color="#10b981" size={20} />
              <div>
                <h3 style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Invoice {invoice.id}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {invoice.status} • {invoice.paymentMethod}
                </span>
              </div>
            </div>

            {isMobile && (
              <button onClick={onClose} className="btn-icon" style={{ padding: '6px' }}>
                <X size={20} />
              </button>
            )}
          </div>

          {/* Action buttons row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {/* Format toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px',
              flex: isMobile ? 1 : 'none'
            }}>
              <button
                onClick={() => setPrintFormat('thermal')}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: printFormat === 'thermal' ? 'var(--instamart-green)' : 'transparent',
                  color: printFormat === 'thermal' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Thermal Slip (80mm)
              </button>

              <button
                onClick={() => setPrintFormat('a4')}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: printFormat === 'a4' ? 'var(--instamart-green)' : 'transparent',
                  color: printFormat === 'a4' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Standard A4 Invoice
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: '700',
                flex: isMobile ? 1 : 'none'
              }}
            >
              <Printer size={15} />
              Print Bill
            </button>

            {!isMobile && (
              <button onClick={onClose} className="btn-icon" style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Invoice View Area */}
        <div style={{
          padding: isMobile ? '12px' : '28px',
          backgroundColor: '#f1f5f9',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <div className="printable-area" style={{ width: '100%', maxWidth: '820px' }}>
            
            {/* THERMAL 80MM RECEIPT FORMAT (Default for Mobile) */}
            {printFormat === 'thermal' && (
              <div className="thermal-receipt" style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                maxWidth: '340px',
                width: '100%',
                margin: '0 auto',
                padding: isMobile ? '14px' : '20px',
                fontFamily: 'monospace',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{settings.storeName}</h2>
                  <p style={{ fontSize: '11px', margin: '0' }}>{settings.address}</p>
                  <p style={{ fontSize: '11px', margin: '0' }}>Ph: {settings.phone}</p>
                  {settings.gstin && <p style={{ fontSize: '10.5px', margin: '0' }}>GSTIN: {settings.gstin}</p>}
                </div>

                <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>INV: {invoice.id}</span>
                    <span>{formattedDate}</span>
                  </div>
                  <div>CUST: {invoice.customer?.name}</div>
                  <div>CASHIER: {invoice.cashierName || invoice.cashier?.name || 'Master Admin'}</div>
                  {invoice.automotiveDetails?.vehicleNo && <div>VEHICLE: {invoice.automotiveDetails.vehicleNo}</div>}
                  {invoice.restaurantDetails?.tableNo && <div>TABLE: {invoice.restaurantDetails.tableNo} ({invoice.restaurantDetails.orderType})</div>}
                </div>

                <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px dashed #000' }}>
                      <th style={{ paddingBottom: '4px' }}>ITEM</th>
                      <th style={{ textAlign: 'center', paddingBottom: '4px' }}>QTY</th>
                      <th style={{ textAlign: 'right', paddingBottom: '4px' }}>AMT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '3px 0' }}>{item.name.slice(0, 16)}</td>
                        <td style={{ textAlign: 'center', padding: '3px 0' }}>{item.qty}{item.unit || ''}</td>
                        <td style={{ textAlign: 'right', padding: '3px 0' }}>{(Math.round(item.price * item.qty * 100) / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>

                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>{settings.currency}{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Discount ({invoice.discountPercent}%):</span>
                      <span>-{settings.currency}{invoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (CGST+SGST):</span>
                    <span>{settings.currency}{invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginTop: '4px',
                    borderTop: '1px dashed #000',
                    paddingTop: '4px'
                  }}>
                    <span>TOTAL:</span>
                    <span>{settings.currency}{invoice.grandTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: '2px' }}>
                    <span>Payment Mode:</span>
                    <span>{invoice.paymentMethod}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #000', margin: '10px 0 6px 0' }}></div>
                <div style={{ textAlign: 'center', fontSize: '10.5px' }}>
                  *** THANK YOU FOR VISITING ***
                </div>
              </div>
            )}

            {/* STANDARD A4 FORMAT */}
            {printFormat === 'a4' && (
              <div className="a4-invoice" style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                padding: isMobile ? '16px' : '36px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                width: '100%',
                margin: '0 auto',
                overflowX: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: isMobile ? '12px' : '20px',
                  gap: isMobile ? '12px' : '20px'
                }}>
                  <div>
                    <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: '#0f172a', margin: '0' }}>
                      {settings.storeName}
                    </h1>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0 0' }}>{settings.tagline}</p>
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '3px 0 0 0' }}>{settings.address}</p>
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0 0 0' }}>Ph: {settings.phone} | {settings.email}</p>
                    {settings.gstin && (
                      <p style={{ fontSize: '11.5px', fontWeight: '700', color: '#0f172a', margin: '3px 0 0 0' }}>
                        GSTIN / Tax ID: {settings.gstin}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '12px',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      TAX INVOICE
                    </span>
                    <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '6px', margin: '6px 0 0 0' }}>
                      {invoice.id}
                    </h2>
                    <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Date: {formattedDate}</p>
                    <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Payment Mode: <strong>{invoice.paymentMethod}</strong></p>
                  </div>
                </div>

                {/* Customer Details */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #e2e8f0',
                  gap: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                      BILLED TO
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '2px 0 0 0' }}>
                      {invoice.customer?.name}
                    </h3>
                    {invoice.customer?.phone !== '-' && (
                      <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0 0' }}>Ph: {invoice.customer?.phone}</p>
                    )}
                  </div>

                  {invoice.automotiveDetails?.vehicleNo && (
                    <div style={{ padding: '6px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                        VEHICLE
                      </span>
                      <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: '0' }}>
                        {invoice.automotiveDetails.vehicleNo}
                      </p>
                      {invoice.automotiveDetails.vehicleModel && (
                        <p style={{ fontSize: '11px', color: '#475569', margin: '0' }}>{invoice.automotiveDetails.vehicleModel}</p>
                      )}
                    </div>
                  )}

                  {invoice.restaurantDetails && (
                    <div style={{ padding: '6px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                        DINING TABLE
                      </span>
                      <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: '0' }}>
                        {invoice.restaurantDetails.tableNo} ({invoice.restaurantDetails.orderType})
                      </p>
                    </div>
                  )}

                  <div style={{ padding: '6px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                    <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                      BILLED BY / CASHIER
                    </span>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: '0' }}>
                      {invoice.cashierName || invoice.cashier?.name || 'Master Admin'}
                    </p>
                  </div>
                </div>

                {/* Items Table with Horizontal Scroll for Mobile */}
                <div style={{ overflowX: 'auto', width: '100%', marginTop: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '450px' : 'auto' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '11.5px', color: '#475569' }}>#</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '11.5px', color: '#475569' }}>Item Description</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '11.5px', color: '#475569' }}>Rate</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontSize: '11.5px', color: '#475569' }}>Qty</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '11.5px', color: '#475569' }}>Tax</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '11.5px', color: '#475569' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', fontSize: '12px', color: '#64748b' }}>{idx + 1}</td>
                          <td style={{ padding: '8px', fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>
                            {item.name}
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>SKU: {item.sku}</div>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>
                            {settings.currency}{item.price}/{item.unit || 'pcs'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>
                            {item.qty} {item.unit || 'pcs'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>
                            {item.taxRate}%
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '700' }}>
                            {settings.currency}{(Math.round(item.price * item.qty * 100) / 100).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '10px',
                  gap: isMobile ? '12px' : '20px'
                }}>
                  <div style={{ maxWidth: '350px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8' }}>TERMS & CONDITIONS</span>
                    <p style={{ fontSize: '10.5px', color: '#64748b', whiteSpace: 'pre-line', marginTop: '2px', lineHeight: '1.3' }}>
                      {settings.terms}
                    </p>
                  </div>

                  <div style={{ minWidth: isMobile ? '100%' : '240px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569' }}>
                      <span>Subtotal:</span>
                      <span>{settings.currency}{invoice.subtotal.toFixed(2)}</span>
                    </div>

                    {invoice.discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#16a34a' }}>
                        <span>Discount ({invoice.discountPercent}%):</span>
                        <span>-{settings.currency}{invoice.discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569' }}>
                      <span>GST Tax:</span>
                      <span>{settings.currency}{invoice.taxAmount.toFixed(2)}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '15px',
                      fontWeight: '800',
                      color: '#0f172a',
                      borderTop: '2px solid #0f172a',
                      paddingTop: '6px',
                      marginTop: '2px'
                    }}>
                      <span>GRAND TOTAL:</span>
                      <span>{settings.currency}{invoice.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Signature */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                    Thank you for your visit!
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '30px', borderBottom: '1px solid #cbd5e1', width: '130px' }}></div>
                    <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '700', display: 'block', marginTop: '3px' }}>
                      AUTHORIZED SIGNATORY
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
