import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  PieChart, 
  Award, 
  ShieldAlert,
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
      padding: isMobile ? '12px' : '20px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '10px' : '16px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          Reports
        </h2>
        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Sales & breakdown
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '8px'
      }}>
        
        <div className="glass-panel" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          borderLeft: '3px solid #0c831f'
        }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Revenue</span>
          <h3 className="mono" style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#0c831f', margin: 0 }}>
            {settings.currency}{totalRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="glass-panel" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          borderLeft: '3px solid #3b82f6'
        }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Tax</span>
          <h3 className="mono" style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#3b82f6', margin: 0 }}>
            {settings.currency}{totalTaxCollected.toFixed(2)}
          </h3>
        </div>

        <div className="glass-panel" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          borderLeft: '3px solid #8b5cf6'
        }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Bills</span>
          <h3 className="mono" style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            {totalInvoicesCount}
          </h3>
        </div>

        <div className="glass-panel" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          borderLeft: '3px solid #f43f5e'
        }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Dues</span>
          <h3 className="mono" style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#f43f5e', margin: 0 }}>
            {settings.currency}{totalDuesUnpaid.toLocaleString()}
          </h3>
        </div>

      </div>

      {/* Charts & Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '10px'
      }}>
        
        {/* Payment Methods Split */}
        <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={15} color="#0c831f" />
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Payments</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const percentage = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0;
              const color = method === 'Cash' ? '#0c831f' : method === 'UPI' ? '#3b82f6' : method === 'Card' ? '#8b5cf6' : '#f59e0b';
              const Icon = method === 'Cash' ? Banknote : method === 'UPI' ? QrCode : method === 'Card' ? CreditCard : Clock;

              return (
                <div key={method} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon size={12} color={color} />
                      <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{method}</span>
                    </div>
                    <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      {settings.currency}{amount.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} color="#f59e0b" />
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Top Items</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {topProducts.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                No sales yet.
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={p.sku}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px' }}>
                      {getRankBadge(idx)}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{p.name}</h4>
                      <span style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>{p.sku}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="mono" style={{ fontSize: '12px', fontWeight: '700', color: '#0c831f' }}>
                      {p.qty} sold
                    </span>
                    <span style={{ fontSize: '9.5px', color: 'var(--text-dim)', display: 'block' }}>
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
