import React, { useState, useEffect } from 'react';
import { Car, Wrench, CheckCircle, Clock, ShieldCheck, User } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ServiceJobTracker() {
  const { serviceJobs, updateJobStatus } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statuses = ['Received', 'In Detailing', 'Quality Check', 'Ready for Delivery', 'Delivered'];

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
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-info">Service Bay</span>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Vehicle Service Job Cards
          </h2>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Track repair stages, detailing packages, assigned technicians, and delivery status.
        </p>
      </div>

      {/* Jobs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '12px'
      }}>
        {serviceJobs.map((job) => {
          const isDelivered = job.status === 'Delivered';

          return (
            <div
              key={job.id}
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: isDelivered ? 0.6 : 1,
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {job.id}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#3b82f6', marginTop: '2px', margin: 0 }}>
                    {job.vehicleNo}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{job.vehicleModel}</p>
                </div>

                <span className={`badge badge-${
                  job.status === 'Ready for Delivery' ? 'success' : job.status === 'In Detailing' ? 'warning' : 'info'
                }`}>
                  {job.status}
                </span>
              </div>

              {/* Service details */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Service: </span>
                  <strong style={{ color: 'var(--text-main)' }}>{job.serviceName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Owner: </span>
                  <span style={{ color: 'var(--text-main)' }}>{job.customerName} ({job.phone})</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Tech: </span>
                  <span style={{ color: 'var(--text-main)' }}>{job.technician}</span>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>
                  Update Bay Stage:
                </label>
                <select
                  className="form-select"
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px', minHeight: '36px' }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
