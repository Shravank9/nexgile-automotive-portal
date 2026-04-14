import { useState } from 'react';
import { notifications as INIT } from '../data/staticData';
import Toast from '../components/Toast';

const TYPE_CONFIG = {
  warning: { bg: 'rgba(232,160,32,0.08)', border: 'rgba(232,160,32,0.2)', dot: 'var(--accent)', icon: '⚠️' },
  success: { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',  dot: 'var(--green)',  icon: '✅' },
  info:    { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', dot: 'var(--blue)',   icon: 'ℹ️' },
  error:   { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  dot: 'var(--red)',    icon: '❌' },
};

export default function Notifications() {
  const [data,  setData]  = useState(INIT);
  const [toast, setToast] = useState(null);
  const [filter,setFilter]= useState('All');

  const unread = data.filter(n => !n.read).length;

  function markRead(id) {
    setData(d => d.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setData(d => d.map(n => ({ ...n, read: true })));
    setToast({ msg: 'All notifications marked as read', color: 'var(--green)' });
  }

  function dismiss(id) {
    setData(d => d.filter(n => n.id !== id));
  }

  const FILTERS = ['All', 'Unread', 'warning', 'success', 'info'];
  const filtered = data.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter;
  });

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-sub">{unread} unread · System alerts &amp; activity feed</div>
        </div>
        <div className="page-actions">
          {unread > 0 && (
            <button className="btn btn-outline" onClick={markAllRead}>Mark All Read</button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tab-bar">
        {FILTERS.map(f => (
          <button key={f} className={`tab-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}
            style={{ textTransform: 'capitalize' }}>
            {f} ({f === 'All' ? data.length : f === 'Unread' ? unread : data.filter(n => n.type === f).length})
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>All caught up!</div>
            <div style={{ fontSize: 13 }}>No notifications in this category.</div>
          </div>
        )}
        {filtered.map(n => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
          return (
            <div key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                background: n.read ? 'var(--card)' : cfg.bg,
                border: `1px solid ${n.read ? 'var(--border)' : cfg.border}`,
                borderRadius: 12, padding: '16px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                cursor: 'pointer', transition: 'all 0.2s',
                opacity: n.read ? 0.7 : 1,
              }}>
              {/* Icon */}
              <div style={{ fontSize: 20, flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, background: cfg.bg }}>
                {cfg.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{n.title}</span>
                  {!n.read && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.5 }}>{n.body}</div>
              </div>

              {/* Right: time + dismiss */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{n.time}</span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                  style={{ fontSize: 11, padding: '3px 8px' }}>
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <Toast message={toast.msg} color={toast.color} onClose={() => setToast(null)} />}
    </div>
  );
}
