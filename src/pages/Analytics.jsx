import { useState } from 'react';
import { dashboardStats } from '../data/staticData';
import { IconDownload } from '../components/Icons';
import Toast from '../components/Toast';

const { monthlyChart, kpis } = dashboardStats;

const ADVISOR_DATA = [
  { name:'Kiran S.',  leads:24, closed:8, revenue:312000, csat:4.8 },
  { name:'Raj P.',    leads:19, closed:6, revenue:248000, csat:4.6 },
  { name:'Anita R.',  leads:22, closed:7, revenue:287000, csat:4.7 },
  { name:'Deepak M.', leads:16, closed:5, revenue:194000, csat:4.5 },
];

const CATEGORY_DATA = [
  { cat:'SUV',    new:88, used:31, color:'var(--accent)' },
  { cat:'Sedan',  new:54, used:22, color:'var(--blue)'   },
  { cat:'EV',     new:38, used:14, color:'var(--green)'  },
  { cat:'Luxury', new:18, used:9,  color:'var(--purple)' },
  { cat:'Hatch',  new:22, used:8,  color:'var(--red)'    },
];

const FORECASTS = [
  { month:'Apr 2026', predicted:86, low:78, high:94 },
  { month:'May 2026', predicted:92, low:83, high:101 },
  { month:'Jun 2026', predicted:98, low:88, high:108 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('6M');
  const [toast,  setToast]  = useState(null);
  const maxBar = Math.max(...monthlyChart.map(m=>m.new+m.used+m.service));

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Business Intelligence</div>
          <div className="page-sub">Predictive analytics · Inventory optimization · Sales forecasting</div>
        </div>
        <div className="page-actions">
          <div className="tab-bar" style={{marginBottom:0}}>
            {['1M','3M','6M','1Y'].map(p=>(
              <button key={p} className={`tab-btn${period===p?' active':''}`} onClick={()=>setPeriod(p)} style={{padding:'6px 12px',fontSize:12}}>{p}</button>
            ))}
          </div>
          <button className="btn btn-outline" onClick={()=>setToast({msg:'Report exported!',color:'var(--green)'})}>
            <IconDownload />Export
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[
          { l:'Inventory Turn Rate', v:kpis.inventoryTurnDays+'d', s:'vs industry avg 30d', c:'var(--accent)'  },
          { l:'Market Days Supply',  v:kpis.marketDaysSupply+'d',  s:'Healthy range',        c:'var(--blue)'   },
          { l:'Avg Gross Profit',    v:'$'+kpis.avgGrossProfit.toLocaleString(), s:'+$180 vs last month', c:'var(--green)' },
          { l:'Forecast Accuracy',   v:kpis.forecastAccuracy,      s:'Predictive model v2.1',c:'var(--purple)' },
        ].map(k=>(
          <div key={k.l} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:11,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1.2,fontWeight:600,marginBottom:10}}>{k.l}</div>
            <div style={{fontFamily:'var(--font)',fontWeight:800,fontSize:26,color:k.c,lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:12,color:'var(--muted)',marginTop:6}}>{k.s}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        {/* Monthly Chart */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Monthly Sales Performance</div><div className="card-sub">New · Used · Service</div></div>
          </div>
          <div style={{padding:'20px 16px 8px',display:'flex',alignItems:'flex-end',gap:14,height:200}}>
            {monthlyChart.map(m=>{
              const scale = 140/maxBar;
              return (
                <div key={m.month} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',gap:2,height:150,width:'100%'}}>
                    <div style={{borderRadius:'4px 4px 0 0',background:'rgba(34,197,94,0.5)',height:m.service*scale}}/>
                    <div style={{borderRadius:'4px 4px 0 0',background:'rgba(59,130,246,0.7)',height:m.used*scale}}/>
                    <div style={{borderRadius:'4px 4px 0 0',background:'var(--accent)',height:m.new*scale}}/>
                  </div>
                  <div style={{fontSize:10,color:'var(--muted)'}}>{m.month}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',gap:16,padding:'0 18px 14px',flexWrap:'wrap'}}>
            {[['var(--accent)','New'],['var(--blue)','Used/CPO'],['var(--green)','Service']].map(([c,l])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:8,height:8,borderRadius:2,background:c}}/>
                <span style={{fontSize:11,color:'var(--muted)'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Mix */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Sales by Category</div><div className="card-sub">New vs Used</div></div>
          </div>
          <div style={{padding:'18px 20px'}}>
            {CATEGORY_DATA.map(c=>{
              const total=c.new+c.used;
              return (
                <div key={c.cat} style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:500}}>{c.cat}</span>
                    <span style={{fontSize:12,color:'var(--muted)'}}>{total} units</span>
                  </div>
                  <div style={{height:8,background:'var(--bg3)',borderRadius:4,overflow:'hidden',display:'flex'}}>
                    <div style={{width:`${(c.new/total)*100}%`,background:c.color,transition:'width .8s'}}/>
                    <div style={{width:`${(c.used/total)*100}%`,background:c.color+'55',transition:'width .8s'}}/>
                  </div>
                  <div style={{display:'flex',gap:12,marginTop:3}}>
                    <span style={{fontSize:10,color:'var(--muted)'}}>New:{c.new}</span>
                    <span style={{fontSize:10,color:'var(--muted)'}}>Used:{c.used}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="card mb-24">
        <div className="card-header">
          <div><div className="card-title">Sales Team Performance</div><div className="card-sub">This month</div></div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr><th>Advisor</th><th>Leads</th><th>Closed</th><th>Conversion</th><th>Revenue</th><th>CSAT</th><th>Performance</th></tr></thead>
            <tbody>
              {ADVISOR_DATA.map((a,i)=>{
                const conv=Math.round(a.closed/a.leads*100);
                const maxRev=Math.max(...ADVISOR_DATA.map(x=>x.revenue));
                return (
                  <tr key={a.name}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:32,height:32,borderRadius:'50%',background:['#e8a020','#3b82f6','#22c55e','#a855f7'][i],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font)',fontWeight:700,fontSize:12,color:'#000',flexShrink:0}}>
                          {a.name.split(' ').map(w=>w[0]).join('')}
                        </div>
                        <span style={{fontWeight:500}}>{a.name}</span>
                      </div>
                    </td>
                    <td>{a.leads}</td>
                    <td style={{fontFamily:'var(--font)',fontWeight:700}}>{a.closed}</td>
                    <td><span style={{color:conv>=35?'var(--green)':conv>=25?'var(--accent)':'var(--red)',fontWeight:600}}>{conv}%</span></td>
                    <td style={{fontFamily:'var(--font)',fontWeight:700,color:'var(--accent)'}}>${(a.revenue/1000).toFixed(0)}K</td>
                    <td><span style={{color:'var(--accent)'}}>★</span> <span style={{fontWeight:600}}>{a.csat}</span></td>
                    <td style={{width:120}}>
                      <div className="prog-bar" style={{height:7}}>
                        <div className="prog-fill" style={{width:`${(a.revenue/maxRev)*100}%`,background:'var(--accent)'}}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecast */}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">Sales Forecast</div><div className="card-sub">AI-powered · 91% accuracy · Next 3 months</div></div>
          <span className="tag tag-green">Model v2.1 Active</span>
        </div>
        <div style={{padding:20,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {FORECASTS.map(f=>(
            <div key={f.month} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,padding:20,textAlign:'center'}}>
              <div style={{fontSize:11,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>{f.month}</div>
              <div style={{fontFamily:'var(--font)',fontWeight:800,fontSize:34,color:'var(--accent)',lineHeight:1}}>{f.predicted}</div>
              <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>predicted units</div>
              <div style={{marginTop:10,fontSize:11,color:'var(--muted)'}}>
                Range: <span style={{color:'var(--green)'}}>{f.low}</span> – <span style={{color:'var(--blue)'}}>{f.high}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:'0 20px 20px'}}>
          <div style={{padding:'12px 16px',background:'rgba(34,197,94,0.07)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:8,fontSize:13,color:'var(--muted2)',lineHeight:1.6}}>
            💡 <strong style={{color:'var(--text)'}}>AI Insight:</strong> SUV inventory is projected to deplete 8 days ahead of schedule. Consider placing factory orders for 12–15 additional SUV units to meet Q2 demand.
          </div>
        </div>
      </div>

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
