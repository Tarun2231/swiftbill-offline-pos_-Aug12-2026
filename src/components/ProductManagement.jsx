import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Package, 
  ArrowUpDown, 
  Scale, 
  Image as ImageIcon,
  X,
  Check,
  Tag,
  Boxes,
  TrendingUp,
  AlertCircle,
  Layers
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct, settings, activeBusinessId } = useBilling();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'instock'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Groceries',
    price: '',
    purchaseCost: '',
    stock: '',
    unit: 'kg',
    isWeightBased: false,
    taxRate: '0',
    minStockAlert: '10',
    image: ''
  });

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Inventory KPI Metrics
  const totalItemsCount = products.length;
  const lowStockItems = useMemo(() => products.filter((p) => p.stock <= (p.minStockAlert || 5)), [products]);
  const totalValuation = useMemo(() => products.reduce((acc, p) => acc + (p.price * p.stock), 0), [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isLow = p.stock <= (p.minStockAlert || 5);
      const matchStock = 
        stockFilter === 'all' || 
        (stockFilter === 'low' && isLow) || 
        (stockFilter === 'instock' && !isLow && p.stock > 0);

      return matchCat && matchSearch && matchStock;
    });
  }, [products, selectedCategory, searchQuery, stockFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `${activeBusinessId.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      category: activeBusinessId === 'grocery' ? 'Vegetables' : activeBusinessId === 'automotive' ? 'Maintenance' : 'Main Menu',
      price: '',
      purchaseCost: '',
      stock: '50',
      unit: activeBusinessId === 'grocery' ? 'kg' : 'pcs',
      isWeightBased: activeBusinessId === 'grocery',
      taxRate: '0',
      minStockAlert: '10',
      image: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price.toString(),
      purchaseCost: (prod.purchaseCost || 0).toString(),
      stock: prod.stock.toString(),
      unit: prod.unit || 'pcs',
      isWeightBased: Boolean(prod.isWeightBased),
      taxRate: (prod.taxRate || 0).toString(),
      minStockAlert: (prod.minStockAlert || 5).toString(),
      image: prod.image || ''
    });
    setShowAddModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        purchaseCost: parseFloat(formData.purchaseCost) || 0,
        stock: parseFloat(formData.stock) || 0,
        unit: formData.unit,
        isWeightBased: Boolean(formData.isWeightBased),
        taxRate: parseFloat(formData.taxRate) || 0,
        minStockAlert: parseInt(formData.minStockAlert) || 5,
        image: formData.image
      });
    } else {
      addProduct(formData);
    }
    setShowAddModal(false);
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
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Inventory & Catalog
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {activeBusinessId === 'grocery' && 'Weighted produce, fruits, vegetables, staples & dairy items.'}
            {activeBusinessId === 'automotive' && 'Service packages, detailing labor & replacement spare parts.'}
            {activeBusinessId === 'restaurant' && 'Food menu items, beverages, pizzas, pastas & desserts.'}
            {activeBusinessId === 'retail' && 'Retail products, electronics, barcodes & stock levels.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: '13.5px', alignSelf: isMobile ? 'stretch' : 'center' }}
        >
          <Plus size={16} /> Add New Item / Service
        </button>
      </div>

      {/* Modern KPI Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16,185,129,0.12)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Boxes size={22} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Total SKUs</span>
            <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {totalItemsCount}
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(245,158,11,0.12)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Low Stock Items</span>
            <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b', margin: 0 }}>
              {lowStockItems.length}
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderLeft: '4px solid #3b82f6',
          gridColumn: isMobile ? 'span 2' : 'auto'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(59,130,246,0.12)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Inventory Valuation</span>
            <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>
              {settings.currency}{Math.round(totalValuation).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '12px',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            placeholder="Search items by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px', fontSize: '13.5px' }}
          />
        </div>

        {/* Stock status filter pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'low', label: `Low Stock (${lowStockItems.length})` },
            { id: 'instock', label: 'In Stock' }
          ].map((sf) => (
            <button
              key={sf.id}
              onClick={() => setStockFilter(sf.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: stockFilter === sf.id ? '#10b981' : 'var(--border-color)',
                backgroundColor: stockFilter === sf.id ? 'rgba(16,185,129,0.18)' : 'var(--bg-card)',
                color: stockFilter === sf.id ? '#10b981' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: stockFilter === sf.id ? '700' : '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {sf.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#10b981' : 'var(--border-color)',
                backgroundColor: selectedCategory === cat ? 'rgba(16,185,129,0.18)' : 'var(--bg-card)',
                color: selectedCategory === cat ? '#10b981' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: selectedCategory === cat ? '700' : '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE VIEW: Responsive Product Cards List (<= 768px) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <Package size={36} opacity={0.3} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13.5px' }}>No items found matching your search.</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isLow = p.stock <= (p.minStockAlert || 5);

              return (
                <div
                  key={p.id}
                  className="glass-panel"
                  style={{
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                        <Package size={22} />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontWeight: '600' }}>{p.sku}</span>
                        <span className="badge badge-info" style={{ fontSize: '9.5px', padding: '1px 5px' }}>{p.category}</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', wordBreak: 'break-word', margin: 0 }}>
                        {p.name}
                      </h4>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Selling Price</span>
                      <span className="mono" style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>
                        {settings.currency}{p.price} <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 'normal' }}>/{p.unit}</span>
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Stock Status</span>
                      <span className={`badge badge-${isLow ? 'danger' : 'success'}`} style={{ fontSize: '11px', padding: '2px 7px' }}>
                        {p.stock} {p.unit}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', flex: 1 }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* DESKTOP VIEW: Spacious Data Table (> 768px) */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>ITEM</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORY</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>SELLING PRICE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>COST PRICE</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>STOCK</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>TAX %</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                      No items found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = p.stock <= (p.minStockAlert || 5);

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {p.image ? (
                              <img src={p.image} alt={p.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }} />
                            ) : (
                              <div style={{ width: '38px', height: '38px', borderRadius: '6px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                                <Package size={18} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</div>
                              <div style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>SKU: {p.sku}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 7px' }}>{p.category}</span>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '800', textAlign: 'right' }} className="mono">
                          {settings.currency}{p.price} <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontWeight: 'normal' }}>/{p.unit}</span>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }} className="mono">
                          {settings.currency}{p.purchaseCost || 0}
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span className={`badge badge-${isLow ? 'danger' : 'success'}`} style={{ fontSize: '11.5px', padding: '3px 8px' }}>
                            {p.stock} {p.unit}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', fontSize: '13px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {p.taxRate}%
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button onClick={() => handleOpenEdit(p)} className="btn-icon" style={{ padding: '6px' }} title="Edit Product">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="btn-icon" style={{ color: '#f43f5e', padding: '6px' }} title="Delete Product">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spacious Add / Edit Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '24px' }}>
          <div className="modal-container" style={{ maxWidth: '600px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {editingProduct ? 'Edit Inventory Item' : 'Add New Item / Service'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Item / Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Red Apples / Ceramic Coating"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">SKU / Barcode Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Fruits, Meat, Detailing"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Selling Price ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Cost Price ({settings.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
                  <label className="form-label">Initial Stock Qty</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Measurement Unit</label>
                  <input
                    type="text"
                    placeholder="kg, grams, pcs, plate, job"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">GST Tax Rate %</label>
                  <select
                    className="form-select"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% (Essential / Food)</option>
                    <option value="12">12% (Standard)</option>
                    <option value="18">18% (Services / Goods)</option>
                    <option value="28">28% (Luxury / Spares)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
