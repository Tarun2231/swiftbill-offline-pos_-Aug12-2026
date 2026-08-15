import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Boxes, 
  TrendingUp, 
  AlertCircle,
  X 
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ProductManagement() {
  const { auth, currentUser, products, addProduct, updateProduct, deleteProduct, settings, activeBusinessId } = useBilling();
  const isAdmin = auth?.role === 'admin' || currentUser?.role === 'Master Admin';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Inventory & Catalog
          </h2>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Manage stock levels, prices, barcode SKUs, and weighted items.
          </span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ padding: '9px 18px', fontSize: '13px', alignSelf: isMobile ? 'stretch' : 'center', fontWeight: '700' }}
        >
          <Plus size={16} /> + Add New Item / Service
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        <div className="glass-panel" style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid #0c831f'
        }}>
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
          gap: '12px',
          borderLeft: '4px solid #f59e0b'
        }}>
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
          gap: '12px',
          borderLeft: '4px solid #3b82f6',
          gridColumn: isMobile ? 'span 2' : 'auto'
        }}>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
              {isAdmin ? 'Total Inventory Valuation' : 'Catalog In-Stock Items'}
            </span>
            <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>
              {isAdmin ? `${settings.currency}${Math.round(totalValuation).toLocaleString()}` : `${products.filter(p => p.stock > 0).length} Available`}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '10px',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search items by name or SKU code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '13px', height: '36px', minHeight: '36px' }}
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
                borderColor: stockFilter === sf.id ? '#0c831f' : 'var(--border-color)',
                backgroundColor: stockFilter === sf.id ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                color: stockFilter === sf.id ? '#0c831f' : 'var(--text-muted)',
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
                borderColor: selectedCategory === cat ? '#0c831f' : 'var(--border-color)',
                backgroundColor: selectedCategory === cat ? 'var(--instamart-green-light)' : 'var(--bg-card)',
                color: selectedCategory === cat ? '#0c831f' : 'var(--text-muted)',
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

      {/* MOBILE VIEW */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '28px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <p style={{ fontSize: '13px' }}>No items found matching your search.</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isLow = p.stock <= (p.minStockAlert || 5);

              return (
                <div
                  key={p.id}
                  className="glass-panel"
                  style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <div style={{ width: '42px', height: '42px', borderRadius: '6px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                        <Package size={20} />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>{p.sku}</span>
                        <span className="badge badge-info" style={{ fontSize: '9px', padding: '1px 5px' }}>{p.category}</span>
                      </div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)', margin: '2px 0 0 0' }}>
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
                    borderRadius: 'var(--radius-xs)'
                  }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Selling Price</span>
                      <span className="mono" style={{ fontSize: '14px', fontWeight: '800', color: '#0c831f' }}>
                        {settings.currency}{p.price}/{p.unit}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Stock Status</span>
                      <span className={`badge badge-${isLow ? 'danger' : 'success'}`} style={{ fontSize: '11px', padding: '2px 6px' }}>
                        {p.stock} {p.unit}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', flex: 1, height: '30px', fontWeight: '600' }}
                    >
                      <Edit2 size={13} /> Edit Item
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px', height: '30px', fontWeight: '600' }}
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
        /* DESKTOP TABLE */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>ITEM</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORY</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>SELLING PRICE</th>
                  {isAdmin && (
                    <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>COST PRICE</th>
                  )}
                  <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>STOCK</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>TAX %</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                      No inventory items found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = p.stock <= (p.minStockAlert || 5);

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {p.image ? (
                              <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                            ) : (
                              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                                <Package size={16} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>SKU: {p.sku}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          <span className="badge badge-info" style={{ fontSize: '10px' }}>{p.category}</span>
                        </td>

                        <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '800', textAlign: 'right' }} className="mono">
                          {settings.currency}{p.price}/{p.unit}
                        </td>

                        {isAdmin && (
                          <td style={{ padding: '12px 16px', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'right' }} className="mono">
                            {settings.currency}{p.purchaseCost || 0}
                          </td>
                        )}

                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span className={`badge badge-${isLow ? 'danger' : 'success'}`} style={{ fontSize: '11px' }}>
                            {p.stock} {p.unit}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', fontSize: '12.5px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {p.taxRate}%
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button onClick={() => handleOpenEdit(p)} className="btn-icon" style={{ padding: '6px' }} title="Edit Item">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="btn-icon" style={{ color: '#f43f5e', padding: '6px' }} title="Delete Item">
                              <Trash2 size={14} />
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

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ padding: isMobile ? '10px' : '20px' }}>
          <div className="modal-container" style={{ maxWidth: '520px', padding: isMobile ? '18px 14px' : '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {editingProduct ? 'Edit Inventory Item' : 'Add New Item / Service'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn-icon" style={{ padding: '5px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Item / Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Red Apples / Woodfired Margherita Pizza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">SKU / Barcode Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="form-input"
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Fruits, Pizza, Drinks"
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Selling Price ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
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
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Measurement Unit</label>
                  <input
                    type="text"
                    placeholder="kg, pcs, plate, cup, dozen"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="form-input"
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label">GST Tax Rate %</label>
                  <select
                    className="form-select"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% (Essential / Food)</option>
                    <option value="12">12% (Standard Goods)</option>
                    <option value="18">18% (Standard Services)</option>
                    <option value="28">28% (Luxury / Spares)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Product Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                  style={{ height: '34px', minHeight: '34px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12.5px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '12.5px', fontWeight: '700' }}>
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
