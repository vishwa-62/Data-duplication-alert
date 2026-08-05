import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { AlertTriangle, CheckCircle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '420px',
      width: '100%'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = 'var(--accent-primary)';
        let iconColor = 'var(--accent-primary)';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          borderColor = 'var(--color-success)';
          iconColor = 'var(--color-success)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'var(--color-warning)';
          iconColor = 'var(--color-warning)';
        } else if (toast.type === 'error') {
          Icon = AlertOctagon;
          borderColor = 'var(--color-danger)';
          iconColor = 'var(--color-danger)';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--bg-secondary)',
              borderLeft: `4px solid ${borderColor}`,
              borderTop: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              color: 'var(--text-primary)',
              animation: 'toast-in 0.25s ease-out'
            }}
          >
            <Icon size={22} style={{ color: iconColor, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{toast.title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--text-muted)', padding: 2 }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
