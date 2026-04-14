import { useState } from 'react';
import { IconClose } from './Icons';

const INITIAL_NOTIFS = [
  { id: 1, type: 'warning', icon: '⚠️', title: '3 Vehicles Pending Approval', body: 'Reconditioning sign-off required before listing.', time: '2m ago',   read: false },
  { id: 2, type: 'success', icon: '✅', title: 'Deal Delivered — Kavya Nair', body: 'Kia Seltos HTX successfully handed over.', time: '18m ago',  read: false },
  { id: 3, type: 'danger',  icon: '🔴', title: 'Critical Part: Spark Plugs', body: 'Only 1 unit left — auto-order not enabled.', time: '45m ago',  read: false },
  { id: 4, type: 'info',    icon: '📩', title: 'New Lead: Meena Iyer',        body: 'Interested in Tata Nexon EV. Source: Web.', time: '1h ago',   read: false },
  { id: 5, type: 'warning', icon: '⏰', title: '7 E-Sign Docs Pending',       body: 'Customers are waiting to sign F&I documents.', time: '2h ago',   read: true  },
  { id: 6, type: 'info',    icon: '🔄', title: 'DMS Sync Completed',          body: 'All 248 vehicles synced successfully.', time: '3h ago',   read: true  },
  { id: 7, type: 'success', icon: '💰', title: 'F&I Deal Approved — Rahul',   body: 'BMW 5 Series credit approved by BMW Financial.', time: '4h ago',   read: true  },
  { id: 8, type: 'warning', icon: '📦', title: 'Cabin Filter: Critical Low',  body: 'Only 2 units remaining. Reorder point: 8.', time: '5h ago',   read: true  },
];

const TYPE_COLORS = {
  warning: { bg: 'rgba(232,160,32,0.1)',  border: 'rgba(232,160,32,0.2)'  },
  success: { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)'   },
  danger:  { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)'   },
  info:    { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)'  },
};

export default function NotifPanel({ onClose }) {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  function markAllRead() { setNotifs(n => n.map(x => ({ ...x, read: true }))); }
  function dismiss(id)   { setNotifs(n => n.filter(x => x.id !== id)); }

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: 380, background: 'var(--card2)',
      borderLeft: '1px solid var(--border2)',
      zIndex: 300, display: 'flex', flexDirection: 'column',
      boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
      animation: 'slideInRight 0.25s ease'
    }}>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

      {/* Header */}
      <div style={{
        padding: '20px 20px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 16, color: '#fff' }}>
            Notifications
            {unread > 0 && (
              <span style={{
                marginLeft: 8, background: 'var(--accent)', color: '#000',
                fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20
              }}>{unread}</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>System alerts &amp; updates</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && (
            <button className="btn btn-outline btn-sm" onClick={markAllRead} style={{ fontSize: 11 }}>Mark all read</button>
          )}
          <button className="topbar-icon-btn" onClick={onClose} style={{ width: 32, height: 32 }}><IconClose /></button>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
        {notifs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: 'var(--syne)', fontWeight: 600 }}>All caught up!</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>No notifications.</div>
          </div>
        )}
        {notifs.map(n => (
          <div key={n.id} style={{
            padding: '12px 14px', borderRadius: 10, marginBottom: 8,
            background: n.read ? 'rgba(255,255,255,0.02)' : TYPE_COLORS[n.type]?.bg,
            border: `1px solid ${n.read ? 'var(--border)' : TYPE_COLORS[n.type]?.border}`,
            position: 'relative', opacity: n.read ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}>
            {!n.read && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)'
              }} />
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: n.read ? 'var(--muted2)' : '#fff', marginBottom: 3 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 6 }}>{n.body}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{n.time}</span>
                  <button onClick={() => dismiss(n.id)} style={{
                    background: 'none', border: 'none', color: 'var(--muted)',
                    fontSize: 11, cursor: 'pointer', padding: '2px 6px',
                    borderRadius: 4, transition: 'color 0.16s'
                  }}>Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
