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
  Receipt,
  Zap,
  CheckCircle2,
  ShieldCheck
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
  const [paymentMethod, setPaymentMethod] = useState('UPI');
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

  // Category Icon Map for Swiggy Instamart Vibe
  const getCategoryEmoji = (cat) => {
    const c = cat.toLowerCase();
    if (c === 'all') return '⚡';
    if (c.includes('fruit')) return '🍎';
    if (c.includes('veg')) return '🥦';
    if (c.includes('dairy') || c.includes('milk')) return '🥛';
    if (c.includes('meat') || c.includes('chicken') || c.includes('fish')) return '🍗';
    if (c.includes('grain') || c.includes('rice') || c.includes('staple')) return '🍚';
    if (c.includes('snack') || c.includes('biscuit')) return '🍪';
    if (c.includes('drink') || c.includes('juice') || c.includes('beverage')) return '🧃';
    if (c.includes('auto') || c.includes('service')) return '🚗';
    if (c.includes('food') || c.includes('pizza')) return '🍕';
    return '📦';
  };

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
              backgroundColor: mobileTab === 'catalog' ? 'var(--instamart-green)' : 'var(--bg-input)',
              color: mobileTab === 'catalog' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={15} />
            Instamart ({products.length})
          </button>
          
          <button
            onClick={() => setMobileTab('cart')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mobileTab === 'cart' ? 'var(--instamart-green)' : 'var(--bg-input)',
              color: mobileTab === 'cart' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>🛒 Cart ({cart.length})</span>
            <span className="badge" style={{
              backgroundColor: mobileTab === 'cart' ? '#ffffff' : 'var(--instamart-green)',
              color: mobileTab === 'cart' ? 'var(--instamart-green)' : '#ffffff',
              fontSize: '11px',
              padding: '1px 6px',
              fontWeight: '800'
            }}>
              {settings.currency}{grandTotal}
            </span>
          </button>
        </div>
      )}

      {/* Left Area: Instamart Product Catalog */}
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
          
          {/* Instamart Header Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span className="time-badge">
                  <Zap size={11} fill="var(--swiggy-orange)" /> INSTANT POS
                </span>
                <h2 style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '900',
                  color: 'var(--text-main)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {settings.storeName}
                </h2>
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
                {showProfitPeek ? <EyeOff size={13} /> : <Eye size={13} color="var(--instamart-green)" />}
                {showProfitPeek ? `Est: ${settings.currency}${estimatedGrossProfit.toLocaleString()}` : 'Profit Peek'}
              </button>
            </div>

            {/* Instamart Search Bar with Animated Placeholder Feel */}
            <div style={{ position: 'relative' }}>
              <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type="text"
                placeholder={`Search for "apples", "milk", "bread", or item SKU...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '42px',
                  fontSize: '13.5px',
                  minHeight: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Swiggy Instamart Category Rail */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const emoji = getCategoryEmoji(cat);

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '12px',
                      fontWeight: isSelected ? '800' : '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: isSelected ? '0 2px 10px rgba(12,131,31,0.2)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{emoji}</span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Swiggy Instamart Product Grid */}
          <div className="product-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(145px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: isMobile ? '10px' : '14px',
            alignContent: 'start',
            paddingBottom: isMobile && cart.length > 0 ? '80px' : '20px'
          }}>
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stock <= 0;
              const cartItem = cart.find((i) => i.id === prod.id);
              const inCart = Boolean(cartItem);
              
              // Simulated MRP (15% higher) for Instamart discount badge
              const fakeMrp = Math.round(prod.price * 1.18);
              const discountPercentCalc = Math.round(((fakeMrp - prod.price) / fakeMrp) * 100);

              return (
                <div
                  key={prod.id}
                  className="glass-panel card-hover"
                  style={{
                    padding: isMobile ? '10px' : '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '6px',
                    position: 'relative',
                    border: inCart ? '1.5px solid var(--instamart-green)' : '1px solid var(--border-color)',
                    background: inCart ? 'rgba(12,131,31,0.03)' : 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Badges: Savings Discount or Weight scale */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {discountPercentCalc > 5 && (
                      <span className="discount-badge">
                        {discountPercentCalc}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', backgroundColor: 'var(--bg-input)' }}>
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: '100%',
                          height: isMobile ? '95px' : '120px',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: isMobile ? '95px' : '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-dim)'
                      }}>
                        {activeBusinessId === 'automotive' ? <Car size={32} /> : activeBusinessId === 'restaurant' ? <Utensils size={32} /> : <PackageCheck size={32} />}
                      </div>
                    )}

                    {/* Weight indicator pill */}
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {prod.isWeightBased ? `1 ${prod.unit}` : `1 ${prod.unit}`}
                    </div>
                  </div>

                  {/* Product Title */}
                  <div>
                    <h3 style={{
                      fontSize: isMobile ? '12.5px' : '13px',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      lineHeight: '1.3',
                      wordBreak: 'break-word',
                      margin: '2px 0 0 0',
                      minHeight: '32px'
                    }}>
                      {prod.name}
                    </h3>
                  </div>

                  {/* Price & MRP Row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="mono" style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '900', color: 'var(--text-main)' }}>
                      {settings.currency}{prod.price.toLocaleString()}
                    </span>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      {settings.currency}{fakeMrp}
                    </span>
                  </div>

                  {/* Instamart Interactive ADD / Inline Stepper Button */}
                  <div style={{ marginTop: '4px' }}>
                    {prod.isWeightBased && !inCart ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            setWeighingProduct(prod);
                            setSimulatedWeight(0.5);
                          }}
                          className="instamart-add-btn"
                          style={{ fontSize: '11.5px', padding: '6px 4px', gap: '3px' }}
                        >
                          <Scale size={12} /> WEIGH
                        </button>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="instamart-add-btn"
                          style={{ width: '45px', padding: '6px 0' }}
                        >
                          +1kg
                        </button>
                      </div>
                    ) : inCart ? (
                      /* Swiggy Instamart Active Stepper [ - QTY + ] */
                      <div className="instamart-stepper">
                        <button onClick={() => adjustCartQty(prod.id, prod.isWeightBased ? -0.25 : -1)}>
                          -
                        </button>
                        <span className="instamart-stepper-qty mono">
                          {cartItem.qty} {prod.unit}
                        </span>
                        <button onClick={() => adjustCartQty(prod.id, prod.isWeightBased ? 0.25 : 1)}>
                          +
                        </button>
                      </div>
                    ) : (
                      /* Swiggy Instamart Default ADD Button */
                      <button
                        onClick={() => addToCart(prod, 1)}
                        disabled={isOutOfStock}
                        className="instamart-add-btn"
                      >
                        {isOutOfStock ? 'OUT OF STOCK' : 'ADD'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Mobile Instamart Cart Action Bar */}
          {isMobile && cart.length > 0 && (
            <div
              onClick={() => setMobileTab('cart')}
              style={{
                position: 'fixed',
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: 'linear-gradient(135deg, #0c831f 0%, #066314 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 25px rgba(12,131,31,0.55)',
                zIndex: 40,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                <ShoppingBag size={20} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800' }}>
                    {cart.length} {cart.length === 1 ? 'Item' : 'Items'} in Cart
                  </div>
                  <div style={{ fontSize: '11.5px', opacity: 0.9 }}>
                    Total: {settings.currency}{grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontWeight: '900', fontSize: '13.5px' }}>
                <span>View Bill ➔</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Area: Swiggy-Style Bill Summary Panel */}
      {showCartPanel && (
        <div className="pos-cart-panel" style={{
          width: isMobile ? '100%' : '440px',
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
            background: 'linear-gradient(180deg, rgba(12,131,31,0.04) 0%, transparent 100%)'
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
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                  Order Summary
                </h3>
              </div>

              <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Customer Account Picker */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '11.5px' }}>Customer Profile</label>
                <button
                  onClick={() => setShowCustomerHistoryModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--instamart-green)',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="View past orders"
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
                  <UserPlus size={16} color="var(--instamart-green)" />
                </button>
              </div>
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
                <p style={{ fontSize: '13px', lineHeight: '1.4' }}>Your cart is empty.<br />Add fresh items from Instamart catalog.</p>
                {isMobile && (
                  <button
                    onClick={() => setMobileTab('catalog')}
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    Browse Instamart Catalog
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', wordBreak: 'break-word', margin: 0 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {settings.currency}{item.price}/{item.unit}
                    </span>
                  </div>

                  {/* Quantity micro stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      backgroundColor: 'var(--instamart-green)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ffffff',
                      padding: '2px 4px',
                      boxShadow: '0 2px 6px rgba(12,131,31,0.3)'
                    }}>
                      <button
                        onClick={() => adjustCartQty(item.id, item.isWeightBased ? -0.25 : -1)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '900', fontSize: '14px', padding: '0 6px', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span className="mono" style={{ fontSize: '12px', fontWeight: '800', padding: '0 4px' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => adjustCartQty(item.id, item.isWeightBased ? 0.25 : 1)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '900', fontSize: '14px', padding: '0 6px', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>

                    <span className="mono" style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--text-main)', minWidth: '60px', textAlign: 'right' }}>
                      {settings.currency}{(Math.round(item.price * item.qty * 100) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Swiggy "Bill Details" Breakdown Card */}
          <div style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Bill Details
            </span>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <span>Item Total</span>
              <span className="mono">{settings.currency}{rawSubtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Store Discount:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    style={{
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: parseFloat(discountPercent) === pct ? 'var(--instamart-green)' : 'var(--bg-card)',
                      color: parseFloat(discountPercent) === pct ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <span>GST & Taxes</span>
              <span className="mono">{settings.currency}{totalTax.toFixed(2)}</span>
            </div>

            {/* Total To Pay */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid rgba(12,131,31,0.4)',
              boxShadow: '0 2px 10px rgba(12,131,31,0.08)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>To Pay</span>
              <span className="mono" style={{ fontSize: '22px', fontWeight: '900', color: 'var(--instamart-green)' }}>
                {settings.currency}{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Payment Mode Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '2px' }}>
              {[
                { id: 'UPI', icon: QrCode },
                { id: 'Cash', icon: Banknote },
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
                      borderColor: isSelected ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
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
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
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
                <History size={20} color="var(--instamart-green)" />
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
                              • {it.name} <strong style={{ color: 'var(--instamart-green)' }}>({it.qty} {it.unit || 'pcs'})</strong>
                            </span>
                            
                            <button
                              onClick={() => {
                                handleReaddItem(it);
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '2px 6px', fontSize: '10px', height: '22px' }}
                              title="Add this item to current cart"
                            >
                              <Plus size={10} color="var(--instamart-green)" /> Add to Cart
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          Status: <strong style={{ color: inv.status === 'Paid' ? 'var(--instamart-green)' : '#f59e0b' }}>{inv.status}</strong>
                        </span>

                        <div className="mono" style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--instamart-green)' }}>
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
                <Smartphone color="var(--instamart-green)" size={22} />
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
                <rect x="25" y="25" width="15" height="15" fill="#0c831f" rx="2" />

                <rect x="125" y="10" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="133" y="18" width="29" height="29" fill="#ffffff" rx="2" />
                <rect x="140" y="25" width="15" height="15" fill="#0c831f" rx="2" />

                <rect x="10" y="125" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="18" y="133" width="29" height="29" fill="#ffffff" rx="2" />
                <rect x="25" y="140" width="15" height="15" fill="#0c831f" rx="2" />

                <rect x="65" y="20" width="15" height="15" fill="#0f172a" />
                <rect x="90" y="30" width="20" height="15" fill="#0f172a" />
                <rect x="65" y="65" width="50" height="50" fill="#0f172a" rx="4" />
                <rect x="75" y="75" width="30" height="30" fill="#0c831f" rx="2" />

                <rect x="20" y="70" width="15" height="25" fill="#0f172a" />
                <rect x="135" y="70" width="20" height="35" fill="#0f172a" />
                <rect x="70" y="130" width="35" height="20" fill="#0f172a" />
                <rect x="120" y="120" width="25" height="40" fill="#0f172a" />
              </svg>
            </div>

            <div style={{ marginTop: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Amount Due</span>
              <div className="mono" style={{ fontSize: '26px', fontWeight: '900', color: 'var(--instamart-green)' }}>
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
                <Scale color="var(--instamart-green)" size={20} />
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
                border: '2px solid var(--instamart-green)',
                boxShadow: '0 0 20px rgba(12,131,31,0.3)',
                maxWidth: '220px'
              }}>
                <span className="mono" style={{ fontSize: '32px', fontWeight: '900', color: 'var(--instamart-green)', letterSpacing: '2px' }}>
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
                      backgroundColor: simulatedWeight === w ? 'var(--instamart-green)' : 'var(--bg-card)',
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
              <span className="mono" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--instamart-green)' }}>
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
                    style={{ width: '16px', height: '16px', accentColor: 'var(--instamart-green)' }}
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
