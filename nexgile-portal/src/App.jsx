import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Sidebar    from './components/Sidebar';
import Topbar     from './components/Topbar';
import Dashboard  from './pages/Dashboard';
import Inventory  from './pages/Inventory';
import Leads      from './pages/Leads';
import Sales      from './pages/Sales';
import FI         from './pages/FI';
import Service    from './pages/Service';
import Analytics  from './pages/Analytics';
import Settings   from './pages/Settings';

// Global app context so any page can trigger toasts / navigate
export const AppCtx = createContext({});
export function useApp() { return useContext(AppCtx); }

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{textAlign:'center',paddingTop:80}}>
      <div style={{fontSize:64,marginBottom:16}}>🚗</div>
      <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:32,color:'#fff',marginBottom:8}}>404 – Page Not Found</div>
      <div style={{color:'var(--muted)',marginBottom:24}}>This route doesn't exist in the portal.</div>
      <button className="btn btn-primary" onClick={()=>navigate('/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}

const LIGHT_CSS = `
body.light-mode {
  --bg:#f0f2f7;--bg2:#ffffff;--bg3:#f5f7fb;
  --card:#ffffff;--card2:#f8fafc;
  --border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.14);
  --text:#1a1e2e;--muted:#8892a4;--muted2:#5a6478;
}
body.light-mode .sidebar{box-shadow:2px 0 12px rgba(0,0,0,0.08);}
body.light-mode .topbar{box-shadow:0 2px 8px rgba(0,0,0,0.06);}
body.light-mode .data-table thead tr{background:rgba(0,0,0,0.04);}
body.light-mode .data-table td{border-top:1px solid rgba(0,0,0,0.05);}
body.light-mode .data-table tbody tr:hover td{background:rgba(0,0,0,0.02);}
body.light-mode .topbar-search,body.light-mode .topbar-icon-btn{background:#f0f2f7;}
body.light-mode .form-input,body.light-mode .form-select{background:#f5f7fb;color:#1a1e2e;}
body.light-mode .kpi-card{box-shadow:0 2px 12px rgba(0,0,0,0.06);}
body.light-mode .tab-btn.active{background:rgba(232,160,32,0.15);}
body.light-mode .search-input-wrap{background:#f5f7fb;}
body.light-mode .search-input-wrap input{color:#1a1e2e;}
body.light-mode .modal-box{background:#fff;}
body.light-mode .toast{background:#fff;}
body.light-mode .prog-bar{background:rgba(0,0,0,0.08);}
body.light-mode .stage-bar{background:rgba(0,0,0,0.08);}
body.light-mode .vehicle-thumb{background:linear-gradient(135deg,#e0e4ee,#cdd1dc);}
/* Sidebar overlay mobile */
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199;}
@media(max-width:900px){
  .sidebar-overlay{display:block;}
  .main-area{margin-left:0!important;}
  .kpi-grid{grid-template-columns:repeat(2,1fr)!important;}
  .grid-2,.grid-3,.grid-auto-2{grid-template-columns:1fr!important;}
}
`;

export default function App() {
  const [search,      setSearch]      = useState('');
  const [isDark,      setIsDark]      = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {id:1,type:'warning',msg:'3 vehicles pending reconditioning approval',time:'2m ago',read:false,link:'/inventory'},
    {id:2,type:'success',msg:'Deal #2031 (Rahul Verma) e-signed successfully',time:'15m ago',read:false,link:'/fi'},
    {id:3,type:'error',  msg:'Engine Air Filter stock critically low (3 left)',time:'1h ago', read:false,link:'/service'},
    {id:4,type:'info',   msg:'New lead from Autotrader: Meena Iyer – Nexon EV',time:'2h ago', read:true, link:'/leads'},
    {id:5,type:'warning',msg:'7 F&I deals awaiting e-signature',time:'3h ago',read:true,link:'/fi'},
    {id:6,type:'success',msg:'Service CSAT score updated: 4.8★',time:'5h ago',read:true,link:'/service'},
  ]);

  useEffect(()=>{
    document.body.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  function markRead(id) {
    setNotifications(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  }
  function markAllRead() {
    setNotifications(n=>n.map(x=>({...x,read:true})));
  }

  return (
    <AppCtx.Provider value={{ notifications, markRead, markAllRead, isDark }}>
      <style>{LIGHT_CSS}</style>
      <BrowserRouter>
        <div className="app-shell">

          {/* Mobile overlay — click to close sidebar */}
          {sidebarOpen && (
            <div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)}/>
          )}

          <Sidebar
            onThemeToggle={()=>setIsDark(d=>!d)}
            isDark={isDark}
            isOpen={sidebarOpen}
            onClose={()=>setSidebarOpen(false)}
          />

          <div className="main-area">
            <Topbar
              search={search}
              onSearch={setSearch}
              onMenuClick={()=>setSidebarOpen(o=>!o)}
            />
            <div className="page-content">
              <Routes>
                <Route path="/"          element={<Navigate to="/dashboard" replace/>}/>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/inventory" element={<Inventory />}/>
                <Route path="/leads"     element={<Leads     />}/>
                <Route path="/sales"     element={<Sales     />}/>
                <Route path="/fi"        element={<FI        />}/>
                <Route path="/service"   element={<Service   />}/>
                <Route path="/analytics" element={<Analytics />}/>
                <Route path="/settings"  element={<Settings  />}/>
                <Route path="*"          element={<NotFound  />}/>
              </Routes>
            </div>
          </div>

        </div>
      </BrowserRouter>
    </AppCtx.Provider>
  );
}
