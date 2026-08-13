import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  PieChart, 
  Award, 
  ShieldAlert,
  ArrowUpRight,
  CreditCard,
  Banknote,
  QrCode,
  Clock
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ReportsDashboard() {
  const { invoices, products, customers, settings } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeInvoices = useMemo(() => {
    return invoices.filter((i) => i.status !== 'Cancelled');
  }, [invoices]);

  const totalRevenue = activeInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalTaxCollected = activeInvoices.reduce((acc, i) => acc + i.taxAmount, 0);
  const totalInvoicesCount = activeInvoices.length;
  const totalDuesUnpaid = customers.reduce((acc, c) => acc + (c.balance || 0), 0);
  const avgOrderValue = totalInvoicesCount > 0 ? Math.round(totalRevenue / totalInvoicesCount) : 0;

  const paymentBreakdown = useMemo(() => {
    const map = { Cash: 0, UPI: 0, Card: 0, Credit: 0 };
    activeInvoices.forEach((i) => {
      const pm = i.paymentMethod || 'Cash';
      map[pm] = (map[pm] || 0) + i.grandTotal;
    });
    return map;
  }, [activeInvoices]);

  const topProducts = useMemo(() => {
    const itemMap = {};
    activeInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        if (!itemMap[item.id]) {
          itemMap[item.id] = { name: item.name, sku: item.sku, qty: 0, revenue: 0 };
        }
        itemMap[item.id].qty += item.qty;
        itemMap[item.id].revenue += item.price * item.qty;
      });
    });
    return Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [activeInvoices]);

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
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
      <div>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Sales Analytics & Reports
        </h2>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Real-time summary of revenue, tax collections, payment breakdown, and best sellers.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        
        <div className="glass-panel" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderLeft: '4px solid #10b981',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Gross Revenue</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(16,185,129,0.14)', borderRadius: 'var(--radius-sm)', color: '#10b981' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <h3 className="mono" style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: '#10b981', margin: 0 }}>
            {settings.currency}{totalRevenue.toLocaleString()}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Avg: {settings.currency}{avgOrderValue}/order</span>
        </div>

        <div className="glass-panel" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Tax Collected</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(59,130,246,0.14)', borderRadius: 'var(--radius-sm)', color: '#3b82f6' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <h3 className="mono" style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: '#3b82f6', margin: 0 }}>
            {settings.currency}{totalTaxCollected.toFixed(2)}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>CGST + SGST</span>
        </div>

        <div className="glass-panel" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Bills Generated</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(139,92,246,0.14)', borderRadius: 'var(--radius-sm)', color: '#8b5cf6' }}>
              <FileText size={16} />
            </div>
          </div>
          <h3 className="mono" style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
            {totalInvoicesCount}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Tax Invoices</span>
        </div>

        <div className="glass-panel" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderLeft: '4px solid #f43f5e'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Outstanding Due</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(244,63,94,0.14)', borderRadius: 'var(--radius-sm)', color: '#f43f5e' }}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <h3 className="mono" style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: '#f43f5e', margin: 0 }}>
            {settings.currency}{totalDuesUnpaid.toLocaleString()}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Customer credit</span>
        </div>

      </div>

      {/* Charts & Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '14px'
      }}>
        
        {/* Payment Methods Split */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="#10b981" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Revenue by Payment Mode</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const percentage = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0;
              const color = method === 'Cash' ? '#10b981' : method === 'UPI' ? '#3b82f6' : method === 'Card' ? '#8b5cf6' : '#f59e0b';
              const Icon = method === 'Cash' ? Banknote : method === 'UPI' ? QrCode : method === 'Card' ? CreditCard : Clock;

              return (
                <div key={method} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={14} color={color} />
                      <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{method}</span>
                    </div>
                    <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                      {settings.currency}{amount.toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>({percentage}%)</span>
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Top Selling Products</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topProducts.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center', padding: '24px' }}>
                No sales recorded yet.
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={p.sku}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', lineHeight: '1' }}>
                      {getRankBadge(idx)}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{p.name}</h4>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>{p.sku}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="mono" style={{ fontSize: '13.5px', fontWeight: '800', color: '#10b981' }}>
                      {p.qty} sold
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block' }}>
                      {settings.currency}{p.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
