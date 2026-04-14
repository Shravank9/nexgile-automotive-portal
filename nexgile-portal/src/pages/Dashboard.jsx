import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardStats, deals as INIT_DEALS, serviceBookings, vehicles, leads, parts } from '../data/staticData';
import { IconPlus, IconDownload, IconArrowUp, IconArrowDown, IconClose, IconCheck, IconWarning } from '../components/Icons';
import Toast from '../components/Toast';

const SPARK = {
  orange:[40,60,45,75,55,100], blue:[55,70,50,80,65,100],
  green:[50,65,55,85,70,100],  red:[80,100,75,60,70,65],
};
const STAGE_CLR = {
  'Desking':'var(--accent)','F&I Review':'var(--blue)',
  'E-Sign':'var(--green)','Credit Pending':'var(--red)','Delivered':'var(--green)',
};

function calc(principal, rate, months) {
  if (!principal||!rate||!months) return 0;
  const r=rate/100/12;
  return Math.round(principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1));
}

const EMPTY = { customer:'',vehicle:'',type:'Purchase',salePrice:'',tradeIn:'0',downPayment:'',rate:'7.0',term:'60' };

function KpiCard({ label, value, change, up, color, spark, onClick }) {
  const clr = { orange:'#e8a020', blue:'#3b82f6', green:'#22c55e', red:'#ef4444' }[color];
  return (
    <div className={`kpi-card c-${color}`} onClick={onClick} style={onClick?{cursor:'pointer'}:{}}>
      <div className="kpi-header">
        <div className="kpi-label">{label}</div>
        <div className={`kpi-icon-wrap c-${color}`}>
          <svg className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${up?'up':'down'}`}>
        {up?<IconArrowUp/>:<IconArrowDown/>}{change}
      </div>
      <div className="sparkline">
        {spark.map((h,i)=>(
          <div key={i} className="spark-bar"
            style={{background: i===spark.length-1 ? clr : clr+'55', height:`${h}%`}}/>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { monthlyChart, leadSources, kpis } = dashboardStats;
  const [deals, setDeals] = useState(INIT_DEALS);
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState(EMPTY);
  const [toast, setToast] = useState(null);

  const sp=parseFloat(form.salePrice)||0, ti=parseFloat(form.tradeIn)||0, dp=parseFloat(form.downPayment)||0;
  const fa=Math.max(0,sp-ti-dp), mp=calc(fa,parseFloat(form.rate)||0,parseInt(form.term)||60);

  function openModal(){ setForm(EMPTY); setModal(true); }

  function saveDeal(){
    if(!form.customer||!form.vehicle||!form.salePrice){
      setToast({msg:'Fill Customer, Vehicle & Sale Price',color:'var(--red)'}); return;
    }
    setDeals(d=>[{...form,id:Date.now(),salePrice:sp,tradeIn:ti,downPayment:dp,financeAmount:fa,monthlyPayment:mp,term:parseInt(form.term),rate:parseFloat(form.rate),stage:20},...d]);
    setModal(false);
    setToast({msg:`✅ Deal created for ${form.customer}!`,color:'var(--green)'});
  }

  const criticalParts  = parts.filter(p=>p.status==='Critical Low').length;
  const overdueLeads   = leads.filter(l=>l.status==='Follow-up Due').length;
  const availableVehicles = vehicles.filter(v=>v.status==='Available').length;

  return (
    <div className="page-fade">

      {/* ── ALERT STRIP ── */}
      <div className="alert-strip">
        <IconWarning/>
        <span>
          <strong>3 vehicles</strong> pending reconditioning —{' '}
          <span className="alert-link" onClick={()=>navigate('/inventory')}>Review in Inventory</span>
          &nbsp;·&nbsp;
          <strong>7 F&amp;I deals</strong> awaiting e-signature —{' '}
          <span className="alert-link" onClick={()=>navigate('/fi')}>Open F&amp;I Queue</span>
          &nbsp;·&nbsp;
          <strong>{criticalParts} parts</strong> critically low —{' '}
          <span className="alert-link" onClick={()=>navigate('/service')}>Check Parts</span>
        </span>
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Operations Dashboard</div>
          <div className="page-sub">Real-time DMS sync · Last updated 2 min ago</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={()=>navigate('/analytics')}><IconDownload/>Export Report</button>
          <button className="btn btn-primary" onClick={openModal}><IconPlus/>New Deal</button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 1 — MAIN KPI CARDS
      ══════════════════════════════════════ */}
      <div className="kpi-grid" style={{marginBottom:28}}>
        <KpiCard label="Total Inventory"  value="248"   change="+14 this week"       up    color="orange" spark={SPARK.orange} onClick={()=>navigate('/inventory')}/>
        <KpiCard label="Open Leads"       value="84"    change="+23% conversion"     up    color="blue"   spark={SPARK.blue}   onClick={()=>navigate('/leads')}/>
        <KpiCard label="Monthly Revenue"  value="$2.4M" change="+8.2% vs last month" up    color="green"  spark={SPARK.green}  onClick={()=>navigate('/analytics')}/>
        <KpiCard label="Service Bookings" value="37"    change="−3 vs yesterday"     up={false} color="red" spark={SPARK.red} onClick={()=>navigate('/service')}/>
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — QUICK STATS ROW
      ══════════════════════════════════════ */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,marginBottom:28}}>
        {[
          {icon:'🚗', label:'Available Now',    val:availableVehicles, sub:'Vehicles ready',        color:'var(--green)',  click:()=>navigate('/inventory')},
          {icon:'🔥', label:'Hot Leads',         val:leads.filter(l=>l.status==='Hot Lead').length,  sub:'Need follow-up',  color:'var(--red)',    click:()=>navigate('/leads')},
          {icon:'📋', label:'Deals in Desking',  val:deals.filter(d=>d.status==='Desking').length,   sub:'Active deals',    color:'var(--accent)', click:()=>navigate('/sales')},
          {icon:'✍️', label:'E-Sign Pending',    val:7,                                              sub:'Docs awaiting',   color:'var(--blue)',   click:()=>navigate('/fi')},
          {icon:'⚠️', label:'Parts Critical',    val:criticalParts,                                  sub:'Low stock alert', color:'var(--red)',    click:()=>navigate('/service')},
          {icon:'⭐', label:'Avg CSAT',           val:'4.7',                                          sub:'This month',      color:'var(--accent)', click:()=>navigate('/analytics')},
        ].map(s=>(
          <div key={s.label} className="card" onClick={s.click} style={{cursor:'pointer',padding:'14px 16px',textAlign:'center'}}>
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:20,color:s.color}}>{s.val}</div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text)',marginTop:2}}>{s.label}</div>
            <div style={{fontSize:10,color:'var(--muted)',marginTop:1}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          SECTION 3 — DEALS PIPELINE + SIDE
      ══════════════════════════════════════ */}
      <div style={{marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:3,height:18,background:'var(--accent)',borderRadius:2}}/>
        <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:'#fff',textTransform:'uppercase',letterSpacing:.8}}>Sales Pipeline</span>
      </div>
      <div className="grid-auto-2" style={{marginBottom:28}}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Active Deals Pipeline</div>
              <div className="card-sub">Omnichannel · {deals.length} active deals</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-primary btn-sm" onClick={openModal}><IconPlus/>New</button>
              <button className="btn btn-outline btn-sm" onClick={()=>navigate('/sales')}>View All →</button>
            </div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>Vehicle</th><th>Customer</th><th>Type</th><th>Value</th><th>Monthly</th><th>Progress</th><th>Stage</th></tr></thead>
              <tbody>
                {deals.slice(0,6).map(d=>(
                  <tr key={d.id} style={{cursor:'pointer'}} onClick={()=>navigate('/sales')}>
                    <td>
                      <div className="vehicle-cell">
                        <div className="vehicle-thumb">🚗</div>
                        <div className="v-name">{d.vehicle}</div>
                      </div>
                    </td>
                    <td style={{fontWeight:500}}>{d.customer}</td>
                    <td><span className={`tag ${d.type==='Lease'?'tag-purple':'tag-blue'}`}>{d.type}</span></td>
                    <td style={{fontFamily:'var(--syne)',fontWeight:700}}>${d.salePrice.toLocaleString()}</td>
                    <td style={{color:'var(--accent)',fontWeight:600}}>${d.monthlyPayment}/mo</td>
                    <td>
                      <div style={{width:90}}>
                        <div className="stage-bar"><div className="stage-fill" style={{width:`${d.stage}%`,background:STAGE_CLR[d.status]||'var(--accent)'}}/></div>
                        <div className="stage-label">{d.stage}%</div>
                      </div>
                    </td>
                    <td><span className="tag" style={{background:'rgba(255,255,255,0.07)',color:STAGE_CLR[d.status]||'var(--muted2)'}}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Lead Sources */}
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Lead Sources</div><div className="card-sub">This month</div></div>
              <button className="btn btn-outline btn-sm" onClick={()=>navigate('/leads')}>View →</button>
            </div>
            <div className="card-body">
              {leadSources.map(ls=>(
                <div key={ls.label} className="prog-row">
                  <div className="prog-labels"><span>{ls.label}</span><span style={{color:ls.color}}>{ls.pct}%</span></div>
                  <div className="prog-bar"><div className="prog-fill" style={{width:`${ls.pct}%`,background:ls.color}}/></div>
                </div>
              ))}
            </div>
          </div>
          {/* KPI Snapshot */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">KPI Snapshot</div>
              <button className="btn btn-outline btn-sm" onClick={()=>navigate('/analytics')}>Report →</button>
            </div>
            {[
              {icon:'⚡',label:'Operational Efficiency',desc:'Manual entry reduction', val:kpis.operationalEfficiency,color:'var(--green)'},
              {icon:'💰',label:'F&I Penetration',       desc:'Revenue growth KPI',     val:kpis.fiPenetration,        color:'var(--blue)'},
              {icon:'⭐',label:'Customer CSAT',          desc:'Digital self-service',   val:kpis.csat+' / 5',         color:'var(--accent)'},
            ].map(k=>(
              <div key={k.label} className="mini-list-item">
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div className="mini-icon" style={{background:'rgba(255,255,255,0.04)'}}>{k.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{k.label}</div>
                    <div style={{fontSize:11,color:'var(--muted)'}}>{k.desc}</div>
                  </div>
                </div>
                <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:16,color:k.color}}>{k.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 4 — INVENTORY + LEADS SUMMARY
      ══════════════════════════════════════ */}
      <div style={{marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:3,height:18,background:'var(--blue)',borderRadius:2}}/>
        <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:'#fff',textTransform:'uppercase',letterSpacing:.8}}>Inventory & Leads</span>
      </div>
      <div className="grid-3" style={{marginBottom:28}}>

        {/* Inventory status breakdown */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Inventory Status</div><div className="card-sub">Live breakdown</div></div>
            <button className="btn btn-outline btn-sm" onClick={()=>navigate('/inventory')}>View →</button>
          </div>
          <div style={{padding:'12px 0'}}>
            {[
              {label:'Available',   count:vehicles.filter(v=>v.status==='Available').length,        color:'var(--green)'},
              {label:'Deal in Progress', count:vehicles.filter(v=>v.status==='Deal in Progress').length, color:'var(--accent)'},
              {label:'On Hold',     count:vehicles.filter(v=>v.status==='On Hold').length,           color:'var(--red)'},
              {label:'Reconditioning',count:vehicles.filter(v=>v.status==='Reconditioning').length,  color:'var(--muted)'},
              {label:'In-Transit',  count:vehicles.filter(v=>v.status==='In-Transit').length,        color:'var(--blue)'},
            ].map(s=>(
              <div key={s.label} className="mini-list-item">
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:s.color,flexShrink:0}}/>
                  <span style={{fontSize:13}}>{s.label}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:60,height:5,background:'rgba(255,255,255,0.07)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{width:`${(s.count/10)*100}%`,height:'100%',background:s.color,borderRadius:3}}/>
                  </div>
                  <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:15,color:s.color,minWidth:20,textAlign:'right'}}>{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category mix */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Inventory by Category</div><div className="card-sub">Turn rate overview</div></div>
          </div>
          <div style={{padding:'12px 0'}}>
            {[
              {cat:'SUV',   count:4, days:18, color:'var(--accent)'},
              {cat:'Sedan', count:3, days:12, color:'var(--blue)'},
              {cat:'EV',    count:2, days:22, color:'var(--green)'},
              {cat:'Luxury',count:1, days:44, color:'var(--purple)'},
            ].map(c=>(
              <div key={c.cat} className="mini-list-item">
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:13,fontWeight:500,minWidth:60}}>{c.cat}</span>
                  <span style={{fontSize:11,color:'var(--muted)'}}>{c.count} units</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:c.days>30?'var(--red)':c.days>15?'var(--accent)':'var(--green)'}}>{c.days}d</div>
                  <div style={{fontSize:10,color:'var(--muted)'}}>avg turn</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead status */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Lead Pipeline Status</div><div className="card-sub">By stage</div></div>
            <button className="btn btn-outline btn-sm" onClick={()=>navigate('/leads')}>View →</button>
          </div>
          <div style={{padding:'12px 0'}}>
            {[
              {label:'Hot Lead',       color:'var(--red)'},
              {label:'Qualified',      color:'var(--blue)'},
              {label:'Negotiating',    color:'var(--purple)'},
              {label:'Follow-up Due',  color:'var(--accent)'},
              {label:'Closed Won',     color:'var(--green)'},
            ].map(s=>{
              const cnt=leads.filter(l=>l.status===s.label).length;
              return (
                <div key={s.label} className="mini-list-item">
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:s.color,flexShrink:0}}/>
                    <span style={{fontSize:13}}>{s.label}</span>
                  </div>
                  <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:15,color:s.color}}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 5 — SERVICE + CHARTS + REVENUE
      ══════════════════════════════════════ */}
      <div style={{marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:3,height:18,background:'var(--green)',borderRadius:2}}/>
        <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:'#fff',textTransform:'uppercase',letterSpacing:.8}}>Service, Performance & Revenue</span>
      </div>
      <div className="grid-3" style={{marginBottom:28}}>

        {/* Today's service */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Today's Service</div><div className="card-sub">{serviceBookings.length} bookings</div></div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="tag tag-green">{serviceBookings.length}/15</span>
              <button className="btn btn-outline btn-sm" onClick={()=>navigate('/service')}>View →</button>
            </div>
          </div>
          {serviceBookings.slice(0,5).map(s=>(
            <div key={s.id} className="mini-list-item" style={{cursor:'pointer'}} onClick={()=>navigate('/service')}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{fontSize:12,color:'var(--muted)',minWidth:44,fontWeight:500}}>{s.time}</div>
                <div style={{width:8,height:8,borderRadius:'50%',flexShrink:0,
                  background:s.status==='In Progress'?'var(--green)':s.status==='Inspection'?'var(--accent)':s.status==='Parts Waiting'?'var(--blue)':'rgba(255,255,255,0.2)'}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:500}}>{s.customer}</div>
                  <div style={{fontSize:10,color:'var(--muted)'}}>{s.vehicle}</div>
                </div>
              </div>
              <span className={`tag tag-${s.status==='In Progress'?'green':s.status==='Inspection'?'orange':s.status==='Parts Waiting'?'blue':'gray'}`} style={{fontSize:10}}>{s.status}</span>
            </div>
          ))}
        </div>

        {/* Monthly chart */}
        <div className="card" style={{cursor:'pointer'}} onClick={()=>navigate('/analytics')}>
          <div className="card-header">
            <div className="card-title">Monthly Performance</div>
            <div className="card-sub">New · Used · Service</div>
          </div>
          <div className="bar-chart-wrap">
            {monthlyChart.map(m=>(
              <div key={m.month} className="bar-col">
                <div className="bar-stack">
                  <div className="bar-seg" style={{height:m.service*1.5,background:'rgba(34,197,94,0.5)'}}/>
                  <div className="bar-seg" style={{height:m.used,background:'rgba(59,130,246,0.6)'}}/>
                  <div className="bar-seg" style={{height:m.new,background:'var(--accent)'}}/>
                </div>
                <div className="bar-label">{m.month}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:14,padding:'0 16px 12px',flexWrap:'wrap'}}>
            {[['var(--accent)','New'],['var(--blue)','Used'],['var(--green)','Service']].map(([c,l])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:8,height:8,borderRadius:2,background:c}}/><span style={{fontSize:11,color:'var(--muted)'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue donut */}
        <div className="card" style={{cursor:'pointer'}} onClick={()=>navigate('/analytics')}>
          <div className="card-header"><div className="card-title">Revenue Mix</div><div className="card-sub">This month</div></div>
          <div className="donut-container">
            <svg viewBox="0 0 120 120" width="110" height="110" style={{flexShrink:0}}>
              <circle cx="60" cy="60" r="46" fill="none" stroke="#1e2535" strokeWidth="18"/>
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--accent)" strokeWidth="18" strokeDasharray="173 116" strokeDashoffset="0" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--blue)" strokeWidth="18" strokeDasharray="87 202" strokeDashoffset="-173" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--green)" strokeWidth="18" strokeDasharray="29 260" strokeDashoffset="-260" transform="rotate(-90 60 60)"/>
              <text x="60" y="64" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Syne" fontWeight="800">$2.4M</text>
            </svg>
            <div style={{flex:1}}>
              {[['var(--accent)','New Vehicles','60%','$1.44M'],['var(--blue)','F&I Products','30%','$720K'],['var(--green)','Service','10%','$240K']].map(([c,l,p,v])=>(
                <div key={l} style={{marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:c,flexShrink:0}}/>
                    <span style={{fontSize:11,color:'var(--muted)',flex:1}}>{l}</span>
                    <span style={{fontSize:11,fontWeight:600,color:c}}>{p}</span>
                  </div>
                  <div style={{fontSize:12,fontFamily:'var(--syne)',fontWeight:700,paddingLeft:14,color:'var(--text)'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 6 — F&I + PARTS + RECENT LEADS
      ══════════════════════════════════════ */}
      <div style={{marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:3,height:18,background:'var(--purple)',borderRadius:2}}/>
        <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:'#fff',textTransform:'uppercase',letterSpacing:.8}}>F&amp;I · Parts Alerts · Recent Leads</span>
      </div>
      <div className="grid-3" style={{marginBottom:28}}>

        {/* F&I Quick Stats */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">F&amp;I Snapshot</div><div className="card-sub">Credit &amp; signing status</div></div>
            <button className="btn btn-outline btn-sm" onClick={()=>navigate('/fi')}>Open →</button>
          </div>
          <div style={{padding:'14px 16px'}}>
            {[
              {label:'Applications',   val:5,    color:'var(--blue)',   icon:'📋'},
              {label:'Approved',        val:3,    color:'var(--green)',  icon:'✅'},
              {label:'E-Sign Pending',  val:7,    color:'var(--accent)', icon:'✍️'},
              {label:'Avg Approval Rate',val:'78%',color:'var(--green)', icon:'📊'},
            ].map(s=>(
              <div key={s.label} className="mini-list-item">
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:16}}>{s.icon}</span>
                  <span style={{fontSize:13}}>{s.label}</span>
                </div>
                <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:16,color:s.color}}>{s.val}</span>
              </div>
            ))}
          </div>
          <div style={{padding:'0 16px 14px'}}>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',fontSize:12,padding:'8px'}} onClick={()=>navigate('/fi')}>
              View E-Sign Queue →
            </button>
          </div>
        </div>

        {/* Parts Alerts */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Parts Alerts</div><div className="card-sub">Low & critical stock</div></div>
            <button className="btn btn-outline btn-sm" onClick={()=>navigate('/service')}>View →</button>
          </div>
          <div style={{padding:'4px 0'}}>
            {parts.filter(p=>p.status!=='In Stock').slice(0,5).map(p=>(
              <div key={p.id} className="mini-list-item">
                <div>
                  <div style={{fontSize:13,fontWeight:500}}>{p.name}</div>
                  <div style={{fontSize:10,color:'var(--muted)',fontFamily:'monospace'}}>{p.sku}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:p.status==='Critical Low'?'var(--red)':'var(--accent)'}}>{p.stock} left</div>
                  <span className={`tag ${p.status==='Critical Low'?'tag-red':'tag-orange'}`} style={{fontSize:9}}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Recent Leads</div><div className="card-sub">Latest enquiries</div></div>
            <button className="btn btn-outline btn-sm" onClick={()=>navigate('/leads')}>View All →</button>
          </div>
          <div style={{padding:'4px 0'}}>
            {leads.slice(0,5).map((l,i)=>{
              const colors=['#e8a020','#3b82f6','#22c55e','#a855f7','#ef4444'];
              const statusClr={
                'Hot Lead':'var(--red)','Qualified':'var(--blue)',
                'New':'var(--muted)','Follow-up Due':'var(--accent)',
                'Negotiating':'var(--purple)','Closed Won':'var(--green)'
              };
              return (
                <div key={l.id} className="mini-list-item" style={{cursor:'pointer'}} onClick={()=>navigate('/leads')}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:colors[i%colors.length],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--syne)',fontWeight:700,fontSize:11,color:'#000',flexShrink:0}}>
                      {l.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500}}>{l.name}</div>
                      <div style={{fontSize:10,color:'var(--muted)'}}>{l.interest}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:11,fontWeight:600,color:statusClr[l.status]||'var(--muted)'}}>{l.status}</div>
                    <div style={{fontSize:10,color:'var(--muted)'}}>{l.lastContact}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── NEW DEAL MODAL ── */}
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal-box" style={{maxWidth:580}}>
            <div className="modal-title">🚗 Create New Deal</div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Customer Name *</label>
                <input className="form-input" placeholder="e.g. Arjun Mehta" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Vehicle *</label>
                <select className="form-select" value={form.vehicle} onChange={e=>setForm(f=>({...f,vehicle:e.target.value}))}>
                  <option value="">— Select available vehicle —</option>
                  {vehicles.filter(v=>v.status==='Available').map(v=>(
                    <option key={v.id} value={`${v.year} ${v.make} ${v.model}`}>{v.year} {v.make} {v.model} — ${v.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Deal Type</label>
                <select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option>Purchase</option><option>Lease</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Sale Price ($) *</label>
                <input className="form-input" type="number" placeholder="e.g. 34400" value={form.salePrice} onChange={e=>setForm(f=>({...f,salePrice:e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Trade-In ($)</label>
                <input className="form-input" type="number" placeholder="0" value={form.tradeIn} onChange={e=>setForm(f=>({...f,tradeIn:e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Down Payment ($)</label>
                <input className="form-input" type="number" placeholder="e.g. 5000" value={form.downPayment} onChange={e=>setForm(f=>({...f,downPayment:e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Interest Rate (%)</label>
                <input className="form-input" type="number" step="0.1" value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Loan Term</label>
                <select className="form-select" value={form.term} onChange={e=>setForm(f=>({...f,term:e.target.value}))}>
                  {[24,36,48,60,72,84].map(t=><option key={t}>{t} months</option>)}
                </select>
              </div>
            </div>
            {sp>0&&(
              <div style={{background:'rgba(232,160,32,0.08)',border:'1px solid rgba(232,160,32,0.2)',borderRadius:10,padding:'14px 18px',marginBottom:16,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,textAlign:'center'}}>
                <div>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Finance Amount</div>
                  <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:16}}>${fa.toLocaleString()}</div>
                </div>
                <div style={{borderLeft:'1px solid var(--border)',borderRight:'1px solid var(--border)'}}>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Monthly Payment</div>
                  <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:22,color:'var(--accent)'}}>${mp}<span style={{fontSize:13}}>/mo</span></div>
                </div>
                <div>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Total Term</div>
                  <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:16}}>{form.term} months</div>
                </div>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(false)}><IconClose/>Cancel</button>
              <button className="btn btn-primary" onClick={saveDeal}><IconCheck/>Create Deal</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
