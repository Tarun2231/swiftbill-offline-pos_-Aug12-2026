import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, 
  Wrench, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  User, 
  Plus, 
  X, 
  Calendar, 
  Phone, 
  Gauge, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';

export default function ServiceJobTracker() {
  const { serviceJobs, updateJobStatus, createJobCard, settings } = useBilling();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [filterStage, setFilterStage] = useState('All');

  // Form State
  const [vNo, setVNo] = useState('');
  const [vModel, setVModel] = useState('');
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [sName, setSName] = useState('Full Periodic Maintenance');
  const [tech, setTech] = useState('Senior Mechanic Rajesh');
  const [odoKm, setOdoKm] = useState('42000');
  const [estCost, setEstCost] = useState('3500');
  const [estDel, setEstDel] = useState('Today 06:00 PM');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statuses = [
    'Received', 
    'Inspection & Bay', 
    'Parts Installation', 
    'Quality Check', 
    'Ready for Delivery', 
    'Delivered'
  ];

  const jobs = serviceJobs || [];

  const activeJobs = jobs.filter(j => j.status !== 'Delivered');
  const deliveredJobs = jobs.filter(j => j.status === 'Delivered');

  const filteredJobs = jobs.filter(j => filterStage === 'All' || j.status === filterStage);

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!vNo.trim()) return;

    createJobCard({
      vehicleNo: vNo.toUpperCase(),
      vehicleModel: vModel,
      customerName: cName,
      phone: cPhone,
      serviceName: sName,
      technician: tech,
      odometerKm: odoKm,
      estimatedCost: estCost,
      estimatedDelivery: estDel
    });

    setVNo('');
    setVModel('');
    setCName('');
    setCPhone('');
    setShowAddJobModal(false);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-info" style={{ fontSize: '11px' }}>Automotive Bay</span>
            <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Vehicle Service Job Cards & Bay Tracker
            </h2>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Track repair stages, parts vs labor, next service reminders & delivery status.
          </span>
        </div>

        <button
          onClick={() => setShowAddJobModal(true)}
          className="btn btn-primary"
          style={{ padding: '8px 18px', fontSize: '13px', fontWeight: '700', gap: '6px' }}
        >
          <Plus size={16} /> + New Job Card
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="glass-panel" style={{ padding: '14px', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Active Vehicles in Bay</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#3b82f6', margin: '2px 0 0 0' }}>
            {activeJobs.length}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Under Inspection / Repair</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b', margin: '2px 0 0 0' }}>
            {jobs.filter(j => j.status === 'Inspection & Bay' || j.status === 'Parts Installation').length}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px', borderLeft: '4px solid #0c831f' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Ready for Delivery</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: '#0c831f', margin: '2px 0 0 0' }}>
            {jobs.filter(j => j.status === 'Ready for Delivery').length}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '14px', borderLeft: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Delivered Jobs</span>
          <h3 className="mono" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0 0 0' }}>
            {deliveredJobs.length}
          </h3>
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {['All', ...statuses].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStage(st)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterStage === st ? '#3b82f6' : 'var(--border-color)',
              backgroundColor: filterStage === st ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)',
              color: filterStage === st ? '#3b82f6' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: filterStage === st ? '700' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '14px'
      }}>
        {filteredJobs.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '44px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Car size={40} opacity={0.3} style={{ margin: '0 auto 10px auto' }} />
            <p style={{ fontSize: '14px', fontWeight: '700' }}>No vehicle jobs found in this stage.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isDelivered = job.status === 'Delivered';
            const isReady = job.status === 'Ready for Delivery';

            return (
              <div
                key={job.id}
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: isDelivered ? 0.7 : 1,
                  border: isReady ? '2px solid #0c831f' : '1px solid var(--border-color)',
                  backgroundColor: isReady ? 'rgba(12,131,31,0.04)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontWeight: '700' }}>
                      {job.id}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#3b82f6', marginTop: '2px', margin: 0 }}>
                      {job.vehicleNo}
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{job.vehicleModel}</span>
                  </div>

                  <span className={`badge badge-${
                    isReady ? 'success' : isDelivered ? 'secondary' : 'warning'
                  }`} style={{ fontSize: '10.5px', padding: '3px 8px', fontWeight: '700' }}>
                    {job.status}
                  </span>
                </div>

                {/* Job Specs */}
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Service Package:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{job.serviceName}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Customer:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{job.customerName} ({job.phone})</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Technician:</span>
                    <span style={{ color: 'var(--text-main)' }}>{job.technician}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '4px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Next Service Due:</span>
                    <span style={{ color: '#3b82f6', fontWeight: '700' }}>{job.nextServiceKm ? `${job.nextServiceKm} km` : '6 Months'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Estimated Cost:</span>
                    <span className="mono" style={{ color: '#0c831f', fontWeight: '800' }}>{settings.currency}{job.estimatedCost || 2500}</span>
                  </div>
                </div>

                {/* Stage Stepper Dropdown */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '3px' }}>
                    Update Bay Stage:
                  </label>
                  <select
                    className="form-select"
                    value={job.status}
                    onChange={(e) => updateJobStatus(job.id, e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '12px', height: '34px', minHeight: '34px' }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE NEW JOB CARD MODAL */}
      {showAddJobModal && (
        <div className="modal-overlay" style={{ padding: '16px' }}>
          <div className="modal-container" style={{ maxWidth: '440px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car color="#3b82f6" size={18} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Create Vehicle Job Card
                </h3>
              </div>
              <button onClick={() => setShowAddJobModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Vehicle Number Plate *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH 02 AB 1234 / KA 01 MJ 8899"
                  value={vNo}
                  onChange={(e) => setVNo(e.target.value)}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px', textTransform: 'uppercase' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Honda City / Creta"
                    value={vModel}
                    onChange={(e) => setVModel(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Odometer (KM)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={odoKm}
                    onChange={(e) => setOdoKm(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Verma"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11.5px' }}>Service / Repair Package</label>
                <input
                  type="text"
                  placeholder="e.g. 10,000 KM Periodic Service + Wheel Alignment"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="form-input"
                  style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Estimated Cost ({settings.currency})</label>
                  <input
                    type="number"
                    value={estCost}
                    onChange={(e) => setEstCost(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Assigned Technician</label>
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => setTech(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddJobModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>
                  Create Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
