import React, { createContext, useContext, useState, useEffect } from 'react';

const BillingContext = createContext();

const STORAGE_KEY = 'SWIFTBILL_MULTI_BUSINESS_V4';

const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
    return null;
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {
      console.warn('localStorage write error:', e);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('localStorage remove error:', e);
    }
  }
};

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
      { 
        id: 'g1', 
        name: 'Onion (Ulligadda)', 
        sku: 'VG-ONN-01', 
        category: 'Vegetables', 
        price: 37, 
        mrp: 54,
        purchaseCost: 22, 
        stock: 120, 
        unit: 'kg', 
        isWeightBased: true, 
        isVeg: true,
        eta: '16 MINS',
        unitRate: '₹3.7/100 g',
        variants: [
          { label: '1 kg', weight: 1, price: 37, mrp: 54, unitRate: '₹3.7/100 g' },
          { label: '3 kg', weight: 3, price: 105, mrp: 155, unitRate: '₹3.5/100 g' },
          { label: '500 g', weight: 0.5, price: 20, mrp: 28, unitRate: '₹4.0/100 g' }
        ],
        taxRate: 0, 
        minStockAlert: 20, 
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g2', 
        name: 'Drumstick (Munagakayalu)', 
        sku: 'VG-DRM-01', 
        category: 'Vegetables', 
        price: 25, 
        mrp: 36,
        purchaseCost: 14, 
        stock: 45, 
        unit: 'pack', 
        isWeightBased: false, 
        isVeg: true,
        eta: '16 MINS',
        unitRate: '₹12.5/piece',
        variants: [
          { label: '80 - 140 g', weight: 0.1, price: 25, mrp: 36, unitRate: '₹12.5/piece' }
        ],
        taxRate: 0, 
        minStockAlert: 10, 
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g3', 
        name: 'Potato (Alugadda / Aloo)', 
        sku: 'VG-POT-01', 
        category: 'Vegetables', 
        price: 32, 
        mrp: 45,
        purchaseCost: 18, 
        stock: 90, 
        unit: 'kg', 
        isWeightBased: true, 
        isVeg: true,
        eta: '14 MINS',
        unitRate: '₹3.2/100 g',
        variants: [
          { label: '1 kg', weight: 1, price: 32, mrp: 45, unitRate: '₹3.2/100 g' },
          { label: '2 kg', weight: 2, price: 60, mrp: 90, unitRate: '₹3.0/100 g' },
          { label: '500 g', weight: 0.5, price: 18, mrp: 24, unitRate: '₹3.6/100 g' }
        ],
        taxRate: 0, 
        minStockAlert: 15, 
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g4', 
        name: 'Red Tomatoes (Hydroponic)', 
        sku: 'VG-TOM-01', 
        category: 'Vegetables', 
        price: 38, 
        mrp: 50,
        purchaseCost: 20, 
        stock: 80, 
        unit: 'kg', 
        isWeightBased: true, 
        isVeg: true,
        eta: '12 MINS',
        unitRate: '₹3.8/100 g',
        variants: [
          { label: '1 kg', weight: 1, price: 38, mrp: 50, unitRate: '₹3.8/100 g' },
          { label: '500 g', weight: 0.5, price: 20, mrp: 26, unitRate: '₹4.0/100 g' }
        ],
        taxRate: 0, 
        minStockAlert: 20, 
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g5', 
        name: 'Fresh Organic Apples (Shimla)', 
        sku: 'FR-APP-01', 
        category: 'Fruits', 
        price: 179, 
        mrp: 240,
        purchaseCost: 120, 
        stock: 45, 
        unit: 'kg', 
        isWeightBased: true, 
        isVeg: true,
        eta: '15 MINS',
        unitRate: '₹17.9/100 g',
        variants: [
          { label: '500 g', weight: 0.5, price: 95, mrp: 125, unitRate: '₹19/100 g' },
          { label: '1 kg', weight: 1, price: 179, mrp: 240, unitRate: '₹17.9/100 g' }
        ],
        taxRate: 0, 
        minStockAlert: 10, 
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g6', 
        name: 'Farm Fresh Bananas (Robusta)', 
        sku: 'FR-BAN-02', 
        category: 'Fruits', 
        price: 58, 
        mrp: 75,
        purchaseCost: 35, 
        stock: 60, 
        unit: 'dozen', 
        isWeightBased: false, 
        isVeg: true,
        eta: '10 MINS',
        unitRate: '₹4.8/piece',
        variants: [
          { label: '1 dozen', weight: 1, price: 58, mrp: 75, unitRate: '₹4.8/piece' },
          { label: '6 pcs', weight: 0.5, price: 32, mrp: 40, unitRate: '₹5.3/piece' }
        ],
        taxRate: 0, 
        minStockAlert: 15, 
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g7', 
        name: 'Fresh Boneless Chicken Breast', 
        sku: 'MT-CHK-01', 
        category: 'Meat & Poultry', 
        price: 290, 
        mrp: 360,
        purchaseCost: 200, 
        stock: 25, 
        unit: 'kg', 
        isWeightBased: true, 
        isVeg: false,
        eta: '18 MINS',
        unitRate: '₹29/100 g',
        variants: [
          { label: '500 g', weight: 0.5, price: 155, mrp: 190, unitRate: '₹31/100 g' },
          { label: '1 kg', weight: 1, price: 290, mrp: 360, unitRate: '₹29/100 g' }
        ],
        taxRate: 5, 
        minStockAlert: 5, 
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g8', 
        name: 'Fresh Toned Cow Milk (1L Pouch)', 
        sku: 'DY-MLK-01', 
        category: 'Dairy & Eggs', 
        price: 66, 
        mrp: 70,
        purchaseCost: 55, 
        stock: 100, 
        unit: 'pkt', 
        isWeightBased: false, 
        isVeg: true,
        eta: '8 MINS',
        unitRate: '₹66/L',
        variants: [
          { label: '1 Litre', weight: 1, price: 66, mrp: 70, unitRate: '₹66/L' }
        ],
        taxRate: 0, 
        minStockAlert: 25, 
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop' 
      },
      { 
        id: 'g9', 
        name: 'Premium Basmati Rice (5kg Bag)', 
        sku: 'GR-RCE-05', 
        category: 'Staples & Grains', 
        price: 450, 
        mrp: 550,
        purchaseCost: 320, 
        stock: 30, 
        unit: 'bag', 
        isWeightBased: false, 
        isVeg: true,
        eta: '20 MINS',
        unitRate: '₹90/kg',
        variants: [
          { label: '1 kg', weight: 1, price: 95, mrp: 120, unitRate: '₹9.5/100 g' },
          { label: '5 kg', weight: 5, price: 450, mrp: 550, unitRate: '₹90/kg' }
        ],
        taxRate: 5, 
        minStockAlert: 8, 
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop' 
      }
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
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.businesses) {
          if (!parsed.staffMembers || parsed.staffMembers.length === 0) {
            parsed.staffMembers = [
              { id: 'emp_1', name: 'Rahul Sharma', username: 'rahul', pin: '1111', role: 'Cashier', phone: '+91 98765 43210', active: true, createdAt: new Date().toISOString() },
              { id: 'emp_2', name: 'Priya Patel', username: 'priya', pin: '2222', role: 'Store Manager', phone: '+91 98111 22334', active: true, createdAt: new Date().toISOString() },
              { id: 'emp_3', name: 'Sameer Khan', username: 'sameer', pin: '3333', role: 'Floor Server / Waiter', phone: '+91 98222 55667', active: true, createdAt: new Date().toISOString() }
            ];
          }
          if (!parsed.auth?.currentUser) {
            parsed.auth = {
              ...(parsed.auth || {}),
              role: parsed.auth?.role || 'admin',
              currentUser: parsed.auth?.currentUser || { id: 'admin', name: 'Master Admin', username: 'admin', role: 'Master Admin' },
              pin: parsed.auth?.pin || '1234'
            };
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse multi-business storage:', e);
      }
    }
    return {
      auth: {
        isAuthenticated: false,
        role: 'admin',
        currentUser: { id: 'admin', name: 'Master Admin', username: 'admin', role: 'Master Admin' },
        pin: '1234'
      },
      staffMembers: [
        { id: 'emp_1', name: 'Rahul Sharma', username: 'rahul', pin: '1111', role: 'Cashier', phone: '+91 98765 43210', active: true, createdAt: new Date().toISOString() },
        { id: 'emp_2', name: 'Priya Patel', username: 'priya', pin: '2222', role: 'Store Manager', phone: '+91 98111 22334', active: true, createdAt: new Date().toISOString() },
        { id: 'emp_3', name: 'Sameer Khan', username: 'sameer', pin: '3333', role: 'Floor Server / Waiter', phone: '+91 98222 55667', active: true, createdAt: new Date().toISOString() }
      ],
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
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', data.theme || 'dark');
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  // Auth & Admin Actions
  const login = (inputPin) => {
    const activePin = data.auth?.pin || '1234';
    if (inputPin === activePin) {
      setData((prev) => ({
        ...prev,
        auth: {
          ...prev.auth,
          isAuthenticated: true,
          role: 'admin',
          currentUser: { id: 'admin', name: 'Master Admin', username: 'admin', role: 'Master Admin' }
        }
      }));
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Master PIN / Password.' };
  };

  const staffLogin = (username, inputPin) => {
    const staff = (data.staffMembers || []).find(
      (s) => s.username?.toLowerCase() === (username || '').trim().toLowerCase() && s.active !== false
    );

    if (!staff) {
      return { success: false, message: 'Employee username not found or account is deactivated.' };
    }

    if (staff.pin !== inputPin) {
      return { success: false, message: 'Invalid Employee PIN / Password.' };
    }

    setData((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        isAuthenticated: true,
        role: 'staff',
        currentUser: staff
      }
    }));

    return { success: true, user: staff };
  };

  const logout = () => {
    setData((prev) => ({
      ...prev,
      auth: { ...prev.auth, isAuthenticated: false, currentUser: null }
    }));
  };

  const changePin = (currentPin, newPin) => {
    const activePin = data.auth?.pin || '1234';
    if (currentPin !== activePin) {
      return { success: false, message: 'Current Admin PIN / Password is incorrect.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'New PIN must be at least 4 digits/characters.' };
    }

    setData((prev) => ({
      ...prev,
      auth: { ...prev.auth, pin: newPin.trim() }
    }));

    return { success: true, message: 'Admin PIN / Password updated successfully!' };
  };

  // Staff Management CRUD (Admin Controlled)
  const addStaffMember = (newStaff) => {
    const id = 'emp_' + Date.now();
    const formatted = {
      id,
      name: newStaff.name,
      username: (newStaff.username || newStaff.name.toLowerCase().replace(/\s+/g, '')).toLowerCase(),
      pin: newStaff.pin || '1234',
      role: newStaff.role || 'Cashier',
      phone: newStaff.phone || '-',
      active: true,
      createdAt: new Date().toISOString()
    };

    setData((prev) => ({
      ...prev,
      staffMembers: [...(prev.staffMembers || []), formatted]
    }));

    return formatted;
  };

  const updateStaffMember = (staffId, updatedFields) => {
    setData((prev) => ({
      ...prev,
      staffMembers: (prev.staffMembers || []).map((s) =>
        s.id === staffId ? { ...s, ...updatedFields } : s
      )
    }));
  };

  const deleteStaffMember = (staffId) => {
    setData((prev) => ({
      ...prev,
      staffMembers: (prev.staffMembers || []).filter((s) => s.id !== staffId)
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
    const currentStaff = data.auth?.currentUser || { id: 'admin', name: 'Master Admin', role: 'Master Admin' };

    const newInvoice = {
      ...invoicePayload,
      id: invId,
      businessId: data.activeBusinessId,
      date: new Date().toISOString(),
      cashierId: currentStaff.id || 'admin',
      cashierName: currentStaff.name || 'Master Admin',
      cashierRole: currentStaff.role || 'Cashier'
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

  // WEB AUDIO SYNTHESIZER SOUND NOTIFICATIONS (100% Offline)
  const playSoundEffect = (type = 'chime') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'kot_fired') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'order_ready') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.12); // C6
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'bill_settled') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.16); // C6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Kitchen Order Ticket Status Update with 2-Way Sync to Tables
  const updateKOTStatus = (kotId, newStatus) => {
    playSoundEffect(newStatus === 'Ready to Serve' ? 'order_ready' : 'chime');

    const itemTargetStatus = newStatus === 'Ready to Serve' ? 'Ready' : newStatus === 'Served' ? 'Served' : 'Cooking';

    setData((prev) => {
      // 1. Update kitchen orders
      const updatedOrders = (prev.kitchenOrders || []).map((k) =>
        k.id === kotId ? { ...k, status: newStatus } : k
      );

      // 2. Update table dishes that belong to this KOT
      const updatedTables = (prev.restaurantTables || []).map((t) => {
        const hasKOTItems = (t.currentItems || []).some(i => i.kotId === kotId);
        if (!hasKOTItems) return t;

        const updatedItems = (t.currentItems || []).map(i =>
          i.kotId === kotId ? { ...i, status: itemTargetStatus } : i
        );

        return { ...t, currentItems: updatedItems };
      });

      return {
        ...prev,
        kitchenOrders: updatedOrders,
        restaurantTables: updatedTables
      };
    });
  };

  // RESTAURANT DINE-IN TABLE ORDERING & KOT
  const fireKOT = (tableNo, items, chefNotes = '') => {
    playSoundEffect('kot_fired');

    const kotNum = Math.floor(100 + Math.random() * 900);
    const kotId = `KOT-${kotNum}`;
    const now = new Date().toISOString();

    const newKOT = {
      id: kotId,
      tableNo: tableNo,
      orderType: 'Dine-In',
      time: now,
      chefNotes: chefNotes,
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
      estMins: (i.category || '').toLowerCase().includes('pizza') ? 15 : (i.category || '').toLowerCase().includes('beverage') ? 5 : 12
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

  // Update Individual Item Status (Cooking ➔ Ready ➔ Served) with 2-Way Sync
  const updateItemCookingStatus = (tableNo, itemIndex, newStatus) => {
    playSoundEffect(newStatus === 'Ready' ? 'order_ready' : newStatus === 'Served' ? 'chime' : 'chime');

    setData((prev) => {
      const currentTables = prev.restaurantTables || [];
      let affectedKotId = null;

      const updatedTables = currentTables.map((t) => {
        if (t.name === tableNo || t.id === tableNo) {
          const updatedItems = [...(t.currentItems || [])];
          if (updatedItems[itemIndex]) {
            affectedKotId = updatedItems[itemIndex].kotId;
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], status: newStatus };
          }
          return { ...t, currentItems: updatedItems };
        }
        return t;
      });

      // Synchronize KDS ticket status if all items are served
      let updatedKitchenOrders = prev.kitchenOrders || [];
      if (affectedKotId) {
        // Collect all items across tables with this kotId
        const allKOTItems = updatedTables.flatMap(t => (t.currentItems || []).filter(i => i.kotId === affectedKotId));
        if (allKOTItems.length > 0) {
          const allServed = allKOTItems.every(i => i.status === 'Served');
          const anyReady = allKOTItems.some(i => i.status === 'Ready');

          const newKOTStatus = allServed ? 'Served' : anyReady ? 'Ready to Serve' : 'Preparing';

          updatedKitchenOrders = (prev.kitchenOrders || []).map(k =>
            k.id === affectedKotId ? { ...k, status: newKOTStatus } : k
          );
        }
      }

      return {
        ...prev,
        restaurantTables: updatedTables,
        kitchenOrders: updatedKitchenOrders
      };
    });
  };

  // Table Waiter Call / Buzzer
  const setTableBuzzer = (tableNo, reason = 'Water / Service Assistance') => {
    playSoundEffect('order_ready');
    setData((prev) => ({
      ...prev,
      restaurantTables: (prev.restaurantTables || []).map((t) =>
        t.name === tableNo || t.id === tableNo
          ? { ...t, buzzer: { active: true, reason, time: new Date().toISOString() } }
          : t
      )
    }));
  };

  const clearTableBuzzer = (tableNo) => {
    setData((prev) => ({
      ...prev,
      restaurantTables: (prev.restaurantTables || []).map((t) =>
        t.name === tableNo || t.id === tableNo
          ? { ...t, buzzer: null }
          : t
      )
    }));
  };

  const clearTable = (tableNo) => {
    playSoundEffect('bill_settled');
    setData((prev) => {
      const currentTables = prev.restaurantTables || [];
      const updatedTables = currentTables.map((t) => {
        if (t.name === tableNo || t.id === tableNo) {
          return { ...t, status: 'available', seatedAt: null, currentItems: [], buzzer: null, reservation: null };
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
      shape: newTable.shape || 'rectangle', // 'round', 'rectangle', 'booth', 'patio'
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

  const transferTable = (fromTableNo, toTableNo) => {
    setData((prev) => {
      const tables = (prev.restaurantTables || []).map(t => ({ ...t }));
      const fromTable = tables.find(t => t.name === fromTableNo || t.id === fromTableNo);
      const toTable = tables.find(t => t.name === toTableNo || t.id === toTableNo);

      if (!fromTable || !toTable) return prev;

      toTable.status = 'occupied';
      toTable.seatedAt = fromTable.seatedAt || new Date().toISOString();
      toTable.currentItems = [...(toTable.currentItems || []), ...(fromTable.currentItems || [])];

      fromTable.status = 'available';
      fromTable.seatedAt = null;
      fromTable.currentItems = [];

      return { ...prev, restaurantTables: tables };
    });
  };

  const mergeTables = (primaryTableNo, secondaryTableNo) => {
    transferTable(secondaryTableNo, primaryTableNo);
  };

  const reserveTable = (tableNo, guestName, timeStr) => {
    setData((prev) => ({
      ...prev,
      restaurantTables: (prev.restaurantTables || []).map(t =>
        t.name === tableNo || t.id === tableNo
          ? { ...t, status: 'reserved', reservation: { guestName, time: timeStr } }
          : t
      )
    }));
  };

  // Automotive Service Job Status & Creation
  const createJobCard = (newJob) => {
    const jobNum = Math.floor(400 + Math.random() * 600);
    const jobObj = {
      id: `JOB-${jobNum}`,
      vehicleNo: newJob.vehicleNo,
      vehicleModel: newJob.vehicleModel || 'Vehicle',
      customerName: newJob.customerName || 'Walk-in Customer',
      phone: newJob.phone || '-',
      serviceName: newJob.serviceName || 'Full Inspection & Service',
      technician: newJob.technician || 'Head Technician',
      receivedAt: new Date().toISOString(),
      estimatedDelivery: newJob.estimatedDelivery || 'Today',
      odometerKm: newJob.odometerKm || '45000',
      nextServiceKm: (parseInt(newJob.odometerKm) || 45000) + 10000,
      estimatedCost: parseFloat(newJob.estimatedCost) || 2500,
      status: 'Received'
    };

    setData((prev) => ({
      ...prev,
      serviceJobs: [jobObj, ...(prev.serviceJobs || [])]
    }));

    return jobObj;
  };

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
    safeStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <BillingContext.Provider
      value={{
        auth: data.auth || { isAuthenticated: false },
        currentUser: data.auth?.currentUser || { id: 'admin', name: 'Master Admin', role: 'Master Admin' },
        staffMembers: data.staffMembers || [],
        adminPin: data.auth?.pin || '1234',
        login,
        staffLogin,
        logout,
        changePin,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
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
        setTableBuzzer,
        clearTableBuzzer,
        playSoundEffect,
        clearTable,
        addTable,
        deleteTable,
        transferTable,
        mergeTables,
        reserveTable,
        createJobCard,
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
