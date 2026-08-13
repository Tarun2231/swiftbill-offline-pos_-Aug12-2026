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
  Calculator,
  Layers,
  RotateCcw
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

  // SMART WEIGHING SCALE HUB STATE
  const [weighingProduct, setWeighingProduct] = useState(null);
  const [simulatedWeight, setSimulatedWeight] = useState(0.5);
  const [tareWeight, setTareWeight] = useState(0);
  const [weightMode, setWeightMode] = useState('weight');
  const [targetAmountInput, setTargetAmountInput] = useState('');

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

  // Add to cart
  const addToCart = (product, defaultQty = 1) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: parseFloat((item.qty + defaultQty).toFixed(3)) } : item
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
      prev.map((item) => (item.id === id ? { ...item, qty: parseFloat(val.toFixed(3)) } : item))
    );
  };

  const adjustCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = parseFloat((item.qty + delta).toFixed(3));
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

  const openWeighingModal = (prod) => {
    setWeighingProduct(prod);
    setSimulatedWeight(0.5);
    setTareWeight(0);
    setWeightMode('weight');
    setTargetAmountInput('');
  };

  const netWeight = Math.max(0.01, parseFloat((simulatedWeight - tareWeight).toFixed(3)));
  const calculatedWeightPrice = weighingProduct ? Math.round(weighingProduct.price * netWeight * 100) / 100 : 0;

  const handleAmountToWeight = (amountStr) => {
    setTargetAmountInput(amountStr);
    const amt = parseFloat(amountStr);
    if (!isNaN(amt) && amt > 0 && weighingProduct && weighingProduct.price > 0) {
      const computedWeight = parseFloat((amt / weighingProduct.price).toFixed(3));
      setSimulatedWeight(computedWeight);
    }
  };

  const showCatalogPanel = !isMobile || mobileTab === 'catalog';
  const showCartPanel = !isMobile || mobileTab === 'cart';

  return (
    <div className="pos-container" style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      
      {/* Mobile Top Segmented Tab Switcher */}
      {isMobile && (
        <div style={{
          display: 'flex',
          padding: '6px 10px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          gap: '6px',
          zIndex: 30
        }}>
          <button
            onClick={() => setMobileTab('catalog')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mobileTab === 'catalog' ? 'var(--instamart-green)' : 'var(--bg-input)',
              color: mobileTab === 'catalog' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={14} />
            Catalog ({products.length})
          </button>
          
          <button
            onClick={() => setMobileTab('cart')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mobileTab === 'cart' ? 'var(--instamart-green)' : 'var(--bg-input)',
              color: mobileTab === 'cart' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Cart ({cart.length})</span>
            <span className="badge" style={{
              backgroundColor: mobileTab === 'cart' ? '#ffffff' : 'var(--instamart-green)',
              color: mobileTab === 'cart' ? 'var(--instamart-green)' : '#ffffff',
              fontSize: '10.5px',
              padding: '1px 5px',
              fontWeight: '700'
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
          padding: isMobile ? '10px 12px' : '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '8px' : '12px',
          overflowY: 'auto',
          width: '100%',
          position: 'relative'
        }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span className="time-badge">
                  <Zap size={10} fill="var(--swiggy-orange)" /> INSTANT POS
                </span>
                <h2 style={{
                  fontSize: isMobile ? '15px' : '17px',
                  fontWeight: '700',
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
                  fontSize: '11px',
                  padding: '4px 8px',
                  height: '28px',
                  flexShrink: 0,
                  fontWeight: '500',
                  gap: '4px'
                }}
              >
                {showProfitPeek ? <EyeOff size={12} /> : <Eye size={12} color="var(--instamart-green)" />}
                {showProfitPeek ? `Margin: ${settings.currency}${estimatedGrossProfit.toLocaleString()}` : 'Profit'}
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="text"
                placeholder={`Search "apples", "milk", "bread", or SKU...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '36px',
                  fontSize: '13px',
                  minHeight: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Rail */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const emoji = getCategoryEmoji(cat);

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? '600' : '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <span>{emoji}</span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(135px, 1fr))' : 'repeat(auto-fill, minmax(185px, 1fr))',
            gap: isMobile ? '8px' : '12px',
            alignContent: 'start',
            paddingBottom: isMobile && cart.length > 0 ? '70px' : '16px'
          }}>
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stock <= 0;
              const cartItem = cart.find((i) => i.id === prod.id);
              const inCart = Boolean(cartItem);
              
              const fakeMrp = Math.round(prod.price * 1.15);
              const discountPercentCalc = Math.round(((fakeMrp - prod.price) / fakeMrp) * 100);

              return (
                <div
                  key={prod.id}
                  className="glass-panel card-hover"
                  style={{
                    padding: isMobile ? '8px' : '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px',
                    position: 'relative',
                    border: inCart ? '1px solid var(--instamart-green)' : '1px solid var(--border-color)',
                    background: inCart ? 'rgba(12,131,31,0.02)' : 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Discount Tag */}
                  {discountPercentCalc > 5 && (
                    <div style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 2 }}>
                      <span className="discount-badge">
                        {discountPercentCalc}% OFF
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }}>
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: '100%',
                          height: isMobile ? '85px' : '110px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: isMobile ? '85px' : '110px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-dim)'
                      }}>
                        {activeBusinessId === 'automotive' ? <Car size={26} /> : activeBusinessId === 'restaurant' ? <Utensils size={26} /> : <PackageCheck size={26} />}
                      </div>
                    )}

                    {/* Clean Lightweight Unit Tag */}
                    <div style={{
                      position: 'absolute',
                      bottom: '3px',
                      left: '3px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '500',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backdropFilter: 'blur(3px)'
                    }}>
                      {prod.isWeightBased ? `per ${prod.unit}` : `1 ${prod.unit}`}
                    </div>
                  </div>

                  {/* Product Title */}
                  <div>
                    <h3 style={{
                      fontSize: isMobile ? '12px' : '12.5px',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      lineHeight: '1.25',
                      wordBreak: 'break-word',
                      margin: '2px 0 0 0',
                      minHeight: '28px'
                    }}>
                      {prod.name}
                    </h3>
                  </div>

                  {/* Price & MRP Row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span className="mono" style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {settings.currency}{prod.price.toLocaleString()}
                    </span>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      {settings.currency}{fakeMrp}
                    </span>
                  </div>

                  {/* Weight Quick-Select Chips (Simplified & Lightweight) */}
                  {prod.isWeightBased && !inCart && (
                    <div style={{ display: 'flex', gap: '3px', marginTop: '1px' }}>
                      {[
                        { label: '500g', val: 0.5 },
                        { label: '1kg', val: 1.0 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => addToCart(prod, preset.val)}
                          style={{
                            flex: 1,
                            padding: '2px 0',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-muted)',
                            fontSize: '9.5px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          +{preset.label}
                        </button>
                      ))}
                      <button
                        onClick={() => openWeighingModal(prod)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--instamart-green)',
                          fontSize: '9.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                        title="Custom weight scale"
                      >
                        <Scale size={9} /> Scale
                      </button>
                    </div>
                  )}

                  {/* ADD Button / Stepper */}
                  <div style={{ marginTop: '3px' }}>
                    {inCart ? (
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
                      <button
                        onClick={() => addToCart(prod, 1)}
                        disabled={isOutOfStock}
                        className="instamart-add-btn"
                      >
                        {isOutOfStock ? 'OUT OF STOCK' : '+ ADD'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Mobile Cart Bar */}
          {isMobile && cart.length > 0 && (
            <div
              onClick={() => setMobileTab('cart')}
              style={{
                position: 'fixed',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: '#0c831f',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(12,131,31,0.4)',
                zIndex: 40,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <ShoppingBag size={18} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>
                    Total: {settings.currency}{grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontWeight: '700', fontSize: '12.5px' }}>
                <span>View Bill ➔</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Area: Bill Summary Panel */}
      {showCartPanel && (
        <div className="pos-cart-panel" style={{
          width: isMobile ? '100%' : '420px',
          backgroundColor: 'var(--bg-card)',
          borderLeft: isMobile ? 'none' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto'
        }}>
          {/* Header Section */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isMobile && (
                  <button
                    onClick={() => setMobileTab('catalog')}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11.5px' }}
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                )}
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  Order Summary
                </h3>
              </div>

              <span className="badge badge-success" style={{ fontSize: '10px', padding: '1px 6px' }}>
                {cart.length} items
              </span>
            </div>

            {/* Customer Picker */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '11px' }}>Customer</label>
                <button
                  onClick={() => setShowCustomerHistoryModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--instamart-green)',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <History size={12} />
                  History ({selectedCustomerInvoices.length})
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
                  style={{ flex: 1, fontSize: '12.5px', height: '34px', minHeight: '34px' }}
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
                  style={{ padding: '6px 10px', height: '34px' }}
                >
                  <UserPlus size={14} color="var(--instamart-green)" />
                </button>
              </div>
            </div>

            {/* Automotive Fields */}
            {activeBusinessId === 'automotive' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '10.5px' }}>Vehicle No</label>
                    <input
                      type="text"
                      placeholder="MH 12 AB 1234"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="form-input"
                      style={{ padding: '4px 6px', fontSize: '11.5px', height: '30px', minHeight: '30px' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '10.5px' }}>Model</label>
                    <input
                      type="text"
                      placeholder="BMW 320d"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="form-input"
                      style={{ padding: '4px 6px', fontSize: '11.5px', height: '30px', minHeight: '30px' }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowInspectionModal(true)}
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '5px', fontSize: '11px', gap: '4px' }}
                >
                  <CheckSquare size={12} color="#3b82f6" /> Vehicle Inspection
                </button>
              </div>
            )}

            {/* Restaurant Fields */}
            {activeBusinessId === 'restaurant' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Table</label>
                  <select
                    className="form-select"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    style={{ padding: '4px 6px', fontSize: '11.5px', height: '30px', minHeight: '30px' }}
                  >
                    <option value="Table 1">Table 1</option>
                    <option value="Table 2">Table 2</option>
                    <option value="Table 3">Table 3</option>
                    <option value="VIP Booth">VIP Booth</option>
                    <option value="Parcel">Parcel</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Order Type</label>
                  <select
                    className="form-select"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    style={{ padding: '4px 6px', fontSize: '11.5px', height: '30px', minHeight: '30px' }}
                  >
                    <option value="Dine-In">Dine-In</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cart.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-dim)',
                textAlign: 'center',
                gap: '8px',
                padding: '30px 0'
              }}>
                <ShoppingBag size={36} opacity={0.3} />
                <p style={{ fontSize: '12.5px', lineHeight: '1.4' }}>Cart is empty.<br />Add items to bill.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                      {settings.currency}{item.price}/{item.unit}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      backgroundColor: 'var(--instamart-green)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ffffff',
                      padding: '1px 3px'
                    }}>
                      <button
                        onClick={() => adjustCartQty(item.id, item.isWeightBased ? -0.25 : -1)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '13px', padding: '0 4px', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span className="mono" style={{ fontSize: '11px', fontWeight: '600', padding: '0 3px' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => adjustCartQty(item.id, item.isWeightBased ? 0.25 : 1)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '13px', padding: '0 4px', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>

                    <span className="mono" style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', minWidth: '50px', textAlign: 'right' }}>
                      {settings.currency}{(Math.round(item.price * item.qty * 100) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Summary */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Item Total</span>
              <span className="mono">{settings.currency}{rawSubtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Discount:</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    style={{
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: parseFloat(discountPercent) === pct ? 'var(--instamart-green)' : 'var(--bg-card)',
                      color: parseFloat(discountPercent) === pct ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>GST & Taxes</span>
              <span className="mono">{settings.currency}{totalTax.toFixed(2)}</span>
            </div>

            {/* To Pay */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(12,131,31,0.3)'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>To Pay</span>
              <span className="mono" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--instamart-green)' }}>
                {settings.currency}{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
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
                      padding: '6px 2px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '10.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Icon size={13} />
                    {pm.id}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              <button
                onClick={handleSaveQuotation}
                disabled={cart.length === 0}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '12px', padding: '8px' }}
              >
                Estimate
              </button>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="btn btn-primary"
                style={{
                  flex: 2,
                  padding: '8px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <Printer size={15} />
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS QUICK CUSTOMER PURCHASE HISTORY MODAL */}
      {showCustomerHistoryModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '8px' : '20px' }}>
          <div className="modal-container" style={{ maxWidth: '540px', padding: isMobile ? '14px' : '20px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <History size={18} color="var(--instamart-green)" />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {selectedCustomer.name}'s Past Orders
                  </h3>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    Phone: {selectedCustomer.phone}
                  </span>
                </div>
              </div>

              <button onClick={() => setShowCustomerHistoryModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            {selectedCustomerInvoices.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                <p style={{ fontSize: '12px' }}>No previous records found.</p>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCustomerInvoices.map((inv) => {
                  const formattedDate = new Date(inv.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={inv.id}
                      style={{
                        padding: '10px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="mono" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {inv.id}
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                          {formattedDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '4px 6px', backgroundColor: 'var(--bg-card)', borderRadius: '4px' }}>
                        {inv.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                            <span>
                              • {it.name} <span style={{ color: 'var(--instamart-green)' }}>({it.qty} {it.unit || 'pcs'})</span>
                            </span>
                            
                            <button
                              onClick={() => handleReaddItem(it)}
                              className="btn btn-secondary"
                              style={{ padding: '2px 5px', fontSize: '9.5px', height: '20px' }}
                            >
                              + Re-add
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                        <span style={{ color: 'var(--text-dim)' }}>
                          Status: <strong style={{ color: inv.status === 'Paid' ? 'var(--instamart-green)' : '#f59e0b' }}>{inv.status}</strong>
                        </span>
                        <span className="mono" style={{ fontWeight: '700', color: 'var(--instamart-green)' }}>
                          {settings.currency}{inv.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setShowCustomerHistoryModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '8px', fontSize: '12px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC UPI QR CODE POPUP MODAL */}
      {showUpiModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '380px', padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone color="var(--instamart-green)" size={20} />
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  Scan UPI QR to Pay
                </h3>
              </div>
              <button onClick={() => setShowUpiModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              display: 'inline-block',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <svg width="160" height="160" viewBox="0 0 180 180">
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

            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Amount</span>
              <div className="mono" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--instamart-green)' }}>
                {settings.currency}{grandTotal.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', marginTop: '12px', fontSize: '13.5px' }}
            >
              Payment Confirmed & Print
            </button>
          </div>
        </div>
      )}

      {/* SMART DIGITAL WEIGHING SCALE HUB MODAL */}
      {weighingProduct && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '440px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale color="var(--instamart-green)" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  Weigh Scale Hub
                </h3>
              </div>
              <button onClick={() => setWeighingProduct(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            {/* Product Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                  {weighingProduct.name}
                </h4>
                <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                  Rate: {settings.currency}{weighingProduct.price}/{weighingProduct.unit}
                </span>
              </div>
            </div>

            {/* Mode Switcher */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
              gap: '3px'
            }}>
              <button
                onClick={() => setWeightMode('weight')}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: weightMode === 'weight' ? 'var(--instamart-green)' : 'transparent',
                  color: weightMode === 'weight' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                By Weight (kg/g)
              </button>

              <button
                onClick={() => setWeightMode('amount')}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: weightMode === 'amount' ? 'var(--instamart-green)' : 'transparent',
                  color: weightMode === 'amount' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                By Amount (₹)
              </button>
            </div>

            {/* Amount Calculator Mode */}
            {weightMode === 'amount' && (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(252,128,25,0.06)',
                border: '1px solid rgba(252,128,25,0.2)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <span style={{ color: 'var(--swiggy-orange)', fontSize: '11px', fontWeight: '600' }}>
                  Target Amount ({settings.currency})
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input
                    type="number"
                    placeholder="Enter ₹"
                    value={targetAmountInput}
                    onChange={(e) => handleAmountToWeight(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, height: '34px', minHeight: '34px', fontSize: '13px' }}
                    autoFocus
                  />
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountToWeight(amt.toString())}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clean Digital Scale Readout */}
            <div style={{
              padding: '12px',
              backgroundColor: '#050a14',
              borderRadius: '10px',
              border: '1px solid var(--instamart-green)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span className="mono" style={{ fontSize: '30px', fontWeight: '700', color: '#10b981', letterSpacing: '1px' }}>
                {netWeight} <span style={{ fontSize: '15px', color: '#6ee7b7' }}>{weighingProduct.unit}</span>
              </span>

              <span className="mono" style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                Price: {settings.currency}{calculatedWeightPrice.toLocaleString()}
              </span>
            </div>

            {/* Tare Container Deduction */}
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Tare Deduction:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {[
                  { label: '0g', val: 0 },
                  { label: 'Bag (-20g)', val: 0.02 },
                  { label: 'Tray (-50g)', val: 0.05 },
                  { label: 'Box (-100g)', val: 0.1 }
                ].map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setTareWeight(t.val)}
                    style={{
                      padding: '4px 2px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid',
                      borderColor: tareWeight === t.val ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: tareWeight === t.val ? 'var(--instamart-green-light)' : 'var(--bg-input)',
                      color: tareWeight === t.val ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Presets:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                {[0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setSimulatedWeight(w);
                      setTargetAmountInput('');
                    }}
                    style={{
                      padding: '5px 2px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid',
                      borderColor: simulatedWeight === w ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: simulatedWeight === w ? 'var(--instamart-green)' : 'var(--bg-card)',
                      color: simulatedWeight === w ? '#ffffff' : 'var(--text-main)',
                      fontSize: '10.5px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {w >= 1 ? `${w}kg` : `${w * 1000}g`}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bill */}
            <button
              onClick={() => {
                addToCart(weighingProduct, netWeight);
                setWeighingProduct(null);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '2px' }}
            >
              Add {netWeight}{weighingProduct.unit} ({settings.currency}{calculatedWeightPrice.toLocaleString()})
            </button>
          </div>
        </div>
      )}

      {/* AUTOMOTIVE INSPECTION CHECKLIST MODAL */}
      {showInspectionModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare color="#3b82f6" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  Inspection Checklist
                </h3>
              </div>
              <button onClick={() => setShowInspectionModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="form-label">Fuel Level:</label>
                <select
                  className="form-select"
                  value={inspectionData.fuelLevel}
                  onChange={(e) => setInspectionData({ ...inspectionData, fuelLevel: e.target.value })}
                >
                  <option value="Reserve / Low">Reserve / Low</option>
                  <option value="25%">25% Tank</option>
                  <option value="50%">50% Tank</option>
                  <option value="75%">75% Tank</option>
                  <option value="100% Full">100% Full</option>
                </select>
              </div>

              {[
                { id: 'scratchesChecked', label: 'Exterior Scratches Documented' },
                { id: 'spareTyrePresent', label: 'Spare Wheel Checked' },
                { id: 'batteryGood', label: 'Battery Checked' },
                { id: 'acWorking', label: 'AC Working' }
              ].map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={inspectionData[item.id]}
                    onChange={(e) => setInspectionData({ ...inspectionData, [item.id]: e.target.checked })}
                    style={{ width: '15px', height: '15px', accentColor: 'var(--instamart-green)' }}
                  />
                  <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{item.label}</span>
                </label>
              ))}

              <button
                onClick={() => setShowInspectionModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', marginTop: '6px', fontSize: '13px' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '380px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
              Add Customer
            </h3>
            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="form-label">Name *</label>
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
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddCustomerModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
