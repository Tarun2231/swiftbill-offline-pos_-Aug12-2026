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
  RotateCcw,
  Flame,
  Timer
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
    addCustomer,
    restaurantTables,
    fireKOT,
    updateItemCookingStatus,
    clearTable
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
  const [showTableTimingModal, setShowTableTimingModal] = useState(false);

  useEffect(() => {
    if (initialTable) {
      setTableNo(initialTable);
    }
  }, [initialTable]);

  // Active Table Data & Running Tab
  const activeTableData = useMemo(() => {
    if (activeBusinessId !== 'restaurant') return null;
    return (restaurantTables || []).find((t) => t.name === tableNo || t.id === tableNo);
  }, [restaurantTables, tableNo, activeBusinessId]);

  const runningTableItems = activeTableData?.currentItems || [];
  const isTableOccupied = Boolean(activeTableData && activeTableData.status === 'occupied' && runningTableItems.length > 0);

  const getElapsedTime = (isoString) => {
    if (!isoString) return 'Just seated';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    return `${mins}m ago`;
  };

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
    return ['All Items', ...Array.from(set)];
  }, [products]);

  const getCategoryEmoji = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('all')) return '⚡';
    if (c.includes('fruit')) return '🍎';
    if (c.includes('veg')) return '🥦';
    if (c.includes('dairy') || c.includes('milk')) return '🥛';
    if (c.includes('meat') || c.includes('chicken') || c.includes('fish')) return '🍗';
    if (c.includes('grain') || c.includes('rice') || c.includes('staple')) return '🍚';
    if (c.includes('snack') || c.includes('biscuit')) return '🍪';
    if (c.includes('drink') || c.includes('juice') || c.includes('beverage') || c.includes('coffee')) return '☕';
    if (c.includes('auto') || c.includes('service')) return '🚗';
    if (c.includes('pizza') || c.includes('food') || c.includes('pasta')) return '🍕';
    return '🍽️';
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All Items' || p.category === selectedCategory;
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

  // Calculations: Combine running items from the table (if dining) + active cart items
  const combinedItemsForBilling = useMemo(() => {
    const combined = [...runningTableItems.map(ri => ({ ...ri, isRunningItem: true }))];
    cart.forEach(ci => {
      combined.push({ ...ci, isRunningItem: false });
    });
    return combined;
  }, [runningTableItems, cart]);

  const rawSubtotal = combinedItemsForBilling.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalCost = combinedItemsForBilling.reduce((acc, item) => acc + (item.purchaseCost || 0) * item.qty, 0);
  const discountAmount = (rawSubtotal * (parseFloat(discountPercent) || 0)) / 100;
  const taxableSubtotal = rawSubtotal - discountAmount;

  const totalTax = combinedItemsForBilling.reduce((acc, item) => {
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

  // RESTAURANT: FIRE KOT ACTION (Send to kitchen, keep table occupied)
  const handleFireKOT = () => {
    if (cart.length === 0) return;
    fireKOT(tableNo, cart, chefNotes);
    setCart([]);
    setChefNotes('');
    alert(`🔥 Kitchen Order Ticket (KOT) sent to kitchen for ${tableNo}!`);
  };

  // CHECKOUT & POST-DINING SETTLEMENT ACTION (Pay after eating)
  const handleCheckout = () => {
    if (combinedItemsForBilling.length === 0) return;

    if (paymentMethod === 'UPI' && !showUpiModal) {
      setShowUpiModal(true);
      return;
    }

    const invoiceData = {
      customer: selectedCustomer,
      items: combinedItemsForBilling.map((i) => ({
        id: i.id,
        name: i.name,
        sku: i.sku || 'KOT-ITEM',
        price: i.price,
        qty: i.qty,
        unit: i.unit || 'plate',
        isWeightBased: Boolean(i.isWeightBased),
        taxRate: i.taxRate || 5,
        total: Math.round(i.price * i.qty * (1 + (i.taxRate || 5) / 100))
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
        chefNotes,
        seatedAt: activeTableData?.seatedAt
      } : null
    };

    const created = createInvoice(invoiceData);

    // If restaurant table was occupied, clear the table after billing!
    if (activeBusinessId === 'restaurant' && orderType === 'Dine-In') {
      clearTable(tableNo);
    }

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
    if (combinedItemsForBilling.length === 0) return;

    createQuotation({
      customer: selectedCustomer,
      items: combinedItemsForBilling.map((i) => ({
        id: i.id,
        name: i.name,
        sku: i.sku || 'ITEM',
        price: i.price,
        qty: i.qty,
        unit: i.unit || 'pcs',
        taxRate: i.taxRate || 0,
        total: Math.round(i.price * i.qty * (1 + (i.taxRate || 0) / 100))
      })),
      subtotal: Math.round(taxableSubtotal * 100) / 100,
      taxAmount: Math.round(totalTax * 100) / 100,
      discountPercent: parseFloat(discountPercent) || 0,
      discountAmount: Math.round(discountAmount * 100) / 100,
      grandTotal: grandTotal,
      automotiveDetails: activeBusinessId === 'automotive' ? { vehicleNo, vehicleModel, odometerKm, technicianName } : null,
      restaurantDetails: activeBusinessId === 'restaurant' ? { tableNo, orderType, chefNotes } : null
    });

    alert('Estimate saved successfully!');
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
      
      {/* Mobile Segmented Switcher */}
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
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={14} />
            Browse Menu ({products.length})
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
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Bill ({combinedItemsForBilling.length})</span>
            <span className="badge" style={{
              backgroundColor: mobileTab === 'cart' ? '#ffffff' : 'var(--instamart-green)',
              color: mobileTab === 'cart' ? 'var(--instamart-green)' : '#ffffff',
              fontSize: '10.5px',
              padding: '2px 6px',
              fontWeight: '700'
            }}>
              {settings.currency}{grandTotal}
            </span>
          </button>
        </div>
      )}

      {/* Left Area: Product Catalog */}
      {showCatalogPanel && (
        <div className="pos-catalog-panel" style={{
          flex: 1,
          padding: isMobile ? '10px 12px' : '16px 22px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span className="time-badge">
                  <Zap size={11} fill="var(--swiggy-orange)" /> Quick POS
                </span>
                <h2 style={{
                  fontSize: isMobile ? '16px' : '18px',
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
                  fontSize: '11.5px',
                  padding: '5px 10px',
                  height: '28px',
                  flexShrink: 0,
                  fontWeight: '600',
                  gap: '4px'
                }}
              >
                {showProfitPeek ? <EyeOff size={13} /> : <Eye size={13} color="var(--instamart-green)" />}
                {showProfitPeek ? `Margin: ${settings.currency}${estimatedGrossProfit.toLocaleString()}` : 'Profit Peek'}
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                placeholder={`Search catalog, food dishes, or SKU code...`}
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
                    top: '9px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category Rail */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '3px', scrollbarWidth: 'none' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const emoji = getCategoryEmoji(cat);

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '12px',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
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

          {/* Product Grid */}
          <div className="product-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(185px, 1fr))',
            gap: isMobile ? '8px' : '12px',
            alignContent: 'start',
            paddingBottom: isMobile && combinedItemsForBilling.length > 0 ? '70px' : '16px'
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
                    border: inCart ? '1.5px solid var(--instamart-green)' : '1px solid var(--border-color)',
                    background: inCart ? 'rgba(12,131,31,0.03)' : 'var(--bg-card)',
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
                          height: isMobile ? '90px' : '110px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: isMobile ? '90px' : '110px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-dim)'
                      }}>
                        <Utensils size={28} />
                      </div>
                    )}

                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#ffffff',
                      fontSize: '9.5px',
                      fontWeight: '600',
                      padding: '2px 5px',
                      borderRadius: '3px',
                      backdropFilter: 'blur(3px)'
                    }}>
                      {prod.isWeightBased ? `per ${prod.unit}` : `1 ${prod.unit || 'plate'}`}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 style={{
                      fontSize: isMobile ? '12.5px' : '13px',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      lineHeight: '1.25',
                      wordBreak: 'break-word',
                      margin: '3px 0 0 0',
                      minHeight: '30px'
                    }}>
                      {prod.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                    <span className="mono" style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {settings.currency}{prod.price.toLocaleString()}
                    </span>
                    <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      {settings.currency}{fakeMrp}
                    </span>
                  </div>

                  {/* Weight Quick Chips */}
                  {prod.isWeightBased && !inCart && (
                    <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                      {[
                        { label: '500g', val: 0.5 },
                        { label: '1kg', val: 1.0 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => addToCart(prod, preset.val)}
                          style={{
                            flex: 1,
                            padding: '3px 0',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-muted)',
                            fontSize: '9.5px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          +{preset.label}
                        </button>
                      ))}
                      <button
                        onClick={() => openWeighingModal(prod)}
                        style={{
                          padding: '3px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--instamart-green)',
                          fontSize: '9.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title="Smart Weighing Scale Hub"
                      >
                        <Scale size={10} /> Weigh
                      </button>
                    </div>
                  )}

                  {/* Add Button */}
                  <div style={{ marginTop: '4px' }}>
                    {inCart ? (
                      <div className="instamart-stepper" style={{ height: '32px' }}>
                        <button onClick={() => adjustCartQty(prod.id, prod.isWeightBased ? -0.25 : -1)}>
                          -
                        </button>
                        <span className="instamart-stepper-qty mono" style={{ fontSize: '12px' }}>
                          {cartItem.qty} {prod.unit || 'plate'}
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
                        style={{ height: '32px', fontSize: '12.5px' }}
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
          {isMobile && combinedItemsForBilling.length > 0 && (
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
                boxShadow: '0 6px 18px rgba(12,131,31,0.4)',
                zIndex: 40,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <ShoppingBag size={18} />
                <div style={{ fontSize: '13px', fontWeight: '700' }}>
                  {tableNo}: {combinedItemsForBilling.length} items • {settings.currency}{grandTotal.toLocaleString()}
                </div>
              </div>

              <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '13px' }}>
                View Bill ➔
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Area: Bill Summary & Dine-In Tab */}
      {showCartPanel && (
        <div className="pos-cart-panel" style={{
          width: isMobile ? '100%' : '400px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isMobile && (
                  <button
                    onClick={() => setMobileTab('catalog')}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                )}
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  {activeBusinessId === 'restaurant' ? `${tableNo} Running Tab` : 'Order Summary'}
                </h3>
              </div>

              <span className="badge badge-success" style={{ fontSize: '10.5px', padding: '2px 7px' }}>
                {combinedItemsForBilling.length} items
              </span>
            </div>

            {/* Customer Picker */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '11px' }}>Customer Details</label>
                <button
                  onClick={() => setShowCustomerHistoryModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--instamart-green)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <History size={12} />
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
                  style={{ flex: 1, fontSize: '12.5px', height: '34px', minHeight: '34px', padding: '4px 10px' }}
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
                  title="Add New Customer"
                >
                  <UserPlus size={15} color="var(--instamart-green)" />
                </button>
              </div>
            </div>

            {/* RESTAURANT TABLE CONTROLS & TIMING BANNER */}
            {activeBusinessId === 'restaurant' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '10.5px' }}>Dining Table</label>
                    <select
                      className="form-select"
                      value={tableNo}
                      onChange={(e) => setTableNo(e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px', height: '30px', minHeight: '30px' }}
                    >
                      {(restaurantTables || []).map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} {t.status === 'occupied' ? '• Dining' : '• Vacant'}
                        </option>
                      ))}
                      <option value="Takeaway Counter">Takeaway Counter</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '10.5px' }}>Order Type</label>
                    <select
                      className="form-select"
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px', height: '30px', minHeight: '30px' }}
                    >
                      <option value="Dine-In">Dine-In</option>
                      <option value="Takeaway">Takeaway</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                </div>

                {/* Table Live Status Banner & Timer Tracker Button */}
                {isTableOccupied && (
                  <div style={{
                    marginTop: '2px',
                    padding: '8px 10px',
                    backgroundColor: 'rgba(245,158,11,0.08)',
                    borderRadius: '6px',
                    border: '1px solid rgba(245,158,11,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px' }}>
                      <Clock size={13} color="#f59e0b" />
                      <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>
                        Dining ({getElapsedTime(activeTableData.seatedAt)})
                      </span>
                    </div>

                    <button
                      onClick={() => setShowTableTimingModal(true)}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '11px', height: '24px', color: '#3b82f6', gap: '3px', fontWeight: '600' }}
                    >
                      <Timer size={12} /> Status & Timer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart & Table Running Items List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            {/* 1. RUNNING DISHES ALREADY ORDERED AT THIS TABLE (Cooking/Served) */}
            {runningTableItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    Dishes at Table ({runningTableItems.length})
                  </span>
                  <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '600' }}>
                    In Kitchen / Cooking
                  </span>
                </div>

                {runningTableItems.map((item, idx) => {
                  const isCooking = item.status === 'Cooking';

                  return (
                    <div
                      key={`run_${idx}`}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            x{item.qty}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                          {item.kotId || 'KOT'} • {settings.currency}{item.price * item.qty}
                        </span>
                      </div>

                      <button
                        onClick={() => updateItemCookingStatus(tableNo, idx, isCooking ? 'Served' : 'Cooking')}
                        className={`badge badge-${isCooking ? 'warning' : 'success'}`}
                        style={{ cursor: 'pointer', border: 'none', padding: '3px 6px', fontSize: '9.5px', fontWeight: '700' }}
                        title="Click to toggle cooking / served"
                      >
                        {isCooking ? '🔥 Cooking' : '🍽️ Served'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. NEW CART ITEMS (Round 2 / Add-ons) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: runningTableItems.length > 0 ? '6px' : '0' }}>
              {runningTableItems.length > 0 && (
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  New Dishes to Fire ({cart.length})
                </div>
              )}

              {cart.length === 0 && runningTableItems.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dim)',
                  textAlign: 'center',
                  gap: '8px',
                  padding: '32px 0'
                }}>
                  <ShoppingBag size={34} opacity={0.3} />
                  <p style={{ fontSize: '12.5px', lineHeight: '1.4' }}>Cart is currently empty.<br />Add delicious dishes from menu.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--instamart-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
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
                        padding: '2px 3px'
                      }}>
                        <button
                          onClick={() => adjustCartQty(item.id, -1)}
                          style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '800', fontSize: '13px', padding: '0 4px', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span className="mono" style={{ fontSize: '11.5px', fontWeight: '700', padding: '0 3px' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => adjustCartQty(item.id, 1)}
                          style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '800', fontSize: '13px', padding: '0 4px', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <span className="mono" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', minWidth: '50px', textAlign: 'right' }}>
                        {settings.currency}{(Math.round(item.price * item.qty * 100) / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bill Summary & Actions */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Item Total ({combinedItemsForBilling.length} dishes)</span>
              <span className="mono">{settings.currency}{rawSubtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Store Discount:</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    style={{
                      padding: '2px 7px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: parseFloat(discountPercent) === pct ? 'var(--instamart-green)' : 'var(--bg-card)',
                      color: parseFloat(discountPercent) === pct ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>GST & Taxes (5%)</span>
              <span className="mono">{settings.currency}{totalTax.toFixed(2)}</span>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(12,131,31,0.3)'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Total Payable</span>
              <span className="mono" style={{ fontSize: '17px', fontWeight: '800', color: 'var(--instamart-green)' }}>
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
                      padding: '6px 4px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Icon size={14} />
                    {pm.id}
                  </button>
                );
              })}
            </div>

            {/* Quick Chef Modifiers for Restaurant Mode */}
            {activeBusinessId === 'restaurant' && cart.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Chef Instructions / Modifiers:</span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {['Less Spicy', 'Extra Cheese', 'No Onion/Garlic (Jain)', 'Gluten Free', 'Parcel Pack'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setChefNotes(prev => prev ? `${prev}, ${tag}` : tag)}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: (chefNotes || '').includes(tag) ? 'rgba(245,158,11,0.2)' : 'var(--bg-input)',
                        color: (chefNotes || '').includes(tag) ? '#f59e0b' : 'var(--text-muted)',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
                {chefNotes && (
                  <div style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: '600' }}>
                    Note: {chefNotes}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {/* RESTAURANT: FIRE KOT TO KITCHEN FIRST */}
              {activeBusinessId === 'restaurant' && cart.length > 0 && (
                <button
                  onClick={handleFireKOT}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    fontSize: '12px',
                    padding: '8px',
                    color: '#f59e0b',
                    borderColor: 'rgba(245,158,11,0.5)',
                    gap: '4px',
                    fontWeight: '700'
                  }}
                  title="Fire new food dishes to kitchen"
                >
                  <Flame size={14} /> Send KOT
                </button>
              )}

              <button
                onClick={handleCheckout}
                disabled={combinedItemsForBilling.length === 0}
                className="btn btn-primary"
                style={{
                  flex: 2,
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: combinedItemsForBilling.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <Printer size={15} />
                {activeBusinessId === 'restaurant' ? 'Settle & Print Bill' : 'Print Tax Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE LIVE TIMING & COOKING STATUS MODAL */}
      {showTableTimingModal && activeTableData && (
        <div className="modal-overlay" style={{ padding: isMobile ? '8px' : '16px' }}>
          <div className="modal-container" style={{ maxWidth: '440px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer color="#3b82f6" size={18} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {tableNo} • Order Status & Timing
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Seated {getElapsedTime(activeTableData.seatedAt)}
                  </span>
                </div>
              </div>

              <button onClick={() => setShowTableTimingModal(false)} className="btn-icon" style={{ padding: '5px' }}>
                <X size={16} />
              </button>
            </div>

            {/* Running Tab Info */}
            <div style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Running Total:</span>
                <div className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#0c831f' }}>
                  {settings.currency}{rawSubtotal.toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Kitchen Status:</span>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b' }}>
                  🔥 Preparing in Kitchen
                </div>
              </div>
            </div>

            {/* Quick 1-Click Mark All As Served */}
            {runningTableItems.length > 0 && !runningTableItems.every(i => i.status === 'Served') && (
              <button
                onClick={() => {
                  runningTableItems.forEach((_, idx) => updateItemCookingStatus(tableNo, idx, 'Served'));
                }}
                className="btn btn-secondary"
                style={{ fontSize: '11.5px', padding: '6px', color: '#0c831f', borderColor: '#0c831f', fontWeight: '700' }}
              >
                <CheckCircle2 size={13} /> Mark All {runningTableItems.length} Dishes as Served
              </button>
            )}

            {/* Dish-by-dish progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {runningTableItems.map((item, idx) => {
                const status = item.status || 'Cooking';
                const nextStatus = status === 'Cooking' ? 'Ready' : status === 'Ready' ? 'Served' : 'Cooking';
                const badgeClass = status === 'Served' ? 'badge-success' : status === 'Ready' ? 'badge-info' : 'badge-warning';
                const label = status === 'Served' ? '🍽️ Served' : status === 'Ready' ? '🔔 Ready' : '🔥 Cooking';

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {item.name} <span style={{ color: '#0c831f' }}>x{item.qty}</span>
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                        {status === 'Cooking' ? `Est. Cooking Time: ${item.estMins || 12} mins` : status === 'Ready' ? 'Ready on kitchen counter' : 'Served at dining table'}
                      </div>
                    </div>

                    <button
                      onClick={() => updateItemCookingStatus(tableNo, idx, nextStatus)}
                      className={`badge ${badgeClass}`}
                      style={{ cursor: 'pointer', border: 'none', padding: '4px 8px', fontSize: '11px', fontWeight: '700' }}
                      title="Click to cycle status: Cooking ➔ Ready ➔ Served"
                    >
                      {label}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowTableTimingModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '8px', fontSize: '12.5px', marginTop: '6px' }}
            >
              Done & Return to Billing
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMER HISTORY MODAL */}
      {showCustomerHistoryModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '6px' : '16px' }}>
          <div className="modal-container" style={{ maxWidth: '500px', padding: isMobile ? '14px' : '18px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <History size={18} color="var(--instamart-green)" />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {selectedCustomer.name} • Past Orders
                  </h3>
                </div>
              </div>

              <button onClick={() => setShowCustomerHistoryModal(false)} className="btn-icon" style={{ padding: '5px' }}>
                <X size={16} />
              </button>
            </div>

            {selectedCustomerInvoices.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                <p style={{ fontSize: '13px' }}>No previous invoices found for this customer.</p>
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
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="mono" style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {inv.id}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {formattedDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '4px 6px', backgroundColor: 'var(--bg-card)', borderRadius: '4px' }}>
                        {inv.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                            <span>
                              • {it.name} <span style={{ color: 'var(--instamart-green)', fontWeight: '600' }}>({it.qty} {it.unit || 'pcs'})</span>
                            </span>
                            
                            <button
                              onClick={() => handleReaddItem(it)}
                              className="btn btn-secondary"
                              style={{ padding: '2px 6px', fontSize: '10px', height: '22px' }}
                            >
                              + Reorder
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-dim)' }}>
                          {inv.status} • {inv.paymentMethod}
                        </span>
                        <span className="mono" style={{ fontWeight: '800', color: 'var(--instamart-green)' }}>
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
              style={{ width: '100%', padding: '8px', fontSize: '12.5px' }}
            >
              Done & Return to Billing
            </button>
          </div>
        </div>
      )}

      {/* UPI QR MODAL */}
      {showUpiModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '360px', padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone color="var(--instamart-green)" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Scan UPI QR to Pay
                </h3>
              </div>
              <button onClick={() => setShowUpiModal(false)} className="btn-icon" style={{ padding: '5px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}>
              <svg width="150" height="150" viewBox="0 0 180 180">
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

            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scan with GPay, PhonePe, Paytm, BHIM</span>
              <div className="mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--instamart-green)', marginTop: '2px' }}>
                {settings.currency}{grandTotal.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', marginTop: '12px', fontSize: '13px', fontWeight: '700' }}
            >
              Payment Confirmed & Print Bill
            </button>
          </div>
        </div>
      )}

      {/* WEIGH SCALE MODAL */}
      {weighingProduct && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '420px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale color="var(--instamart-green)" size={18} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Digital Weighing Scale Hub
                </h3>
              </div>
              <button onClick={() => setWeighingProduct(null)} className="btn-icon" style={{ padding: '5px' }}>
                <X size={16} />
              </button>
            </div>

            {/* Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700' }}>{weighingProduct.name}</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--instamart-green)' }}>
                {settings.currency}{weighingProduct.price}/{weighingProduct.unit}
              </span>
            </div>

            {/* Mode */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px',
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
                  fontSize: '12px',
                  fontWeight: '700',
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
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                By Amount (₹)
              </button>
            </div>

            {/* Amount Mode */}
            {weightMode === 'amount' && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="number"
                  placeholder="Enter ₹ amount e.g. 50"
                  value={targetAmountInput}
                  onChange={(e) => handleAmountToWeight(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, height: '34px', minHeight: '34px', fontSize: '12.5px' }}
                  autoFocus
                />
                {[20, 50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountToWeight(amt.toString())}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            )}

            {/* Scale Output */}
            <div style={{
              padding: '12px',
              backgroundColor: '#050a14',
              borderRadius: '8px',
              border: '1.5px solid var(--instamart-green)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span className="mono" style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>
                {netWeight} <span style={{ fontSize: '14px' }}>{weighingProduct.unit}</span>
              </span>
              <span className="mono" style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                Price: {settings.currency}{calculatedWeightPrice.toLocaleString()}
              </span>
            </div>

            {/* Tare */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Tare / Container Deduction:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {[
                  { label: 'None (0g)', val: 0 },
                  { label: 'Bag (-20g)', val: 0.02 },
                  { label: 'Tray (-50g)', val: 0.05 },
                  { label: 'Box (-100g)', val: 0.1 }
                ].map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setTareWeight(t.val)}
                    style={{
                      padding: '5px 2px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: tareWeight === t.val ? 'var(--instamart-green)' : 'var(--border-color)',
                      backgroundColor: tareWeight === t.val ? 'var(--instamart-green-light)' : 'var(--bg-input)',
                      color: tareWeight === t.val ? 'var(--instamart-green)' : 'var(--text-muted)',
                      fontSize: '10.5px',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {[0.25, 0.5, 0.75, 1.0, 2.0].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setSimulatedWeight(w);
                    setTargetAmountInput('');
                  }}
                  style={{
                    padding: '5px 2px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: simulatedWeight === w ? 'var(--instamart-green)' : 'var(--border-color)',
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

            <button
              onClick={() => {
                addToCart(weighingProduct, netWeight);
                setWeighingProduct(null);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '9px', fontSize: '13px', fontWeight: '700' }}
            >
              Add {netWeight}{weighingProduct.unit} ({settings.currency}{calculatedWeightPrice.toLocaleString()}) to Bill
            </button>
          </div>
        </div>
      )}

      {/* QUICK ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '360px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
              Add New Customer
            </h3>
            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '13px', height: '34px', minHeight: '34px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Mobile Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '13px', height: '34px', minHeight: '34px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddCustomerModal(false)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '700' }}>
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
