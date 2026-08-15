import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Crash Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#0a0f1d',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#131c33',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '28px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'rgba(244,63,94,0.15)',
              color: '#f43f5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={28} />
            </div>

            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff' }}>
                SwiftBill POS Recovery
              </h2>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                A temporary session glitch occurred. Tap below to reload and restore clean terminal state.
              </p>
            </div>

            {this.state.error && (
              <div style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#0e162a',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '11px',
                color: '#f43f5e',
                fontFamily: 'monospace',
                overflowX: 'auto',
                textAlign: 'left',
                maxHeight: '80px'
              }}>
                {this.state.error?.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px 18px',
                backgroundColor: '#0c831f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(12,131,31,0.4)'
              }}
            >
              <RotateCcw size={16} /> Reset Session & Launch POS
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
