import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Lock, 
  Unlock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Printer, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function CashShiftRegister() {
  const { currentShift, startShift, closeShift, addShiftPayout, settings } = useBilling();
  
  const [openingFloat, setOpeningFloat] = useState('1000');
  const [cashierName, setCashierName] = useState('Admin Cashier');
  const [closingActualCash, setClosingActualCash] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutReason, setPayoutReason] = useState('');
  const [showZReport, setShowZReport] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartShift = (e) => {
    e.preventDefault();
    startShift(openingFloat, cashierName);
  };

  const handlePayout = (e) => {
    e.preventDefault();
    if (!payoutAmount || !payoutReason.trim()) return;
    addShiftPayout(payoutAmount, payoutReason);
    setPayoutAmount('');
    setPayoutReason('');
  };

  const handleCloseShift = (e) => {
    e.preventDefault();
    closeShift(closingActualCash);
    setShowZReport(true);
  };

  const expectedCashInDrawer = currentShift 
    ? (currentShift.openingFloat + currentShift.cashSales - currentShift.payouts) 
    : 0;

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
        gap: isMobile ? '10px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Cash Register & Daily Shift
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Shift float reconciliation, mid-day cash withdrawals, and settlement Z-Reports.
          </p>
        </div>

        <div>
          <span className={`badge badge-${currentShift?.isOpen ? 'success' : 'warning'}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
            {currentShift?.isOpen ? '🟢 Shift Active & Open' : '🔒 Shift Closed'}
          </span>
        </div>
      </div>

      {/* SHIFT IS CLOSED: OPENING SCREEN */}
      {!currentShift?.isOpen ? (
        <div className="glass-panel" style={{ padding: isMobile ? '20px 16px' : '36px', maxWidth: '500px', margin: '10px auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16,185,129,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#10b981'
            }}>
              <Unlock size={26} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)' }}>
              Open New Cash Shift
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Count cash in drawer and enter starting opening float.
            </p>
          </div>

          <form onSubmit={handleStartShift} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Cashier / Staff Name</label>
              <input
                type="text"
                required
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Opening Float Cash ({settings.currency}) *</label>
              <input
                type="number"
                required
                step="1"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
                className="form-input"
                placeholder="1000"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '14.5px', marginTop: '6px' }}>
              <Unlock size={16} /> Start Today's Shift
            </button>
          </form>
        </div>
      ) : (
        /* SHIFT IS ACTIVE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Opening Float</span>
              <div className="mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                {settings.currency}{currentShift.openingFloat.toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Cashier: {currentShift.cashier}
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Cash Sales</span>
              <div className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                +{settings.currency}{currentShift.cashSales.toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                {currentShift.salesCount || 0} Bills Paid in Cash
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Payouts / Withdrawals</span>
              <div className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#f43f5e', marginTop: '4px' }}>
                -{settings.currency}{currentShift.payouts.toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Mid-day Cash Drops
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '16px', border: '1.5px solid #10b981' }}>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}>Expected Drawer Cash</span>
              <div className="mono" style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                {settings.currency}{expectedCashInDrawer.toLocaleString()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Float + Sales - Payouts
              </span>
            </div>
          </div>

          {/* Action Columns: Mid-day Payout & Shift Settlement */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px'
          }}>
            {/* Mid-day Cash Drop Form */}
            <div className="glass-panel" style={{ padding: isMobile ? '16px' : '22px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
                Record Cash Payout / Vendor Drop
              </h3>
              <form onSubmit={handlePayout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="form-label">Withdrawal Amount ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    placeholder="e.g. 500"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Reason / Expense Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vendor Milk Payment, Safe Drop"
                    value={payoutReason}
                    onChange={(e) => setPayoutReason(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-secondary" style={{ padding: '10px', fontSize: '13px' }}>
                  <ArrowDownRight size={15} color="#f43f5e" /> Record Cash Outflow
                </button>
              </form>
            </div>

            {/* End Day Shift Closing */}
            <div className="glass-panel" style={{ padding: isMobile ? '16px' : '22px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
                Close Shift & Print Z-Report
              </h3>
              <form onSubmit={handleCloseShift} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="form-label">Actual Physical Cash Counted ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    placeholder={`Expected: ${expectedCashInDrawer}`}
                    value={closingActualCash}
                    onChange={(e) => setClosingActualCash(e.target.value)}
                    className="form-input"
                  />
                </div>

                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Closing the shift will freeze the cash balance, calculate any cash over/short discrepancies, and generate the end-of-day Z-Report.
                </p>

                <button type="submit" className="btn btn-danger" style={{ padding: '10px', fontSize: '13.5px' }}>
                  <Lock size={15} /> Close Shift & Generate Z-Report
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* PRINTABLE Z-REPORT MODAL */}
      {showZReport && currentShift && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '24px' }}>
          <div className="modal-container" style={{ maxWidth: '420px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Receipt size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                DAILY SHIFT Z-REPORT
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {new Date().toLocaleString()}
              </span>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Opening Cash Float:</span>
                <span className="mono">{settings.currency}{currentShift.openingFloat}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Cash Sales:</span>
                <span className="mono">+{settings.currency}{currentShift.cashSales}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Cash Payouts:</span>
                <span className="mono">-{settings.currency}{currentShift.payouts}</span>
              </div>
              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>Expected Cash in Drawer:</span>
                <span className="mono">{settings.currency}{expectedCashInDrawer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#10b981' }}>
                <span>Actual Counted Cash:</span>
                <span className="mono">{settings.currency}{currentShift.closingActualCash || expectedCashInDrawer}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1 }}>
                <Printer size={16} /> Print Z-Report
              </button>
              <button onClick={() => setShowZReport(false)} className="btn btn-secondary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
