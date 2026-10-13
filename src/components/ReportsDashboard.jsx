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
  Clock,
  Download,
  Users,
  Layers,
  Wallet
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ReportsDashboard() {
  const { invoices, products, customers, expenses, settings } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [dateRange, setDateRange] = useState('all'); // 'today' | '7d' | '30d' | 'all'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredByDateInvoices = useMemo(() => {
    const valid = (invoices || []).filter((i) => i.status !== 'Cancelled');
    if (dateRange === 'all') return valid;

    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    return valid.filter((inv) => {
      if (!inv.date) return true;
      if (dateRange === 'today') {
        return inv.date.startsWith(todayStr);
      }
      const invTime = new Date(inv.date).getTime();
      const diffDays = (now - invTime) / (1000 * 3600 * 24);
      if (dateRange === '7d') return diffDays <= 7;
      if (dateRange === '30d') return diffDays <= 30;
      return true;
    });
  }, [invoices, dateRange]);

  const totalRevenue = filteredByDateInvoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);
  const totalTaxCollected = filteredByDateInvoices.reduce((acc, i) => acc + (i.taxAmount || 0), 0);
  const totalInvoicesCount = filteredByDateInvoices.length;
  const totalDuesUnpaid = (customers || []).reduce((acc, c) => acc + (c.balance || 0), 0);
  const avgOrderValue = totalInvoicesCount > 0 ? Math.round(totalRevenue / totalInvoicesCount) : 0;

  const totalExpenses = useMemo(() => {
    return (expenses || []).reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
  }, [expenses]);

  const netProfit = Math.max(0, totalRevenue - totalExpenses - totalTaxCollected);

  const paymentBreakdown = useMemo(() => {
    const map = { UPI: 0, Cash: 0, Card: 0, Credit: 0, Split: 0 };
    filteredByDateInvoices.forEach((i) => {
      const pm = i.paymentMethod || 'Cash';
      map[pm] = (map[pm] || 0) + (i.grandTotal || 0);
    });
    return map;
  }, [filteredByDateInvoices]);

  const topProducts = useMemo(() => {
    const itemMap = {};
    filteredByDateInvoices.forEach((inv) => {
      (inv.items || []).forEach((item) => {
        if (!itemMap[item.id]) {
          itemMap[item.id] = { name: item.name, sku: item.sku, qty: 0, revenue: 0 };
        }
        itemMap[item.id].qty += item.qty;
        itemMap[item.id].revenue += item.price * item.qty;
      });
    });
    return Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [filteredByDateInvoices]);

  const categoryBreakdown = useMemo(() => {
    const catMap = {};
    filteredByDateInvoices.forEach((inv) => {
      (inv.items || []).forEach((item) => {
        const prod = (products || []).find((p) => p.id === item.id);
        const cat = prod?.category || 'General';
        catMap[cat] = (catMap[cat] || 0) + (item.price * item.qty);
      });
    });
    return Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredByDateInvoices, products]);

  const staffPerformance = useMemo(() => {
    const staffMap = {};
    filteredByDateInvoices.forEach((inv) => {
      const name = inv.cashierName || 'Master Admin';
      if (!staffMap[name]) {
        staffMap[name] = { name, orders: 0, revenue: 0 };
      }
      staffMap[name].orders += 1;
      staffMap[name].revenue += (inv.grandTotal || 0);
    });
    return Object.values(staffMap).sort((a, b) => b.revenue - a.revenue);
  }, [filteredByDateInvoices]);

  const handleExportReportCSV = () => {
    const headers = ['Invoice ID', 'Date', 'Customer', 'Cashier', 'Payment Mode', 'Subtotal', 'Tax', 'Grand Total', 'Status'];
    const rows = filteredByDateInvoices.map((inv) => [
      inv.id,
      new Date(inv.date).toLocaleString(),
      `"${inv.customer?.name || 'Walk-in'}"`,
      `"${inv.cashierName || 'Master Admin'}"`,
      inv.paymentMethod,
      inv.subtotal || 0,
      inv.taxAmount || 0,
      inv.grandTotal || 0,
      inv.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `SwiftBill_Analytics_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div style={{
      padding: isMobile ? '12px' : '20px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Top Header & Date Range Filter Bar */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Reports
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Date Filter Pills */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            gap: '2px'
          }}>
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: dateRange === tab.id ? 'var(--instamart-green)' : 'transparent',
                  color: dateRange === tab.id ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReportCSV}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px', height: '28px', gap: '4px' }}
          >
            <Download size={12} color="var(--instamart-green)" /> CSV
          </button>
        </div>
      </div>

      {/* 5 Compact KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)',
        gap: '10px'
      }}>
        <div className="stat-card-gradient" style={{ padding: '12px 14px', borderLeft: '3px solid #0c831f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Gross Sales</span>
            <TrendingUp size={14} color="#0c831f" />
          </div>
          <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#0c831f', margin: '4px 0 2px 0' }}>
            {settings.currency}{totalRevenue.toLocaleString()}
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Avg: {settings.currency}{avgOrderValue}/bill</span>
        </div>

        <div className="stat-card-gradient" style={{ padding: '12px 14px', borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Est. Net Profit</span>
            <Wallet size={14} color="#10b981" />
          </div>
          <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', margin: '4px 0 2px 0' }}>
            {settings.currency}{Math.round(netProfit).toLocaleString()}
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Expenses: {settings.currency}{totalExpenses.toLocaleString()}</span>
        </div>

        <div className="stat-card-gradient" style={{ padding: '12px 14px', borderLeft: '3px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>GST Collected</span>
            <DollarSign size={14} color="#3b82f6" />
          </div>
          <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', margin: '4px 0 2px 0' }}>
            {settings.currency}{totalTaxCollected.toFixed(0)}
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>CGST + SGST</span>
        </div>

        <div className="stat-card-gradient" style={{ padding: '12px 14px', borderLeft: '3px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Orders</span>
            <FileText size={14} color="#8b5cf6" />
          </div>
          <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0 2px 0' }}>
            {totalInvoicesCount}
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Completed Bills</span>
        </div>

        <div className="stat-card-gradient" style={{ padding: '12px 14px', borderLeft: '3px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Pending Udhar</span>
            <ShieldAlert size={14} color="#f43f5e" />
          </div>
          <h3 className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#f43f5e', margin: '4px 0 2px 0' }}>
            {settings.currency}{totalDuesUnpaid.toLocaleString()}
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Customer Credit</span>
        </div>
      </div>

      {/* Main Analytics Grid (2x2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px'
      }}>
        
        {/* 1. Payment Methods Split */}
        <div className="glass-panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={15} color="#0c831f" />
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Payment Mode Split</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              if (amount === 0 && method === 'Split') return null;
              const percentage = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0;
              const color = method === 'Cash' ? '#0c831f' : method === 'UPI' ? '#3b82f6' : method === 'Card' ? '#8b5cf6' : '#f59e0b';
              const Icon = method === 'Cash' ? Banknote : method === 'UPI' ? QrCode : method === 'Card' ? CreditCard : Clock;

              return (
                <div key={method} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={13} color={color} />
                      <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{method}</span>
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
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Top Selling Products */}
        <div className="glass-panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} color="#f59e0b" />
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Best Selling Items</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {topProducts.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                No sales recorded in this period.
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={p.sku || idx}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '13px' }}>{getRankBadge(idx)}</span>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </h4>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{p.sku}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className="mono" style={{ fontSize: '12px', fontWeight: '800', color: '#0c831f' }}>
                      {settings.currency}{p.revenue.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>
                      {p.qty} units
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Category Performance Breakdown */}
        <div className="glass-panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} color="#3b82f6" />
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Sales by Category</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categoryBreakdown.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                No category data available yet.
              </p>
            ) : (
              categoryBreakdown.map((cat) => {
                const pct = totalRevenue > 0 ? Math.min(100, ((cat.amount / totalRevenue) * 100)).toFixed(1) : 0;
                return (
                  <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{cat.name}</span>
                      <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {settings.currency}{cat.amount.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#3b82f6', borderRadius: 'var(--radius-full)' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. Cashier / Staff Sales Leaderboard */}
        <div className="glass-panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} color="#8b5cf6" />
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Staff Billing Leaderboard</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {staffPerformance.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                No cashier activity recorded yet.
              </p>
            ) : (
              staffPerformance.map((st, idx) => (
                <div
                  key={st.name}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px' }}>{getRankBadge(idx)}</span>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{st.name}</h4>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{st.orders} bills processed</span>
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: '12px', fontWeight: '800', color: '#8b5cf6' }}>
                    {settings.currency}{st.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
