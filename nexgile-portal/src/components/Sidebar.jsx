import { NavLink, useNavigate } from 'react-router-dom';

const NAV_MAIN = [
  { to:'/dashboard', label:'Dashboard',        icon:'grid',   badge:null  },
  { to:'/inventory', label:'Vehicle Inventory',icon:'car',    badge:'248' },
  { to:'/leads',     label:'Lead Management',  icon:'users',  badge:'12'  },
  { to:'/sales',     label:'Sales & Deals',    icon:'calc',   badge:null  },
  { to:'/fi',        label:'F&I Integration',  icon:'card',   badge:'7'   },
  { to:'/service',   label:'Service & Parts',  icon:'wrench', badge:null  },
];
const NAV_ANALYTICS = [
  { to:'/analytics', label:'BI Dashboard',     icon:'chart',  badge:null  },
];
const NAV_SYSTEM = [
  { to:'/settings',  label:'Settings',         icon:'cog',    badge:null  },
];

const PATH = {
  grid:   'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z',
  car:    'M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zm-5-5H4l2-5h12l2 5H14z',
  users:  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  calc:   'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z',
  card:   'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  wrench: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  chart:  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  cog:    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
};

function NavIcon({ name }) {
  return (
    <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={PATH[name]}/>
    </svg>
  );
}

function NavGroup({ items, onClose }) {
  return items.map(({ to, label, icon, badge }) => (
    <NavLink key={to} to={to}
      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
      onClick={onClose}>
      <NavIcon name={icon}/>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </NavLink>
  ));
}

export default function Sidebar({ onThemeToggle, isDark, isOpen, onClose }) {
  return (
    <aside className="sidebar" style={{ transform: isOpen ? 'translateX(0)' : undefined }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">N</div>
        <div>
          <div className="logo-text-main">Nexgile</div>
          <div className="logo-text-sub">Auto Retail Portal</div>
        </div>
        {/* Close button visible on mobile */}
        <button onClick={onClose} style={{
          marginLeft:'auto', background:'none', border:'none', color:'var(--muted)',
          cursor:'pointer', fontSize:20, lineHeight:1, padding:'0 4px',
          display:'none'
        }} className="sidebar-close-btn">✕</button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">Main Menu</div>
        <NavGroup items={NAV_MAIN} onClose={onClose}/>

        <div className="nav-section" style={{ marginTop: 8 }}>Analytics</div>
        <NavGroup items={NAV_ANALYTICS} onClose={onClose}/>

        <div className="nav-section" style={{ marginTop: 8 }}>System</div>
        <NavGroup items={NAV_SYSTEM} onClose={onClose}/>

        {/* Theme toggle */}
        <div className="nav-link" style={{ justifyContent:'space-between', cursor:'default', marginTop:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            <span style={{ fontSize:13 }}>Dark Mode</span>
          </div>
          <div onClick={onThemeToggle} style={{
            width:36, height:20, borderRadius:10, cursor:'pointer',
            background: isDark ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
            position:'relative', transition:'background .2s', flexShrink:0
          }}>
            <div style={{
              position:'absolute', top:2,
              left: isDark ? 'calc(100% - 18px)' : 2,
              width:16, height:16, borderRadius:'50%',
              background:'#fff', transition:'left .2s',
              boxShadow:'0 1px 4px rgba(0,0,0,0.3)'
            }}/>
          </div>
        </div>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">DM</div>
        <div>
          <div className="user-name">Dealer Manager</div>
          <div className="user-role">Administrator</div>
        </div>
      </div>
    </aside>
  );
}
