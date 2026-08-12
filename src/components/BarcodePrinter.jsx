import React, { useState, useEffect } from 'react';
import { Barcode, Printer, Check } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function BarcodePrinter() {
  const { products, settings } = useBilling();
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [labelCount, setLabelCount] = useState(8);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedProd = products.find((p) => p.id === selectedProdId) || products[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '22px',
      flex: 1,
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div className="no-print" style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '16px'
      }}>
        <div>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Barcode & Price Labels
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Generate and print barcode sticker sheets for inventory items or shelf price tags.
          </p>
        </div>

        <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
          <Printer size={16} /> Print Sticker Sheet
        </button>
      </div>

      {/* Selector Controls (Hidden on Print) */}
      <div className="glass-panel no-print" style={{
        padding: isMobile ? '16px' : '20px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: '12px'
      }}>
        <div>
          <label className="form-label">Select Inventory Product *</label>
          <select
            className="form-select"
            value={selectedProdId}
            onChange={(e) => setSelectedProdId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) - {settings.currency}{p.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Stickers to Print</label>
          <input
            type="number"
            min="1"
            max="100"
            value={labelCount}
            onChange={(e) => setLabelCount(parseInt(e.target.value) || 1)}
            className="form-input"
          />
        </div>
      </div>

      {/* Sticker Sheet Area */}
      <div className="printable-area" style={{ padding: isMobile ? '8px' : '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: isMobile ? '8px' : '12px'
        }}>
          {selectedProd && Array.from({ length: labelCount }).map((_, idx) => (
            <div
              key={idx}
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: '#ffffff',
                color: '#000000',
                textAlign: 'center',
                fontFamily: 'sans-serif'
              }}
            >
              <div style={{ fontSize: '9.5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {settings.storeName.slice(0, 20)}
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 'bold', marginTop: '2px', lineHeight: '1.2' }}>
                {selectedProd.name.slice(0, 22)}
              </div>

              {/* Barcode Visual Illustration */}
              <div style={{
                margin: '6px 0 4px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '28px',
                background: 'repeating-linear-gradient(90deg, #000 0, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 7px, #fff 7px, #fff 9px)'
              }}></div>

              <div style={{ fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                *{selectedProd.sku}*
              </div>

              <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '3px' }}>
                MRP: {settings.currency}{selectedProd.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
