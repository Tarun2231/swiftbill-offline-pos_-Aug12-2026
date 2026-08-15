import React, { useState, useEffect } from 'react';
import { BillingProvider, useBilling } from './context/BillingContext';
import AdminPortal from './components/AdminPortal';
import Sidebar from './components/Sidebar';
import POSBilling from './components/POSBilling';
import ProductManagement from './components/ProductManagement';
import QuotationsManager from './components/QuotationsManager';
import InvoiceHistory from './components/InvoiceHistory';
import ReturnsManager from './components/ReturnsManager';
import RestaurantFloorplan from './components/RestaurantFloorplan';
import KitchenDisplayBoard from './components/KitchenDisplayBoard';
import ServiceJobTracker from './components/ServiceJobTracker';
import CashShiftRegister from './components/CashShiftRegister';
import ExpenseTracker from './components/ExpenseTracker';
import CustomerLedger from './components/CustomerLedger';
import BarcodePrinter from './components/BarcodePrinter';
import ReportsDashboard from './components/ReportsDashboard';
import SettingsBackup from './components/SettingsBackup';
import StaffManagement from './components/StaffManagement';
import InvoicePrintModal from './components/InvoicePrintModal';
import SwitchUserModal from './components/SwitchUserModal';
import { 
  ShoppingBag, 
  Car, 
  Utensils, 
  Package, 
  Plus, 
  X, 
  Store,
  Menu,
  Sun,
  Moon,
  Receipt,
  ArrowRightLeft,
  ChevronRight,
  UserCheck,
  LogOut,
  User 
} from 'lucide-react';

function MainApp() {
  const { theme, auth, currentUser, logout, activeBusinessId, activeBusiness, settings, switchBusiness, createBusiness, businesses, toggleTheme } = useBilling();
  const isAdmin = auth?.role === 'admin' || currentUser?.role === 'Master Admin';
  const [activeTab, setActiveTab] = useState('pos');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);
  const [showSwitchBusinessModal, setShowSwitchBusinessModal] = useState(false);
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState('Table 1');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // New Business Form State
  const [showAddBusinessForm, setShowAddBusinessForm] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizType, setNewBizType] = useState('Retail Store');
  const [newBizCurrency, setNewBizCurrency] = useState('₹');

  // Tab label mapping for breadcrumbs
  const tabTitles = {
    pos: 'POS Billing & Counter',
    floorplan: 'Table Floorplan & Seating',
    kds: 'Kitchen Display Board (KOT)',
    jobs: 'Vehicle Service Bay Cards',
    products: 'Inventory & Item Catalog',
    quotations: 'Price Quotations & Estimates',
    invoices: 'Invoice Records & History',
    returns: 'Sales Returns & Credit Notes',
    shift: 'Cash Shift & Daily Z-Report',
    staff: 'Staff & Shift Performance',
    expenses: 'Business Expense Tracker',
    customers: 'Customer Ledger & Udhar',
    barcode: 'Barcode & Sticker Generator',
    reports: 'Sales & Revenue Analytics',
    settings: 'Store Configuration & Backup'
  };

  // Business icon helper
  const getBusinessIcon = (id, size = 16) => {
    if (id === 'grocery') return <ShoppingBag size={size} />;
    if (id === 'automotive') return <Car size={size} />;
    if (id === 'restaurant') return <Utensils size={size} />;
    return <Package size={size} />;
  };

  const getBusinessColor = () => {
    if (activeBusinessId === 'grocery') return '#10b981';
    if (activeBusinessId === 'automotive') return '#3b82f6';
    if (activeBusinessId === 'restaurant') return '#f59e0b';
    return '#8b5cf6';
  };

  const bizColor = getBusinessColor();

  // Keyboard shortcut listener for POS fast key (F2)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('pos');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!auth.isAuthenticated) {
    return <AdminPortal />;
  }

  const handleCreateNewBusiness = (e) => {
    e.preventDefault();
    if (!newBizName.trim()) return;
    createBusiness({
      name: newBizName,
      type: newBizType,
      currency: newBizCurrency
    });
    setNewBizName('');
    setShowAddBusinessForm(false);
    setShowSwitchBusinessModal(false);
    setActiveTab('pos');
  };

  const handleSelectTableFromFloorplan = (tableName) => {
    setSelectedTableForOrder(tableName);
    setActiveTab('pos');
  };

  return (
    <div className="app-container" data-theme={theme}>
      
      {/* Mobile Sticky Navigation Header (<= 900px) */}
      <header className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button 
            onClick={() => setIsMobileNavOpen(true)} 
            className="btn-icon" 
            style={{ padding: '6px' }}
            title="Open Menu"
          >
            <Menu size={20} color="var(--text-main)" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ color: bizColor }}>{getBusinessIcon(activeBusinessId, 16)}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '800',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '140px'
              }}>
                {settings.storeName}
              </div>
              <div style={{ fontSize: '10px', color: bizColor, fontWeight: '700', lineHeight: '1' }}>
                {tabTitles[activeTab]?.split('&')[0]}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* User Session Pill (1-Tap Switch User / Account) */}
          <div
            onClick={() => setShowSwitchUserModal(true)}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--text-main)'
            }}
            title="Click to Switch User / Account (Cancellable anytime)"
          >
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: isAdmin ? '#10b981' : '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: '800'
            }}>
              {(currentUser?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.name?.split(' ')[0] || 'Staff'}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>▼</span>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowSwitchBusinessModal(true)}
              className="btn btn-secondary"
              style={{ padding: '5px 8px', fontSize: '11px', fontWeight: '700', gap: '4px' }}
            >
              <ArrowRightLeft size={12} color={bizColor} /> Switch
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn-icon"
            style={{ padding: '5px', color: theme === 'dark' ? '#fbbf24' : '#3b82f6' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Sidebar with Mobile Drawer capability */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSwitchBusiness={() => setShowSwitchBusinessModal(true)}
        onOpenSwitchUser={() => setShowSwitchUserModal(true)}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      
      <main className="main-content">

        {activeTab === 'pos' && (
          <POSBilling 
            onCompleteSale={(inv) => setSelectedInvoiceForPrint(inv)} 
            initialTable={selectedTableForOrder}
          />
        )}
        {activeTab === 'floorplan' && (
          <RestaurantFloorplan onSelectTableOrder={handleSelectTableFromFloorplan} />
        )}
        {activeTab === 'kds' && (
          <KitchenDisplayBoard />
        )}
        {activeTab === 'jobs' && (
          <ServiceJobTracker />
        )}
        {activeTab === 'shift' && (
          <CashShiftRegister />
        )}
        {activeTab === 'staff' && (
          isAdmin ? (
            <StaffManagement />
          ) : (
            <POSBilling 
              onCompleteSale={(inv) => setSelectedInvoiceForPrint(inv)} 
              initialTable={selectedTableForOrder}
            />
          )
        )}
        {activeTab === 'products' && (
          <ProductManagement />
        )}
        {activeTab === 'quotations' && (
          <QuotationsManager onConvertInvoice={(inv) => setSelectedInvoiceForPrint(inv)} />
        )}
        {activeTab === 'invoices' && (
          <InvoiceHistory onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)} />
        )}
        {activeTab === 'returns' && (
          <ReturnsManager />
        )}
        {activeTab === 'expenses' && (
          isAdmin ? (
            <ExpenseTracker />
          ) : (
            <POSBilling 
              onCompleteSale={(inv) => setSelectedInvoiceForPrint(inv)} 
              initialTable={selectedTableForOrder}
            />
          )
        )}
        {activeTab === 'customers' && (
          <CustomerLedger />
        )}
        {activeTab === 'barcode' && (
          <BarcodePrinter />
        )}
        {activeTab === 'reports' && (
          isAdmin ? (
            <ReportsDashboard />
          ) : (
            <POSBilling 
              onCompleteSale={(inv) => setSelectedInvoiceForPrint(inv)} 
              initialTable={selectedTableForOrder}
            />
          )
        )}
        {activeTab === 'settings' && (
          isAdmin ? (
            <SettingsBackup />
          ) : (
            <POSBilling 
              onCompleteSale={(inv) => setSelectedInvoiceForPrint(inv)} 
              initialTable={selectedTableForOrder}
            />
          )
        )}
      </main>

      {/* Invoice View / Print Modal */}
      {selectedInvoiceForPrint && (
        <InvoicePrintModal
          invoice={selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}

      {/* Switch Business Workspace Modal */}
      {showSwitchBusinessModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Switch Business Workspace
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Select or create an offline POS profile for your businesses.
                </p>
              </div>
              <button onClick={() => setShowSwitchBusinessModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {!showAddBusinessForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.values(businesses).map((b) => {
                  const isCurrent = activeBusinessId === b.id;

                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        switchBusiness(b.id);
                        setShowSwitchBusinessModal(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: isCurrent ? '#10b981' : 'var(--border-color)',
                        backgroundColor: isCurrent ? 'var(--bg-input)' : 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(16,185,129,0.12)',
                          color: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {b.id === 'grocery' ? <ShoppingBag size={20} /> : b.id === 'automotive' ? <Car size={20} /> : b.id === 'restaurant' ? <Utensils size={20} /> : <Store size={20} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                            {b.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            {b.type}
                          </div>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="badge badge-success">Active</span>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => setShowAddBusinessForm(true)}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px', marginTop: '6px', borderStyle: 'dashed' }}
                >
                  <Plus size={16} /> + Add New Custom Business Profile
                </button>
              </div>
            ) : (
              /* Add New Business Form */
              <form onSubmit={handleCreateNewBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Business / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metro Pharmacy & Wellness"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Business Category / Type
                  </label>
                  <select
                    className="form-select"
                    value={newBizType}
                    onChange={(e) => setNewBizType(e.target.value)}
                  >
                    <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                    <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                    <option value="Hardware & Sanitary">Hardware & Electricals</option>
                    <option value="Salon & Spa">Salon & Wellness Spa</option>
                    <option value="General Retail">General Retail Superstore</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={newBizCurrency}
                    onChange={(e) => setNewBizCurrency(e.target.value)}
                    className="form-input"
                    placeholder="₹, $, €, £"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddBusinessForm(false)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create & Launch Business
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Switch User Account Modal (Smooth & Cancellable) */}
      <SwitchUserModal
        isOpen={showSwitchUserModal}
        onClose={() => setShowSwitchUserModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BillingProvider>
      <MainApp />
    </BillingProvider>
  );
}
