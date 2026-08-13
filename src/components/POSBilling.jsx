import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  UserPlus, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Clock, 
  Tag, 
  PackageCheck, 
  FileCheck, 
  Scale, 
  Car, 
  Utensils, 
  CheckSquare, 
  X, 
  Smartphone, 
  Eye, 
  EyeOff,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  History,
  Repeat,
  Sparkles,
  Percent,
  Receipt
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function POSBilling({ onCompleteSale, initialTable }) {
  const { 
    products, 
    customers, 
    invoices,
    settings, 
    activeBusinessId,
    activeBusiness,
    createInvoice, 
    createQuotation, 
    addCustomer 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  
  // Mobile Screen State & Tab View
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  const [mobileTab, setMobileTab] = useState('catalog');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0] || { name: 'Walk-in Customer' });
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('');

  // Customer History Modal in POS
  const [showCustomerHistoryModal, setShowCustomerHistoryModal] = useState(false);

  // Automotive Service State
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [odometerKm, setOdometerKm] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionData, setInspectionData] = useState({
    fuelLevel: '50%',
    batteryGood: true,
    acWorking: true,
    scratchesChecked: true,
    spareTyrePresent: true
  });

  // Restaurant Dining State
  const [tableNo, setTableNo] = useState(initialTable || 'Table 1');
  const [orderType, setOrderType] = useState('Dine-In');
  const [chefNotes, setChefNotes] = useState('');

  // Grocery Weighing Scale Simulator Modal State
  const [weighingProduct, setWeighingProduct] = useState(null);
  const [simulatedWeight, setSimulatedWeight] = useState(0.75);

  // Dynamic UPI QR Code Modal State
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Profit Margin Peek State
  const [showProfitPeek, setShowProfitPeek] = useState(false);

  // Quick Add Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Customer Past Invoices in POS
  const selectedCustomerInvoices = useMemo(() => {
    if (!selectedCustomer) return [];
    return invoices.filter((inv) =>
      (inv.customer?.id && inv.customer.id === selectedCustomer.id) ||
      (inv.customer?.name && inv.customer.name.toLowerCase() === selectedCustomer.name.toLowerCase()) ||
      (selectedCustomer.phone !== '-' && inv.customer?.phone && inv.customer.phone === selectedCustomer.phone)
    );
  }, [selectedCustomer, invoices]);

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Add to cart with weight / unit intelligence
  const addToCart = (product, defaultQty = 1) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: parseFloat((item.qty + defaultQty).toFixed(2)) } : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            purchaseCost: product.purchaseCost || 0,
            taxRate: product.taxRate,
            stock: product.stock,
            unit: product.unit || 'pcs',
            isWeightBased: product.isWeightBased || false,
            qty: defaultQty
          }
        ];
      }
    });
  };

  const updateCartQty = (id, newQty) => {
    const val = parseFloat(newQty);
    if (isNaN(val) || val <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: parseFloat(val.toFixed(2)) } : item))
    );
  };

  const adjustCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = parseFloat((item.qty + delta).toFixed(2));
            if (newQty <= 0) return null;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Re-add an item from history to current cart
  const handleReaddItem = (historyItem) => {
    const matchedProduct = products.find((p) => p.id === historyItem.id || p.sku === historyItem.sku);
    if (matchedProduct) {
      addToCart(matchedProduct, historyItem.qty || 1);
    } else {
      addToCart({
        id: historyItem.id || 'p_' + Date.now(),
        name: historyItem.name,
        sku: historyItem.sku || 'SKU',
        price: historyItem.price,
        stock: 999,
        taxRate: historyItem.taxRate || 0,
        unit: historyItem.unit || 'pcs'
      }, historyItem.qty || 1);
    }
  };

  // Calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalCost = cart.reduce((acc, item) => acc + (item.purchaseCost || 0) * item.qty, 0);
  const discountAmount = (rawSubtotal * (parseFloat(discountPercent) || 0)) / 100;
  const taxableSubtotal = rawSubtotal - discountAmount;

  const totalTax = cart.reduce((acc, item) => {
    const itemSubtotal = item.price * item.qty;
    const itemDiscounted = itemSubtotal * (1 - (parseFloat(discountPercent) || 0) / 100);
    return acc + (itemDiscounted * (item.taxRate / 100));
  }, 0);

  const cgst = totalTax / 2;
  const sgst = totalTax / 2;
  const grandTotal = Math.round(taxableSubtotal + totalTax);
  const estimatedGrossProfit = Math.max(0, taxableSubtotal - totalCost);

  const effectivePaid = paymentMethod === 'Credit' 
    ? (parseFloat(paidAmount) || 0) 
    : grandTotal;
  const dueAmount = Math.max(0, grandTotal - effectivePaid);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'UPI' && !showUpiModal) {
      setShowUpiModal(true);
      return;
    }

    const invoiceData = {
      customer: selectedCustomer,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        sku: i.sku,
        price: i.price,
        qty: i.qty,
        unit: i.unit,
        isWeightBased: i.isWeightBased,
        taxRate: i.taxRate,
        total: Math.round(i.price * i.qty * (1 + i.taxRate / 100))
      })),
      subtotal: Math.round(taxableSubtotal * 100) / 100,
      taxAmount: Math.round(totalTax * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      discountPercent: parseFloat(discountPercent) || 0,
      discountAmount: Math.round(discountAmount * 100) / 100,
      grandTotal: grandTotal,
      paidAmount: effectivePaid,
      dueAmount: dueAmount,
      paymentMethod: paymentMethod,
      status: dueAmount > 0 ? (effectivePaid > 0 ? 'Partial' : 'Unpaid') : 'Paid',
      
      automotiveDetails: activeBusinessId === 'automotive' ? {
        vehicleNo,
        vehicleModel,
        odometerKm,
        technicianName,
        inspectionData
      } : null,

      restaurantDetails: activeBusinessId === 'restaurant' ? {
        tableNo,
        orderType,
        chefNotes
      } : null
    };

    const created = createInvoice(invoiceData);
    setCart([]);
    setDiscountPercent(0);
    setPaidAmount('');
    setVehicleNo('');
    setVehicleModel('');
    setShowUpiModal(false);
    if (isMobile) setMobileTab('catalog');
    onCompleteSale(created);
  };

  const handleSaveQuotation = () => {
    if (cart.length === 0) return;

    createQuotation({
      customer: selectedCustomer,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        sku: i.sku,
        price: i.price,
        qty: i.qty,
        unit: i.unit,
        taxRate: i.taxRate,
        total: Math.round(i.price * i.qty * (1 + i.taxRate / 100))
      })),
      subtotal: Math.round(taxableSubtotal * 100) / 100,
      taxAmount: Math.round(totalTax * 100) / 100,
      discountPercent: parseFloat(discountPercent) || 0,
      discountAmount: Math.round(discountAmount * 100) / 100,
      grandTotal: grandTotal,
      automotiveDetails: activeBusinessId === 'automotive' ? { vehicleNo, vehicleModel, odometerKm, technicianName } : null,
      restaurantDetails: activeBusinessId === 'restaurant' ? { tableNo, orderType, chefNotes } : null
    });

    alert('Price Quotation / Estimate saved successfully!');
    setCart([]);
    setDiscountPercent(0);
    if (isMobile) setMobileTab('catalog');
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    const newC = addCustomer({
      name: newCustName,
      phone: newCustPhone,
      address: '',
      gstin: ''
    });
    setSelectedCustomer(newC);
    setNewCustName('');
    setNewCustPhone('');
    setShowAddCustomerModal(false);
  };

  const showCatalogPanel = !isMobile || mobileTab === 'catalog';
  const showCartPanel = !isMobile || mobileTab === 'cart';

  return (
    <div className="pos-container" style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      
      {/* Mobile Top Segmented Tab Switcher */}
      {isMobile && (
        <div style={{
          display: 'flex',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          gap: '8px',
          zIndex: 30
        }}>
          <button
            onClick={() => setMobileTab('catalog')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mobileTab === 'catalog' ? '#10b981' : 'var(--bg-input)',
              color: mobileTab === 'catalog' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: mobileTab === 'catalog' ? '0 2px 8px rgba(16,185,129,0.3)' : 'none'
            }}
          >
            <ShoppingBag size={15} />
            Items ({products.length})
          </button>
          
          <button
            onClick={() => setMobileTab('cart')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mobileTab === 'cart' ? '#10b981' : 'var(--bg-input)',
              color: mobileTab === 'cart' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: mobileTab === 'cart' ? '0 2px 8px rgba(16,185,129,0.3)' : 'none'
            }}
          >
            <span>🛒 Cart ({cart.length})</span>
            <span className="badge" style={{
              backgroundColor: mobileTab === 'cart' ? '#ffffff' : '#10b981',
              color: mobileTab === 'cart' ? '#10b981' : '#ffffff',
              fontSize: '11px',
              padding: '1px 6px',
              fontWeight: '800'
            }}>
              {settings.currency}{grandTotal}
            </span>
          </button>
        </div>
      )}

      {/* Left Area: Product / Service Catalog */}
      {showCatalogPanel && (
        <div className="pos-catalog-panel" style={{
          flex: 1,
          padding: isMobile ? '12px 14px' : '18px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '10px' : '14px',
          overflowY: 'auto',
          width: '100%',
          position: 'relative'
        }}>
          
          {/* Header Row with Search & Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <h2 style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {settings.storeName}
                </h2>
                <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 7px', flexShrink: 0 }}>
                  {activeBusiness.type.split('&')[0]}
                </span>
              </div>

              <button
                onClick={() => setShowProfitPeek(!showProfitPeek)}
                className="btn btn-secondary"
                style={{
                  fontSize: '11.5px',
                  padding: '5px 10px',
                  height: '32px',
                  flexShrink: 0,
                  gap: '6px'
                }}
                title="Toggle Estimated Profit Margin"
              >
                {showProfitPeek ? <EyeOff size={13} /> : <Eye size={13} color="#10b981" />}
                {showProfitPeek ? `Est: ${settings.currency}${estimatedGrossProfit.toLocaleString()}` : 'Profit Peek'}
              </button>
            </div>

            {/* Search Bar with Glow */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type="text"
                placeholder={`Search ${activeBusinessId === 'automotive' ? 'services or parts' : activeBusinessId === 'restaurant' ? 'dishes & drinks' : 'produce, groceries, meat'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '40px',
                  fontSize: '13px',
                  minHeight: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Modern Category Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: isSelected ? '#10b981' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(16,185,129,0.18)' : 'var(--bg-card)',
                      color: isSelected ? '#10b981' : 'var(--text-muted)',
                      fontSize: '12px',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isSelected ? '0 2px 10px rgba(16,185,129,0.2)' : 'none',
                      transition: 'all 0.16s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid with Modern Aesthetics */}
          <div className="product-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: isMobile ? '10px' : '14px',
            alignContent: 'start',
            paddingBottom: isMobile && cart.length > 0 ? '80px' : '20px'
          }}>
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stock <= 0;
              const inCart = cart.find((i) => i.id === prod.id);

              return (
                <div
                  key={prod.id}
                  className="glass-panel card-hover"
                  style={{
                    padding: isMobile ? '10px' : '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                    position: 'relative',
                    border: inCart ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                    background: inCart ? 'rgba(16,185,129,0.04)' : 'var(--bg-card)',
                    overflow: 'hidden'
                  }}
                >
                  {inCart && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.45)',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      ✓ {inCart.qty} {prod.unit}
                    </span>
                  )}

                  {prod.image ? (
                    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: '100%',
                          height: isMobile ? '85px' : '115px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: isMobile ? '85px' : '115px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-dim)'
                    }}>
                      {activeBusinessId === 'automotive' ? <Car size={30} /> : activeBusinessId === 'restaurant' ? <Utensils size={30} /> : <PackageCheck size={30} />}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {prod.sku}
                      </span>
                      {prod.isWeightBased ? (
                        <span className="badge badge-info" style={{ fontSize: '9px', padding: '1px 5px' }}>
                          Scale ({prod.unit})
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: prod.stock <= 5 ? '#f43f5e' : 'var(--text-dim)'
                        }}>
                          {isOutOfStock ? 'Out of Stock' : `${prod.stock} ${prod.unit}`}
                        </span>
                      )}
                    </div>

                    <h3 style={{
                      fontSize: isMobile ? '12.5px' : '13.5px',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      lineHeight: '1.3',
                      wordBreak: 'break-word',
                      minHeight: '34px'
                    }}>
                      {prod.name}
                    </h3>
                  </div>

                  {/* Add / Modifier Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {prod.isWeightBased ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            setWeighingProduct(prod);
                            setSimulatedWeight(0.5);
                          }}
                          className="btn btn-secondary"
                          style={{
                            flex: 1,
                            padding: '6px 2px',
                            fontSize: '11px',
                            fontWeight: '700',
                            gap: '4px',
                            color: '#10b981'
                          }}
                        >
                          <Scale size={12} /> Weigh
                        </button>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 8px', fontSize: '11px', fontWeight: '700' }}
                        >
                          +1kg
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(prod, 1)}
                        disabled={isOutOfStock}
                        className="btn btn-secondary"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          gap: '5px'
                        }}
                      >
                        <Plus size={13} color="#10b981" /> Add to Bill
                      </button>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span className="mono" style={{ fontSize: isMobile ? '13px' : '14.5px', fontWeight: '800', color: '#10b981' }}>
                        {settings.currency}{prod.price.toLocaleString()}
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'normal' }}>/{prod.unit}</span>
                      </span>

                      <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                        Tax: {prod.taxRate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Mobile Cart Action Bar */}
          {isMobile && cart.length > 0 && (
            <div
              onClick={() => setMobileTab('cart')}
              style={{
                position: 'fixed',
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 25px rgba(16,185,129,0.55)',
                zIndex: 40,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                <ShoppingBag size={20} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800' }}>
                    {cart.length} Items in Cart
                  </div>
                  <div style={{ fontSize: '11.5px', opacity: 0.9 }}>
                    Total: {settings.currency}{grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontWeight: '800', fontSize: '13.5px' }}>
                <span>Review & Pay</span>
                <ArrowRight size={16} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Area: Dynamic Cart & Settle Panel */}
      {showCartPanel && (
        <div className="pos-cart-panel" style={{
          width: isMobile ? '100%' : '450px',
          backgroundColor: 'var(--bg-card)',
          borderLeft: isMobile ? 'none' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto'
        }}>
          {/* Cart Header Section */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: 'linear-gradient(180deg, rgba(16,185,129,0.03) 0%, transparent 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isMobile && (
                  <button
                    onClick={() => setMobileTab('catalog')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Active Order Cart
                </h3>
              </div>

              <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Customer Selection with Purchase History Button */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '11.5px' }}>Customer Account</label>
                <button
                  onClick={() => setShowCustomerHistoryModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10b981',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="View customer purchase history"
                >
                  <History size={13} />
                  Past Orders ({selectedCustomerInvoices.length})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <select
                  className="form-select"
                  value={selectedCustomer.id}
                  onChange={(e) => {
                    const found = customers.find((c) => c.id === e.target.value);
                    if (found) setSelectedCustomer(found);
                  }}
                  style={{ flex: 1, fontSize: '13px', height: '38px', minHeight: '38px' }}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone !== '-' ? `(${c.phone})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', height: '38px' }}
                  title="Add New Customer"
                >
                  <UserPlus size={16} color="#10b981" />
                </button>
              </div>

              {/* Customer Quick Insight Pill if has purchase history */}
              {selectedCustomerInvoices.length > 0 && (
                <div
                  onClick={() => setShowCustomerHistoryModal(true)}
                  style={{
                    marginTop: '6px',
                    padding: '6px 10px',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span>
                    🛍️ Last purchase: <strong style={{ color: 'var(--text-main)' }}>{new Date(selectedCustomerInvoices[0].date).toLocaleDateString()}</strong>
                  </span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>
                    View Items ➔
                  </span>
                </div>
              )}
            </div>

            {/* Automotive Garage Fields */}
            {activeBusinessId === 'automotive' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '11px' }}>Vehicle Number *</label>
                    <input
                      type="text"
                      placeholder="MH 12 AB 1234"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '12px', height: '34px', minHeight: '34px' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '11px' }}>Car Model</label>
                    <input
                      type="text"
                      placeholder="BMW 320d"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '12px', height: '34px', minHeight: '34px' }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowInspectionModal(true)}
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '6px', fontSize: '11.5px', gap: '6px' }}
                >
                  <CheckSquare size={13} color="#3b82f6" /> Vehicle Inspection Checklist
                </button>
              </div>
            )}

            {/* Restaurant Dining Fields */}
            {activeBusinessId === 'restaurant' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11px' }}>Table Number</label>
                  <select
                    className="form-select"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '12px', height: '34px', minHeight: '34px' }}
                  >
                    <option value="Table 1">Table 1</option>
                    <option value="Table 2">Table 2</option>
                    <option value="Table 3">Table 3</option>
                    <option value="VIP Booth">VIP Booth</option>
                    <option value="Parcel">Parcel</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11px' }}>Order Type</label>
                  <select
                    className="form-select"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '12px', height: '34px', minHeight: '34px' }}
                  >
                    <option value="Dine-In">Dine-In</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* Cart Items List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cart.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-dim)',
                textAlign: 'center',
                gap: '12px',
                padding: '40px 0'
              }}>
                <ShoppingBag size={42} opacity={0.3} />
                <p style={{ fontSize: '13px', lineHeight: '1.4' }}>Cart is currently empty.<br />Add items from the catalog.</p>
                {isMobile && (
                  <button
                    onClick={() => setMobileTab('catalog')}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    Browse Items Catalog
                  </button>
                )}
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', wordBreak: 'break-word', margin: 0 }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        {settings.currency}{item.price}/{item.unit} • Tax: {item.taxRate}%
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn-icon"
                      style={{ color: '#f43f5e', padding: '4px' }}
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    {/* Quantity modifier */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={() => adjustCartQty(item.id, item.isWeightBased ? -0.25 : -1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        step={item.isWeightBased ? '0.05' : '1'}
                        min="0.05"
                        value={item.qty}
                        onChange={(e) => updateCartQty(item.id, e.target.value)}
                        className="form-input"
                        style={{
                          width: '60px',
                          padding: '2px 4px',
                          textAlign: 'center',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          height: '28px',
                          minHeight: '28px'
                        }}
                      />

                      <button
                        onClick={() => adjustCartQty(item.id, item.isWeightBased ? 0.25 : 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>

                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '2px' }}>
                        {item.unit}
                      </span>
                    </div>

                    <span className="mono" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {settings.currency}{(Math.round(item.price * item.qty * 100) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculation Summary & Settle Footer */}
          <div style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span className="mono">{settings.currency}{rawSubtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Discount:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: parseFloat(discountPercent) === pct ? '#10b981' : 'var(--bg-card)',
                      color: parseFloat(discountPercent) === pct ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <span>GST Tax</span>
              <span className="mono">{settings.currency}{totalTax.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid rgba(16,185,129,0.35)',
              boxShadow: '0 2px 10px rgba(16,185,129,0.08)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Total Due</span>
              <span className="mono" style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>
                {settings.currency}{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '2px' }}>
              {[
                { id: 'Cash', icon: Banknote },
                { id: 'UPI', icon: QrCode },
                { id: 'Card', icon: CreditCard },
                { id: 'Credit', icon: Clock }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => {
                      setPaymentMethod(pm.id);
                      if (pm.id === 'UPI') setShowUpiModal(true);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid',
                      borderColor: isSelected ? '#10b981' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(16,185,129,0.18)' : 'var(--bg-card)',
                      color: isSelected ? '#10b981' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px',
                      boxShadow: isSelected ? '0 2px 8px rgba(16,185,129,0.2)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={15} />
                    {pm.id}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={handleSaveQuotation}
                disabled={cart.length === 0}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '12.5px', padding: '10px', opacity: cart.length === 0 ? 0.5 : 1 }}
                title="Save as quotation"
              >
                <FileCheck size={15} />
                Quotation
              </button>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="btn btn-primary"
                style={{
                  flex: 2,
                  padding: '10px',
                  fontSize: '14.5px',
                  fontWeight: '800',
                  opacity: cart.length === 0 ? 0.5 : 1,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  gap: '6px'
                }}
              >
                <Printer size={16} />
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS QUICK CUSTOMER PURCHASE HISTORY MODAL */}
      {showCustomerHistoryModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '8px' : '20px' }}>
          <div className="modal-container" style={{ maxWidth: '600px', padding: isMobile ? '16px' : '24px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {selectedCustomer.name}'s Past Orders
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Phone: {selectedCustomer.phone}
                  </span>
                </div>
              </div>

              <button onClick={() => setShowCustomerHistoryModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {selectedCustomerInvoices.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
                <ShoppingBag size={36} opacity={0.3} style={{ margin: '0 auto 8px auto' }} />
                <p style={{ fontSize: '13px' }}>No previous purchase records found for this customer.</p>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCustomerInvoices.map((inv) => {
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
                        padding: '12px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="mono" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                            {inv.id}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '9.5px' }}>
                            {inv.paymentMethod}
                          </span>
                        </div>

                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {formattedDate}
                        </span>
                      </div>

                      {/* Items Purchased in this order */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px' }}>
                        {inv.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                            <span>
                              • {it.name} <strong style={{ color: '#10b981' }}>({it.qty} {it.unit || 'pcs'})</strong>
                            </span>
                            
                            <button
                              onClick={() => {
                                handleReaddItem(it);
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '2px 6px', fontSize: '10px', height: '22px' }}
                              title="Add this item to current cart"
                            >
                              <Plus size={10} color="#10b981" /> Add to Cart
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          Status: <strong style={{ color: inv.status === 'Paid' ? '#10b981' : '#f59e0b' }}>{inv.status}</strong>
                        </span>

                        <div className="mono" style={{ fontSize: '13.5px', fontWeight: '800', color: '#10b981' }}>
                          Total: {settings.currency}{inv.grandTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setShowCustomerHistoryModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '13px' }}
            >
              Done & Return to Billing
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC UPI QR CODE POPUP MODAL */}
      {showUpiModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '400px', padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone color="#10b981" size={22} />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Scan UPI QR to Pay
                </h3>
              </div>
              <button onClick={() => setShowUpiModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Accept payments via Google Pay, PhonePe, Paytm, or BHIM UPI.
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)'
            }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <rect width="180" height="180" fill="#ffffff" />
                <rect x="10" y="10" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="18" y="18" width="29" height="29" fill="#ffffff" rx="2" />
                <rect x="25" y="25" width="15" height="15" fill="#10b981" rx="2" />

                <rect x="125" y="10" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="133" y="18" width="29" height="29" fill="#ffffff" rx="2" />
                <rect x="140" y="25" width="15" height="15" fill="#10b981" rx="2" />

                <rect x="10" y="125" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="18" y="133" width="29" height="29" fill="#ffffff" rx="2" />
                <rect x="25" y="140" width="15" height="15" fill="#10b981" rx="2" />

                <rect x="65" y="20" width="15" height="15" fill="#0f172a" />
                <rect x="90" y="30" width="20" height="15" fill="#0f172a" />
                <rect x="65" y="65" width="50" height="50" fill="#0f172a" rx="4" />
                <rect x="75" y="75" width="30" height="30" fill="#10b981" rx="2" />

                <rect x="20" y="70" width="15" height="25" fill="#0f172a" />
                <rect x="135" y="70" width="20" height="35" fill="#0f172a" />
                <rect x="70" y="130" width="35" height="20" fill="#0f172a" />
                <rect x="120" y="120" width="25" height="40" fill="#0f172a" />
              </svg>
            </div>

            <div style={{ marginTop: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Amount Due</span>
              <div className="mono" style={{ fontSize: '26px', fontWeight: '900', color: '#10b981' }}>
                {settings.currency}{grandTotal.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '14px', fontSize: '14.5px' }}
            >
              Payment Confirmed & Print
            </button>
          </div>
        </div>
      )}

      {/* WEIGHING SCALE SIMULATOR MODAL */}
      {weighingProduct && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '420px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale color="#10b981" size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Digital Weighing Scale
                </h3>
              </div>
              <button onClick={() => setWeighingProduct(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', wordBreak: 'break-word', margin: 0 }}>
                {weighingProduct.name}
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Rate: {settings.currency}{weighingProduct.price} / {weighingProduct.unit}
              </span>

              <div style={{
                margin: '14px auto',
                padding: '12px',
                backgroundColor: '#050a14',
                borderRadius: '10px',
                border: '2px solid #10b981',
                boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                maxWidth: '220px'
              }}>
                <span className="mono" style={{ fontSize: '32px', fontWeight: '900', color: '#10b981', letterSpacing: '2px' }}>
                  {simulatedWeight} <span style={{ fontSize: '16px' }}>{weighingProduct.unit}</span>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '10px' }}>
                {[0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 5.0].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSimulatedWeight(w)}
                    style={{
                      padding: '6px 4px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: simulatedWeight === w ? '#10b981' : 'var(--bg-card)',
                      color: simulatedWeight === w ? '#ffffff' : 'var(--text-main)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {w >= 1 ? `${w}kg` : `${w * 1000}g`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Calculated Price:</span>
              <span className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                {settings.currency}{(Math.round(weighingProduct.price * simulatedWeight * 100) / 100).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                addToCart(weighingProduct, simulatedWeight);
                setWeighingProduct(null);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Add {simulatedWeight}{weighingProduct.unit} to Cart
            </button>
          </div>
        </div>
      )}

      {/* AUTOMOTIVE PRE-SERVICE INSPECTION CHECKLIST MODAL */}
      {showInspectionModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '460px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare color="#3b82f6" size={20} />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Vehicle Inspection Checklist
                </h3>
              </div>
              <button onClick={() => setShowInspectionModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Fuel Tank Level:</label>
                <select
                  className="form-select"
                  value={inspectionData.fuelLevel}
                  onChange={(e) => setInspectionData({ ...inspectionData, fuelLevel: e.target.value })}
                >
                  <option value="Reserve / Low">Reserve / Low</option>
                  <option value="25%">25% (Quarter Tank)</option>
                  <option value="50%">50% (Half Tank)</option>
                  <option value="75%">75% (Three-Quarter)</option>
                  <option value="100% Full">100% Full Tank</option>
                </select>
              </div>

              {[
                { id: 'scratchesChecked', label: 'Exterior Scratches & Dents Documented' },
                { id: 'spareTyrePresent', label: 'Spare Wheel & Tool Kit Verified' },
                { id: 'batteryGood', label: 'Battery Voltage Check' },
                { id: 'acWorking', label: 'Air Conditioning Check' }
              ].map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={inspectionData[item.id]}
                    onChange={(e) => setInspectionData({ ...inspectionData, [item.id]: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                  />
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{item.label}</span>
                </label>
              ))}

              <button
                onClick={() => setShowInspectionModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              >
                Save Inspection Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
              Add New Customer
            </h3>
            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddCustomerModal(false)} className="btn btn-secondary">
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
    </div>
  );
}
