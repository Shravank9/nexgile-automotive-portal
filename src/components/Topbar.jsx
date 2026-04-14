import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconSearch, IconBell, IconSettings } from './Icons';

const TITLES = {
  '/dashboard': 'Operations Dashboard',
  '/inventory': 'Vehicle Inventory',
  '/leads':     'Lead Management',
  '/sales':     'Sales & Deals',
  '/fi':        'F&I Integration',
  '/service':   'Service & Parts',
  '/analytics': 'Business Intelligence',
  '/settings':  'Settings',
};

const TYPE_COLORS = { warning:'var(--accent)', success:'var(--green)', error:'var(--red)', info:'var(--blue)' };
const TYPE_ICONS  = { warning:'⚠️', success:'✅', error:'🚨', info:'ℹ️' };

const INIT_NOTIFS = [
  { id:1, type:'warning', msg:'3 vehicles pending reconditioning approval',   time:'2m ago',  read:false, link:'/inventory' },
  { id:2, type:'success', msg:'Deal #2031 (Rahul Verma) e-signed',            time:'15m ago', read:false, link:'/fi'        },
  { id:3, type:'error',   msg:'Engine Air Filter critically low (3 left)',    time:'1h ago',  read:false, link:'/service'   },
  { id:4, type:'info',    msg:'New lead: Meena Iyer – Tata Nexon EV',        time:'2h ago',  read:true,  link:'/leads'     },
  { id:5, type:'warning', msg:'7 F&I deals awaiting e-signature',             time:'3h ago',  read:true,  link:'/fi'        },
  { id:6, type:'success', msg:'Service CSAT updated: 4.8★',                  time:'5h ago',  read:true,  link:'/service'   },
];

export default function Topbar({ search, onSearch, onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open,   setOpen]   = useState(false);
  const [notifs, setNotifs] = useState(INIT_NOTIFS);

  const unread = notifs.filter(n => !n.read).length;
  const page   = TITLES[pathname] || 'Portal';

  function markOne(id) {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read:true } : x));
  }
  function markAll() {
    setNotifs(n => n.map(x => ({ ...x, read:true })));
  }
  function clickNotif(notif) {
    markOne(notif.id);
    setOpen(false);
    navigate(notif.link);
  }

  return (
    <header className="topbar" style={{ position:'relative', zIndex:101 }}>
      {/* Hamburger for mobile */}
      <button onClick={onMenuClick} style={{
        background:'none', border:'none', color:'var(--muted2)',
        cursor:'pointer', fontSize:20, padding:'0 8px 0 0',
        display:'none'
      }} className="hamburger-btn">☰</button>

      <div className="topbar-breadcrumb">
        <span>Nexgile</span> · {page}
      </div>

      <div className="topbar-search">
        <IconSearch/>
        <input
          placeholder="Search vehicles, leads, customers…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <span style={{ cursor:'pointer', color:'var(--muted)', fontSize:18, lineHeight:1 }}
            onClick={() => onSearch('')}>×</span>
        )}
      </div>

      {/* Bell */}
      <div style={{ position:'relative' }}>
        <div className="topbar-icon-btn" onClick={() => setOpen(o => !o)}>
          <IconBell/>
          {unread > 0 && <span className="notif-dot"/>}
        </div>

        {open && (
          <>
            <div style={{ position:'fixed', inset:0, zIndex:149 }} onClick={() => setOpen(false)}/>
            <div style={{
              position:'absolute', right:0, top:'calc(100% + 8px)',
              width:340, zIndex:150,
              background:'#fff', border:'1px solid var(--border2)',
              borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)',
              overflow:'hidden'
            }}>
              <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'var(--font)', fontWeight:700, fontSize:14 }}>
                  Notifications
                  {unread > 0 && <span style={{ background:'var(--accent)', color:'var(--text)', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10, marginLeft:6 }}>{unread}</span>}
                </div>
                {unread > 0 && (
                  <span style={{ fontSize:11, color:'var(--accent)', cursor:'pointer' }} onClick={markAll}>
                    Mark all read
                  </span>
                )}
              </div>

              <div style={{ maxHeight:340, overflowY:'auto' }}>
                {notifs.map(n => (
                  <div key={n.id} onClick={() => clickNotif(n)}
                    style={{
                      display:'flex', gap:10, padding:'12px 16px', cursor:'pointer',
                      background: n.read ? 'transparent' : 'rgba(10,102,194,0.04)',
                      borderBottom:'1px solid var(--border)',
                      transition:'background .15s'
                    }}>
                    <div style={{
                      width:32, height:32, borderRadius:8, flexShrink:0,
                      background: TYPE_COLORS[n.type] + '20',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:14
                    }}>
                      {TYPE_ICONS[n.type]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight: n.read ? 400 : 500, color:'var(--text)', lineHeight:1.4 }}>{n.msg}</div>
                      <div style={{ fontSize:11, color:'var(--muted)', marginTop:3, display:'flex', alignItems:'center', gap:6 }}>
                        {n.time}
                        <span style={{ color:'var(--accent)', fontSize:10 }}>→ {n.link.replace('/','')||'dashboard'}</span>
                      </div>
                    </div>
                    {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--accent)', flexShrink:0, marginTop:4 }}/>}
                  </div>
                ))}
              </div>

              <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border)', textAlign:'center' }}>
                <span style={{ fontSize:12, color:'var(--accent)', cursor:'pointer' }}
                  onClick={() => { setOpen(false); navigate('/settings'); }}>
                  View all in Settings →
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings gear */}
      <div className="topbar-icon-btn" onClick={() => navigate('/settings')}>
        <IconSettings/>
      </div>
    </header>
  );
}
