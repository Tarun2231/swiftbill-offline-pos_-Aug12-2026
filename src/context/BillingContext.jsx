import React, { createContext, useContext, useState, useEffect } from 'react';

const BillingContext = createContext();

const STORAGE_KEY = 'SWIFTBILL_MULTI_BUSINESS_V4';

// Default Business Templates
const INITIAL_BUSINESS_TEMPLATES = {
  grocery: {
    id: 'grocery',
    name: 'Fresh Mart Grocery & Organic Produce',
    type: 'Grocery & Daily Staples',
    icon: 'ShoppingBag',
    settings: {
      storeName: 'Fresh Mart Grocery & Produce',
      tagline: 'Farm Fresh Fruits, Vegetables, Dairy & Quality Meat',
      address: '45 Green Market Road, Sector 12',
      phone: '+91 98111 22233',
      email: 'sales@freshmartgrocery.com',
      gstin: '27GROCERY9999A1Z1',
      currency: '₹',
      taxRates: [0, 5, 12, 18],
      invoicePrefix: 'GRO-',
      nextInvoiceNumber: 2001,
      terms: '1. Fresh produce once sold cannot be returned after 24 hours.\n2. Please check weights before leaving the counter.'
    },
    products: [
      { id: 'g1', name: 'Fresh Organic Apples (Shimla)', sku: 'FR-APP-01', category: 'Fruits', price: 180, purchaseCost: 120, stock: 45, unit: 'kg', isWeightBased: true, taxRate: 0, minStockAlert: 10, expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(), image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop' },
      { id: 'g2', name: 'Farm Fresh Bananas (Robust)', sku: 'FR-BAN-02', category: 'Fruits', price: 60, purchaseCost: 35, stock: 60, unit: 'dozen', isWeightBased: false, taxRate: 0, minStockAlert: 15, expiryDate: new Date(Date.now() + 86400000 * 3).toISOString(), image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop' },
      { id: 'g3', name: 'Red Tomatoes (Hydroponic)', sku: 'VG-TOM-01', category: 'Vegetables', price: 40, purchaseCost: 22, stock: 80, unit: 'kg', isWeightBased: true, taxRate: 0, minStockAlert: 20, expiryDate: new Date(Date.now() + 86400000 * 4).toISOString(), image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop' },
      { id: 'g4', name: 'Fresh Boneless Chicken Breast', sku: 'MT-CHK-01', category: 'Meat & Poultry', price: 290, purchaseCost: 200, stock: 25, unit: 'kg', isWeightBased: true, taxRate: 5, minStockAlert: 5, expiryDate: new Date(Date.now() + 86400000 * 2).toISOString(), image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop' },
      { id: 'g5', name: 'Fresh Toned Cow Milk (1L Pouch)', sku: 'DY-MLK-01', category: 'Dairy & Eggs', price: 66, purchaseCost: 55, stock: 100, unit: 'pkt', isWeightBased: false, taxRate: 0, minStockAlert: 25, expiryDate: new Date(Date.now() + 86400000 * 2).toISOString(), image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop' },
      { id: 'g6', name: 'Premium Basmati Rice (5kg Bag)', sku: 'GR-RCE-05', category: 'Staples & Grains', price: 450, purchaseCost: 320, stock: 30, unit: 'bag', isWeightBased: false, taxRate: 5, minStockAlert: 8, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop' }
    ]
  },
  automotive: {
    id: 'automotive',
    name: 'Apex Auto Detailing & Repair Garage',
    type: 'Automotive & Detailing',
    icon: 'Car',
    settings: {
      storeName: 'Apex Auto Detailing & Service Garage',
      tagline: 'Car Detailing, Ceramic Coating & Mechanical Repair',
      address: '88 Industrial Hub, Ring Road West',
      phone: '+91 97777 88899',
      email: 'service@apexautogarage.com',
      gstin: '27AUTO9999B1Z2',
      currency: '₹',
      taxRates: [0, 18, 28],
      invoicePrefix: 'JOB-',
      nextInvoiceNumber: 4001,
      terms: '1. Vehicle tested & inspected before delivery.\n2. Service warranty valid for 1,000 km or 30 days.'
    },
    products: [
      { id: 'a1', name: 'Full Body Ceramic Coating Package', sku: 'DET-CER-01', category: 'Detailing Services', price: 14999, purchaseCost: 4000, stock: 999, unit: 'job', isWeightBased: false, taxRate: 18, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=300&auto=format&fit=crop' },
      { id: 'a2', name: 'Full Exterior Pressure Foam Wash & Wax', sku: 'DET-WSH-01', category: 'Detailing Services', price: 799, purchaseCost: 150, stock: 999, unit: 'job', isWeightBased: false, taxRate: 18, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=300&auto=format&fit=crop' },
      { id: 'a3', name: 'Engine Oil Change + Oil Filter Replacement', sku: 'SVC-OIL-01', category: 'Maintenance & Parts', price: 3499, purchaseCost: 2200, stock: 40, unit: 'set', isWeightBased: false, taxRate: 18, minStockAlert: 5, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&auto=format&fit=crop' },
      { id: 'a4', name: '3D Wheel Alignment & Balancing', sku: 'SVC-WHL-01', category: 'Maintenance & Parts', price: 950, purchaseCost: 200, stock: 999, unit: 'job', isWeightBased: false, taxRate: 18, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=300&auto=format&fit=crop' },
      { id: 'a5', name: 'Brake Pad Replacement (Front Pair)', sku: 'PRT-BRK-01', category: 'Spare Parts', price: 2850, purchaseCost: 1800, stock: 15, unit: 'pair', isWeightBased: false, taxRate: 28, minStockAlert: 3, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop' }
    ]
  },
  restaurant: {
    id: 'restaurant',
    name: 'Bistro 99 Cafe & Dining Restaurant',
    type: 'Restaurant & Dining POS',
    icon: 'Utensils',
    settings: {
      storeName: 'Bistro 99 Gourmet Cafe & Restaurant',
      tagline: 'Artisanal Coffee, Italian Pastas & Woodfired Pizza',
      address: '12 Boulevard Street, Gourmet Hub',
      phone: '+91 96666 55544',
      email: 'orders@bistro99gourmet.com',
      gstin: '27REST9999C1Z3',
      currency: '₹',
      taxRates: [0, 5, 18],
      invoicePrefix: 'KOT-',
      nextInvoiceNumber: 7001,
      terms: '1. 5% GST applicable on food items.\n2. Please inform staff about food allergies beforehand.'
    },
    products: [
      { id: 'r1', name: 'Woodfired Margherita Pizza (12")', sku: 'PIZ-MAR-12', category: 'Pizzas & Pastas', price: 449, purchaseCost: 120, stock: 999, unit: 'plate', isWeightBased: false, taxRate: 5, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop' },
      { id: 'r2', name: 'Creamy Alfredo Penne Pasta with Garlic Bread', sku: 'PST-ALF-01', category: 'Pizzas & Pastas', price: 389, purchaseCost: 95, stock: 999, unit: 'plate', isWeightBased: false, taxRate: 5, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628876c?w=300&auto=format&fit=crop' },
      { id: 'r3', name: 'Iced Hazelnut Cappuccino', sku: 'BEV-CPN-01', category: 'Beverages & Coffee', price: 210, purchaseCost: 45, stock: 999, unit: 'cup', isWeightBased: false, taxRate: 5, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop' },
      { id: 'r4', name: 'Classic Grilled Chicken Club Sandwich', sku: 'SND-CHK-01', category: 'Burgers & Starters', price: 280, purchaseCost: 80, stock: 999, unit: 'plate', isWeightBased: false, taxRate: 5, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop' },
      { id: 'r5', name: 'Triple Chocolate Lava Cake with Ice Cream', sku: 'DES-LVA-01', category: 'Desserts', price: 240, purchaseCost: 60, stock: 999, unit: 'plate', isWeightBased: false, taxRate: 5, minStockAlert: 1, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop' }
    ]
  },
  retail: {
    id: 'retail',
    name: 'TechNova Retail & Gadgets Store',
    type: 'General Superstore & Electronics',
    icon: 'Package',
    settings: {
      storeName: 'TechNova Solutions & Retail',
      tagline: 'Electronics, Accessories & Tech Services',
      address: '102 Silicon Avenue, Tech Park, Metropolis',
      phone: '+91 98765 43210',
      email: 'contact@technovaretail.com',
      gstin: '27AAAAA0000A1Z5',
      currency: '₹',
      taxRates: [0, 5, 12, 18, 28],
      invoicePrefix: 'INV-',
      nextInvoiceNumber: 1024,
      terms: '1. Goods once sold are non-refundable.\n2. Warranty covers manufacturing defects only.'
    },
    products: [
      { id: 'p1', name: 'Wireless Noise Cancelling Headphones', sku: 'WNC-100', category: 'Electronics', price: 4999, purchaseCost: 3500, stock: 24, unit: 'pcs', isWeightBased: false, taxRate: 18, minStockAlert: 5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop' },
      { id: 'p2', name: 'Ergonomic Mechanical Keyboard RGB', sku: 'KB-MECH-RGB', category: 'Peripherals', price: 2899, purchaseCost: 1900, stock: 15, unit: 'pcs', isWeightBased: false, taxRate: 18, minStockAlert: 3, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop' }
    ]
  }
};

export const BillingProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse multi-business storage:', e);
    }
    return {
      auth: { isAuthenticated: false, pin: '1234' },
      theme: 'dark',
      activeBusinessId: 'grocery',
      businesses: INITIAL_BUSINESS_TEMPLATES,
      customers: [
        { id: 'c1', name: 'Walk-in Customer', phone: '-', email: '-', address: '-', gstin: '-', balance: 0 },
        { id: 'c2', name: 'Apex Corp', phone: '+91 91234 56789', email: 'accounts@apex.com', address: 'IT Park', gstin: '27BBBBB1111B1Z2', balance: 0 }
      ],
      invoices: [
        {
          id: 'GRO-1001',
          businessId: 'grocery',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          customer: { id: 'c2', name: 'Apex Corp', phone: '+91 91234 56789' },
          items: [
            { id: 'g1', name: 'Fresh Organic Apples (Shimla)', sku: 'FR-APP-01', price: 180, qty: 3, unit: 'kg', isWeightBased: true, taxRate: 0, total: 540 },
            { id: 'g5', name: 'Fresh Toned Cow Milk (1L Pouch)', sku: 'DY-MLK-01', price: 66, qty: 4, unit: 'pkt', isWeightBased: false, taxRate: 0, total: 264 }
          ],
          subtotal: 804,
          taxAmount: 0,
          cgst: 0,
          sgst: 0,
          discountPercent: 5,
          discountAmount: 40.2,
          grandTotal: 764,
          paidAmount: 764,
          dueAmount: 0,
          paymentMethod: 'UPI',
          status: 'Paid'
        },
        {
          id: 'GRO-1002',
          businessId: 'grocery',
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          customer: { id: 'c2', name: 'Apex Corp', phone: '+91 91234 56789' },
          items: [
            { id: 'g6', name: 'Premium Basmati Rice (5kg Bag)', sku: 'GR-RCE-05', price: 450, qty: 2, unit: 'bag', isWeightBased: false, taxRate: 5, total: 945 },
            { id: 'g3', name: 'Red Tomatoes (Hydroponic)', sku: 'VG-TOM-01', price: 40, qty: 2.5, unit: 'kg', isWeightBased: true, taxRate: 0, total: 100 }
          ],
          subtotal: 1045,
          taxAmount: 45,
          cgst: 22.5,
          sgst: 22.5,
          discountPercent: 0,
          discountAmount: 0,
          grandTotal: 1045,
          paidAmount: 1045,
          dueAmount: 0,
          paymentMethod: 'Cash',
          status: 'Paid'
        }
      ],
      quotations: [],
      returns: [],
      expenses: [],
      shiftRegister: {
        isOpen: true,
        openingCash: 2500,
        openedAt: new Date().toISOString(),
        cashPayouts: []
      },
      restaurantTables: [
        { id: 'T1', name: 'Table 1', section: 'Main Hall', capacity: 2, status: 'available', seatedAt: null, currentItems: [] },
        { 
          id: 'T2', 
          name: 'Table 2', 
          section: 'Main Hall', 
          capacity: 4, 
          status: 'occupied', 
          seatedAt: new Date(Date.now() - 15 * 60000).toISOString(), 
          currentItems: [
            { id: 'r1', name: 'Woodfired Margherita Pizza', price: 449, qty: 1, kotId: 'KOT-101', status: 'Cooking', orderedAt: new Date(Date.now() - 15 * 60000).toISOString(), estMins: 15 },
            { id: 'r3', name: 'Iced Hazelnut Cappuccino', price: 210, qty: 2, kotId: 'KOT-101', status: 'Served', orderedAt: new Date(Date.now() - 15 * 60000).toISOString(), estMins: 8 }
          ] 
        },
        { id: 'T3', name: 'Table 3', section: 'Main Hall', capacity: 4, status: 'available', seatedAt: null, currentItems: [] },
        { id: 'T4', name: 'Table 4', section: 'Main Hall', capacity: 6, status: 'available', seatedAt: null, currentItems: [] },
        { 
          id: 'VIP1', 
          name: 'VIP Booth', 
          section: 'Lounge', 
          capacity: 8, 
          status: 'occupied', 
          seatedAt: new Date(Date.now() - 28 * 60000).toISOString(), 
          currentItems: [
            { id: 'r2', name: 'Creamy Alfredo Penne Pasta', price: 389, qty: 2, kotId: 'KOT-102', status: 'Served', orderedAt: new Date(Date.now() - 28 * 60000).toISOString(), estMins: 20 },
            { id: 'r5', name: 'Triple Chocolate Lava Cake', price: 240, qty: 2, kotId: 'KOT-103', status: 'Cooking', orderedAt: new Date(Date.now() - 10 * 60000).toISOString(), estMins: 12 }
          ] 
        },
        { id: 'P1', name: 'Patio 1', section: 'Terrace', capacity: 4, status: 'available', seatedAt: null, currentItems: [] },
        { id: 'P2', name: 'Patio 2', section: 'Terrace', capacity: 4, status: 'available', seatedAt: null, currentItems: [] }
      ],
      kitchenOrders: [
        {
          id: 'KOT-101',
          tableNo: 'Table 2',
          orderType: 'Dine-In',
          time: new Date(Date.now() - 15 * 60000).toISOString(),
          items: [
            { name: 'Woodfired Margherita Pizza', qty: 1, notes: 'Crispy' },
            { name: 'Iced Hazelnut Cappuccino', qty: 2, notes: 'Less sugar' }
          ],
          status: 'Preparing'
        }
      ],
      serviceJobs: [
        {
          id: 'JOB-401',
          vehicleNo: 'MH 12 AB 9988',
          vehicleModel: 'BMW 320d (Sedan)',
          customerName: 'Vikram Mehta',
          phone: '+91 98222 33445',
          serviceName: 'Full Ceramic Coating & Paint Correction',
          technician: 'Rajesh Sharma',
          receivedAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'In Detailing'
        },
        {
          id: 'JOB-402',
          vehicleNo: 'KA 03 XY 1122',
          vehicleModel: 'Hyundai Creta (SUV)',
          customerName: 'Ananya Roy',
          phone: '+91 97444 55667',
          serviceName: 'Synthetic Oil Change & Wheel Balancing',
          technician: 'Sunil Kumar',
          receivedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'Ready for Delivery'
        }
      ]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      document.documentElement.setAttribute('data-theme', data.theme || 'dark');
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  // Auth & Admin Actions
  const login = (inputPin) => {
    if (inputPin === (data.auth?.pin || '1234')) {
      setData((prev) => ({
        ...prev,
        auth: { ...prev.auth, isAuthenticated: true }
      }));
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin PIN. (Default: 1234)' };
  };

  const logout = () => {
    setData((prev) => ({
      ...prev,
      auth: { ...prev.auth, isAuthenticated: false }
    }));
  };

  // Switch Active Business
  const switchBusiness = (businessId) => {
    if (data.businesses[businessId]) {
      setData((prev) => ({
        ...prev,
        activeBusinessId: businessId
      }));
    }
  };

  // Create New Custom Business Profile
  const createBusiness = (newBiz) => {
    const id = 'biz_' + Date.now();
    const formatted = {
      id,
      name: newBiz.name,
      type: newBiz.type || 'Custom Retail & Services',
      icon: newBiz.icon || 'Store',
      settings: {
        storeName: newBiz.name,
        tagline: newBiz.tagline || 'Quality Goods & Services',
        address: newBiz.address || 'Local Marketplace',
        phone: newBiz.phone || '+91 90000 00000',
        email: newBiz.email || 'store@business.com',
        gstin: newBiz.gstin || '',
        currency: newBiz.currency || '₹',
        taxRates: [0, 5, 12, 18],
        invoicePrefix: newBiz.invoicePrefix || 'INV-',
        nextInvoiceNumber: 1001,
        terms: 'Goods once sold are subject to store warranty terms.'
      },
      products: []
    };

    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [id]: formatted
      },
      activeBusinessId: id
    }));

    return formatted;
  };

  // Theme Toggle
  const toggleTheme = () => {
    setData((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      return { ...prev, theme: nextTheme };
    });
  };

  // Helpers for current business
  const currentBusiness = data.businesses[data.activeBusinessId] || data.businesses['grocery'];
  const settings = currentBusiness.settings;
  const products = currentBusiness.products || [];

  // Product CRUD
  const addProduct = (newProd) => {
    const prod = {
      ...newProd,
      id: 'p_' + Date.now(),
      price: parseFloat(newProd.price) || 0,
      purchaseCost: parseFloat(newProd.purchaseCost) || 0,
      stock: parseFloat(newProd.stock) || 0,
      taxRate: parseFloat(newProd.taxRate) || 0,
      isWeightBased: Boolean(newProd.isWeightBased),
      minStockAlert: parseInt(newProd.minStockAlert) || 5
    };

    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          products: [prod, ...(prev.businesses[prev.activeBusinessId].products || [])]
        }
      }
    }));
  };

  const updateProduct = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          products: prev.businesses[prev.activeBusinessId].products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          )
        }
      }
    }));
  };

  const deleteProduct = (id) => {
    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          products: prev.businesses[prev.activeBusinessId].products.filter((p) => p.id !== id)
        }
      }
    }));
  };

  // Customer CRUD
  const addCustomer = (newCust) => {
    const cust = {
      ...newCust,
      id: 'c_' + Date.now(),
      balance: parseFloat(newCust.balance) || 0
    };
    setData((prev) => ({
      ...prev,
      customers: [cust, ...prev.customers]
    }));
    return cust;
  };

  const recordCustomerPayment = (customerId, amountPaid) => {
    const paid = parseFloat(amountPaid) || 0;
    if (paid <= 0) return;

    setData((prev) => ({
      ...prev,
      customers: prev.customers.map((c) =>
        c.id === customerId
          ? { ...c, balance: Math.max(0, (c.balance || 0) - paid) }
          : c
      )
    }));
  };

  // Invoice & Billing Operations
  const createInvoice = (invoicePayload) => {
    const invNum = settings.nextInvoiceNumber || 1000;
    const invId = `${settings.invoicePrefix}${invNum}`;

    const newInvoice = {
      ...invoicePayload,
      id: invId,
      businessId: data.activeBusinessId,
      date: new Date().toISOString()
    };

    // Stock deduction
    const updatedProducts = products.map((prod) => {
      const soldItem = invoicePayload.items.find((item) => item.id === prod.id);
      if (soldItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - soldItem.qty)
        };
      }
      return prod;
    });

    // Auto-create Kitchen Order Ticket if Restaurant
    let updatedKOT = data.kitchenOrders || [];
    if (data.activeBusinessId === 'restaurant') {
      updatedKOT = [
        {
          id: `KOT-${invNum}`,
          tableNo: invoicePayload.restaurantDetails?.tableNo || 'Counter',
          orderType: invoicePayload.restaurantDetails?.orderType || 'Dine-In',
          time: new Date().toISOString(),
          items: invoicePayload.items.map((i) => ({ name: i.name, qty: i.qty })),
          status: 'Preparing'
        },
        ...updatedKOT
      ];
    }

    // Auto-create Service Job Card if Automotive
    let updatedJobs = data.serviceJobs || [];
    if (data.activeBusinessId === 'automotive' && invoicePayload.automotiveDetails?.vehicleNo) {
      updatedJobs = [
        {
          id: `JOB-${invNum}`,
          vehicleNo: invoicePayload.automotiveDetails.vehicleNo,
          vehicleModel: invoicePayload.automotiveDetails.vehicleModel || 'Vehicle',
          customerName: invoicePayload.customer?.name || 'Walk-in',
          phone: invoicePayload.customer?.phone || '-',
          serviceName: invoicePayload.items.map((i) => i.name).join(', '),
          technician: invoicePayload.automotiveDetails.technicianName || 'Head Mechanic',
          receivedAt: new Date().toISOString(),
          status: 'In Detailing'
        },
        ...updatedJobs
      ];
    }

    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          settings: {
            ...settings,
            nextInvoiceNumber: invNum + 1
          },
          products: updatedProducts
        }
      },
      kitchenOrders: updatedKOT,
      serviceJobs: updatedJobs,
      invoices: [newInvoice, ...prev.invoices]
    }));

    return newInvoice;
  };

  const cancelInvoice = (invoiceId) => {
    const inv = data.invoices.find((i) => i.id === invoiceId);
    if (!inv || inv.status === 'Cancelled') return;

    const updatedProducts = products.map((prod) => {
      const soldItem = inv.items.find((item) => item.id === prod.id);
      if (soldItem) {
        return { ...prod, stock: prod.stock + soldItem.qty };
      }
      return prod;
    });

    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          products: updatedProducts
        }
      },
      invoices: prev.invoices.map((i) =>
        i.id === invoiceId ? { ...i, status: 'Cancelled', dueAmount: 0 } : i
      )
    }));
  };

  // Kitchen Order Ticket Status Update
  const updateKOTStatus = (kotId, newStatus) => {
    setData((prev) => ({
      ...prev,
      kitchenOrders: (prev.kitchenOrders || []).map((k) =>
        k.id === kotId ? { ...k, status: newStatus } : k
      )
    }));
  };

  // RESTAURANT DINE-IN TABLE ORDERING & KOT
  const fireKOT = (tableNo, items, chefNotes = '') => {
    const kotNum = Math.floor(100 + Math.random() * 900);
    const kotId = `KOT-${kotNum}`;
    const now = new Date().toISOString();

    const newKOT = {
      id: kotId,
      tableNo: tableNo,
      orderType: 'Dine-In',
      time: now,
      items: items.map((i) => ({ name: i.name, qty: i.qty, notes: chefNotes })),
      status: 'Preparing'
    };

    // Prepare table items with live cooking status & timing
    const tableItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      taxRate: i.taxRate || 5,
      unit: i.unit || 'plate',
      kotId: kotId,
      status: 'Cooking',
      orderedAt: now,
      estMins: i.category?.includes('Pizza') ? 15 : i.category?.includes('Beverage') ? 5 : 12
    }));

    setData((prev) => {
      const currentTables = prev.restaurantTables || [];
      const updatedTables = currentTables.map((t) => {
        if (t.name === tableNo || t.id === tableNo) {
          return {
            ...t,
            status: 'occupied',
            seatedAt: t.seatedAt || now,
            currentItems: [...(t.currentItems || []), ...tableItems]
          };
        }
        return t;
      });

      return {
        ...prev,
        restaurantTables: updatedTables,
        kitchenOrders: [newKOT, ...(prev.kitchenOrders || [])]
      };
    });

    return newKOT;
  };

  const updateItemCookingStatus = (tableNo, itemIndex, newStatus) => {
    setData((prev) => {
      const currentTables = prev.restaurantTables || [];
      const updatedTables = currentTables.map((t) => {
        if (t.name === tableNo || t.id === tableNo) {
          const updatedItems = [...(t.currentItems || [])];
          if (updatedItems[itemIndex]) {
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], status: newStatus };
          }
          return { ...t, currentItems: updatedItems };
        }
        return t;
      });
      return { ...prev, restaurantTables: updatedTables };
    });
  };

  const clearTable = (tableNo) => {
    setData((prev) => {
      const currentTables = prev.restaurantTables || [];
      const updatedTables = currentTables.map((t) => {
        if (t.name === tableNo || t.id === tableNo) {
          return { ...t, status: 'available', seatedAt: null, currentItems: [] };
        }
        return t;
      });
      return { ...prev, restaurantTables: updatedTables };
    });
  };

  const addTable = (newTable) => {
    const tableObj = {
      id: 'T_' + Date.now(),
      name: newTable.name || `Table ${Math.floor(10 + Math.random() * 90)}`,
      section: newTable.section || 'Main Dining Hall',
      capacity: parseInt(newTable.capacity) || 4,
      status: 'available',
      seatedAt: null,
      currentItems: []
    };

    setData((prev) => ({
      ...prev,
      restaurantTables: [...(prev.restaurantTables || []), tableObj]
    }));

    return tableObj;
  };

  const deleteTable = (tableId) => {
    setData((prev) => ({
      ...prev,
      restaurantTables: (prev.restaurantTables || []).filter(t => t.id !== tableId && t.name !== tableId)
    }));
  };

  // Automotive Service Job Status Update
  const updateJobStatus = (jobId, newStatus) => {
    setData((prev) => ({
      ...prev,
      serviceJobs: (prev.serviceJobs || []).map((j) =>
        j.id === jobId ? { ...j, status: newStatus } : j
      )
    }));
  };

  // Sales Return
  const processReturn = (returnPayload) => {
    const cnNum = settings.nextCreditNoteNumber || 200;
    const cnId = `${settings.creditNotePrefix || 'CN-'}${cnNum}`;

    const newReturn = {
      ...returnPayload,
      id: cnId,
      businessId: data.activeBusinessId,
      date: new Date().toISOString()
    };

    const updatedProducts = products.map((prod) => {
      const returnedItem = returnPayload.returnedItems.find((item) => item.id === prod.id);
      if (returnedItem) {
        return { ...prod, stock: prod.stock + returnedItem.returnQty };
      }
      return prod;
    });

    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          products: updatedProducts
        }
      },
      returns: [newReturn, ...prev.returns]
    }));

    return newReturn;
  };

  // Quotations
  const createQuotation = (quotationPayload) => {
    const qNum = settings.nextQuotationNumber || 500;
    const qId = `${settings.quotationPrefix || 'QTN-'}${qNum}`;

    const newQuotation = {
      ...quotationPayload,
      id: qId,
      businessId: data.activeBusinessId,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          settings: {
            ...settings,
            nextQuotationNumber: qNum + 1
          }
        }
      },
      quotations: [newQuotation, ...prev.quotations]
    }));

    return newQuotation;
  };

  const convertQuotationToInvoice = (quotationId) => {
    const qtn = data.quotations.find((q) => q.id === quotationId);
    if (!qtn) return null;

    const createdInv = createInvoice({
      customer: qtn.customer,
      items: qtn.items,
      subtotal: qtn.subtotal,
      taxAmount: qtn.taxAmount,
      cgst: qtn.taxAmount / 2,
      sgst: qtn.taxAmount / 2,
      discountPercent: qtn.discountPercent || 0,
      discountAmount: qtn.discountAmount || 0,
      grandTotal: qtn.grandTotal,
      paidAmount: qtn.grandTotal,
      dueAmount: 0,
      paymentMethod: 'Cash',
      status: 'Paid',
      automotiveDetails: qtn.automotiveDetails,
      restaurantDetails: qtn.restaurantDetails
    });

    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) =>
        q.id === quotationId ? { ...q, status: 'Converted' } : q
      )
    }));

    return createdInv;
  };

  const deleteQuotation = (id) => {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.filter((q) => q.id !== id)
    }));
  };

  // Expenses
  const addExpense = (newExpense) => {
    const exp = {
      ...newExpense,
      id: 'e_' + Date.now(),
      businessId: data.activeBusinessId,
      amount: parseFloat(newExpense.amount) || 0,
      date: new Date().toISOString()
    };

    setData((prev) => ({
      ...prev,
      expenses: [exp, ...prev.expenses]
    }));
  };

  const deleteExpense = (id) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id)
    }));
  };

  // Settings
  const updateSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      businesses: {
        ...prev.businesses,
        [prev.activeBusinessId]: {
          ...prev.businesses[prev.activeBusinessId],
          settings: { ...settings, ...newSettings }
        }
      }
    }));
  };

  // Cash Register Shift Actions
  const recordCashPayout = (reason, amount) => {
    setData((prev) => ({
      ...prev,
      shiftRegister: {
        ...prev.shiftRegister,
        cashPayouts: [
          ...(prev.shiftRegister.cashPayouts || []),
          { reason, amount: parseFloat(amount) || 0, time: new Date().toISOString() }
        ]
      }
    }));
  };

  // Export / Import
  const exportDataJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SwiftBill_MultiBusiness_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.businesses) {
        setData(parsed);
        return { success: true, message: 'Data restored successfully!' };
      }
      return { success: false, message: 'Invalid backup file structure.' };
    } catch (e) {
      return { success: false, message: 'Failed to parse JSON file.' };
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <BillingContext.Provider
      value={{
        auth: data.auth || { isAuthenticated: false },
        login,
        logout,
        activeBusinessId: data.activeBusinessId,
        activeBusiness: currentBusiness,
        businesses: data.businesses,
        switchBusiness,
        createBusiness,
        theme: data.theme || 'dark',
        toggleTheme,
        settings,
        products,
        customers: data.customers,
        invoices: data.invoices.filter((i) => !i.businessId || i.businessId === data.activeBusinessId),
        quotations: data.quotations.filter((q) => !q.businessId || q.businessId === data.activeBusinessId),
        returns: data.returns.filter((r) => !r.businessId || r.businessId === data.activeBusinessId),
        expenses: data.expenses.filter((e) => !e.businessId || e.businessId === data.activeBusinessId),
        kitchenOrders: data.kitchenOrders || [],
        restaurantTables: data.restaurantTables || [],
        serviceJobs: data.serviceJobs || [],
        shiftRegister: data.shiftRegister || { isOpen: true, openingCash: 2000, cashPayouts: [] },
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        recordCustomerPayment,
        createInvoice,
        cancelInvoice,
        processReturn,
        createQuotation,
        convertQuotationToInvoice,
        deleteQuotation,
        addExpense,
        deleteExpense,
        updateSettings,
        updateKOTStatus,
        updateJobStatus,
        fireKOT,
        updateItemCookingStatus,
        clearTable,
        addTable,
        deleteTable,
        recordCashPayout,
        exportDataJSON,
        importDataJSON,
        resetToDefaults
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => useContext(BillingContext);
