import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
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
import Login      from './pages/Login';
import { CurrencyProvider } from './context/CurrencyContext';

export const AppCtx = createContext({});
export function useApp() { return useContext(AppCtx); }

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{textAlign:'center',paddingTop:80}}>
      <div style={{fontSize:64,marginBottom:16}}>🚗</div>
      <div style={{fontFamily:'var(--font)',fontWeight:800,fontSize:32,color:'var(--text)',marginBottom:8}}>404 – Page Not Found</div>
      <div style={{color:'var(--muted)',marginBottom:24}}>This route doesn't exist in the portal.</div>
      <button className="btn btn-primary" onClick={()=>navigate('/dashboard')}>← Back to Dashboard</button>
    </div>
  );
}

export default function App() {
  const [user,        setUser]        = useState(null);   // null = not logged in
  const [search,      setSearch]      = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    {id:1,type:'warning',msg:'3 vehicles pending reconditioning approval',time:'2m ago',read:false,link:'/inventory'},
    {id:2,type:'success',msg:'Deal #2031 (Rahul Verma) e-signed successfully',time:'15m ago',read:false,link:'/fi'},
    {id:3,type:'error',  msg:'Engine Air Filter stock critically low (3 left)',time:'1h ago',read:false,link:'/service'},
    {id:4,type:'info',   msg:'New lead from Autotrader: Meena Iyer – Nexon EV',time:'2h ago',read:true,link:'/leads'},
    {id:5,type:'warning',msg:'7 F&I deals awaiting e-signature',time:'3h ago',read:true,link:'/fi'},
    {id:6,type:'success',msg:'Service CSAT score updated: 4.8★',time:'5h ago',read:true,link:'/service'},
  ]);

  function markRead(id)  { setNotifications(n=>n.map(x=>x.id===id?{...x,read:true}:x)); }
  function markAllRead() { setNotifications(n=>n.map(x=>({...x,read:true}))); }

  // ── Show Login if not authenticated ──
  if (!user) {
    return (
      <CurrencyProvider>
        <Login onLogin={setUser}/>
      </CurrencyProvider>
    );
  }

  const marginLeft = sidebarCollapsed ? 64 : 252;

  return (
    <CurrencyProvider>
      <AppCtx.Provider value={{ notifications, markRead, markAllRead, user, onLogout: ()=>setUser(null) }}>
        <BrowserRouter>
          <div className="app-shell">
            {sidebarOpen && (
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:199}}
                onClick={()=>setSidebarOpen(false)}/>
            )}
            <Sidebar
              isOpen={sidebarOpen}
              onClose={()=>setSidebarOpen(false)}
              onCollapseChange={setSidebarCollapsed}
              user={user}
            />
            <div className="main-area" style={{
              marginLeft,
              transition:'margin-left 0.22s cubic-bezier(0.4,0,0.2,1)',
            }}>
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
    </CurrencyProvider>
  );
}