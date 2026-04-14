import { useState } from 'react';
import { serviceBookings as INIT_B, parts as INIT_P } from '../data/staticData';
import { IconPlus, IconSearch, IconClose, IconCheck, IconEdit } from '../components/Icons';
import Toast from '../components/Toast';

const B_STATUS={ 'In Progress':'tag-green','Inspection':'tag-orange','Parts Waiting':'tag-blue','Scheduled':'tag-gray','Completed':'tag-green','Cancelled':'tag-red' };
const P_STATUS={ 'Critical Low':'tag-red','Low Stock':'tag-orange','In Stock':'tag-green' };
const ADVISORS=['Pradeep V.','Meena L.','Arjun K.'];
const TECHS=['Suresh K.','Ramesh P.','Anand S.','Vijay M.','Karthik R.'];
const EMPTY_B={ customer:'',vehicle:'',regNo:'',service:'',advisor:ADVISORS[0],tech:TECHS[0],time:'09:00',bay:1,status:'Scheduled',cost:'' };
const EMPTY_P={ name:'',sku:'',make:'',stock:'',reorderAt:'10',unitCost:'',autoOrder:true };

export default function Service() {
  const [bookings, setBookings] = useState(INIT_B);
  const [parts,    setParts]    = useState(INIT_P);
  const [tab,      setTab]      = useState('schedule'); // 'schedule'|'capacity'|'parts'|'appraisal'
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState({});
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(null);

  // Workshop capacity grid
  const BAYS = [1,2,3,4,5,6];
  const bayStatus = BAYS.map(b=>{
    const b_=bookings.find(x=>x.bay===b&&x.status!=='Completed'&&x.status!=='Cancelled');
    return { bay:b, booking:b_, free:!b_ };
  });

  // Appraisal state
  const [appr, setAppr] = useState({ year:'2021',make:'Hyundai',model:'Creta SX',mileage:'42000',condition:'Good',color:'Polar White' });
  const [apprResult, setApprResult] = useState(null);

  function runAppraisal(){
    const base=parseFloat(appr.year)*1200-2400000+parseFloat(appr.mileage)*(-0.05);
    const adjusted=Math.max(300000,Math.round(base/1000)*1000);
    setApprResult({ kbb:adjusted-20000, blackBook:adjusted+20000, recommended:adjusted });
    setToast({msg:'Appraisal complete — market data fetched!',color:'var(--green)'});
  }

  const filtered_b=bookings.filter(b=>{const q=search.toLowerCase();return !q||`${b.customer} ${b.vehicle} ${b.service}`.toLowerCase().includes(q);});
  const filtered_p=parts.filter(p=>{const q=search.toLowerCase();return !q||`${p.name} ${p.sku} ${p.make}`.toLowerCase().includes(q);});

  function saveBooking(){
    if(!form.customer||!form.vehicle){ setToast({msg:'Customer & Vehicle required',color:'var(--red)'}); return; }
    const entry={...form,id:Date.now(),eta:'—',cost:parseFloat(form.cost)||0};
    if(modal==='add-b'){ setBookings(b=>[...b,entry]); setToast({msg:'Booking created!',color:'var(--green)'}); }
    else{ setBookings(b=>b.map(x=>x.id===modal.id?{...entry,id:modal.id}:x)); setToast({msg:'Updated.',color:'var(--blue)'}); }
    setModal(null);
  }

  function savePart(){
    if(!form.name||!form.sku){ setToast({msg:'Name & SKU required',color:'var(--red)'}); return; }
    const stock=parseInt(form.stock)||0,ro=parseInt(form.reorderAt)||10;
    const status=stock===0?'Critical Low':stock<=ro*0.5?'Critical Low':stock<=ro?'Low Stock':'In Stock';
    const entry={...form,id:Date.now(),stock,reorderAt:ro,unitCost:parseFloat(form.unitCost)||0,status};
    if(modal==='add-p'){ setParts(p=>[...p,entry]); setToast({msg:'Part added!',color:'var(--green)'}); }
    else{ setParts(p=>p.map(x=>x.id===modal.id?{...entry,id:modal.id}:x)); setToast({msg:'Updated.',color:'var(--blue)'}); }
    setModal(null);
  }

  function updateBStatus(id,status){ setBookings(b=>b.map(x=>x.id===id?{...x,status}:x)); setToast({msg:`→ ${status}`,color:'var(--accent)'}); }
  function adjustStock(id,delta){ setParts(p=>p.map(x=>{if(x.id!==id)return x;const s=Math.max(0,x.stock+delta);const st=s===0?'Critical Low':s<=x.reorderAt*0.5?'Critical Low':s<=x.reorderAt?'Low Stock':'In Stock';return{...x,stock:s,status:st};}));}

  const crit=parts.filter(p=>p.status==='Critical Low').length;
  const inProg=bookings.filter(b=>b.status==='In Progress').length;

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Service &amp; Parts</div>
          <div className="page-sub">Workshop scheduling · Real-time capacity · Parts inventory · Used vehicle appraisal</div>
        </div>
        <div className="page-actions">
          {tab==='schedule'&&<button className="btn btn-primary" onClick={()=>{setForm(EMPTY_B);setModal('add-b');}}><IconPlus/>Book Appointment</button>}
          {tab==='parts'   &&<button className="btn btn-primary" onClick={()=>{setForm(EMPTY_P);setModal('add-p');}}><IconPlus/>Add Part</button>}
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{marginBottom:20}}>
        {[
          {l:"Today's Bookings", v:`${bookings.filter(b=>b.status!=='Cancelled').length}/15`, c:'c-green'},
          {l:'Active Bays',      v:inProg,   c:'c-orange'},
          {l:'Parts Alerts',     v:crit,     c:'c-red'},
          {l:'Avg CSAT',         v:'4.8★',   c:'c-blue'},
        ].map(k=>(
          <div key={k.l} className={`kpi-card ${k.c}`}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{fontSize:26,marginTop:10}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="tab-bar" style={{marginBottom:16}}>
        <button className={`tab-btn${tab==='schedule'?' active':''}`} onClick={()=>setTab('schedule')}>🔧 Service Schedule ({bookings.length})</button>
        <button className={`tab-btn${tab==='capacity'?' active':''}`} onClick={()=>setTab('capacity')}>🏭 Workshop Capacity</button>
        <button className={`tab-btn${tab==='parts'?' active':''}`} onClick={()=>setTab('parts')}>
          📦 Parts Inventory {crit>0&&<span className="nav-badge" style={{marginLeft:4}}>{crit}</span>}
        </button>
        <button className={`tab-btn${tab==='appraisal'?' active':''}`} onClick={()=>setTab('appraisal')}>🔍 Vehicle Appraisal (KBB)</button>
      </div>

      {/* Search */}
      {(tab==='schedule'||tab==='parts')&&(
        <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:9,padding:'8px 14px',marginBottom:16,maxWidth:360}}>
          <IconSearch/>
          <input style={{background:'none',border:'none',outline:'none',color:'var(--text)',fontFamily:'var(--dm)',fontSize:13,flex:1}}
            placeholder={tab==='schedule'?'Search customer, vehicle…':'Search part name, SKU…'}
            value={search} onChange={e=>setSearch(e.target.value)}/>
          {search&&<span style={{cursor:'pointer',color:'var(--muted)',fontSize:16}} onClick={()=>setSearch('')}>×</span>}
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {tab==='schedule'&&(
        <div className="card">
          <div className="card-header">
            <div className="card-title">Service Bay Schedule</div>
            <div className="card-sub">{filtered_b.length} bookings shown</div>
          </div>
          {crit>0&&(
            <div style={{margin:'12px 16px 0',padding:'10px 14px',background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,fontSize:13}}>
              ⚠️ <strong>{crit} parts</strong> critically low — may delay services. <span style={{color:'var(--accent)',cursor:'pointer'}} onClick={()=>setTab('parts')}>View Parts →</span>
            </div>
          )}
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>Bay</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Advisor</th><th>Technician</th><th>Time</th><th>Est. Cost</th><th>Status</th><th>Edit</th></tr></thead>
              <tbody>
                {filtered_b.length===0&&<tr><td colSpan={10} style={{textAlign:'center',padding:32,color:'var(--muted)'}}>No bookings found.</td></tr>}
                {filtered_b.map(b=>(
                  <tr key={b.id}>
                    <td style={{fontFamily:'var(--syne)',fontWeight:700,color:'var(--accent)'}}>Bay {b.bay}</td>
                    <td style={{fontWeight:500}}>{b.customer}</td>
                    <td><div>{b.vehicle}</div><div style={{fontSize:10,color:'var(--muted)',fontFamily:'monospace'}}>{b.regNo}</div></td>
                    <td style={{fontSize:12,color:'var(--muted2)',maxWidth:160}}>{b.service}</td>
                    <td style={{fontSize:12}}>{b.advisor}</td>
                    <td style={{fontSize:12}}>{b.tech}</td>
                    <td style={{fontSize:12,fontWeight:500}}>{b.time}</td>
                    <td style={{fontFamily:'var(--syne)',fontWeight:600,color:'var(--accent)'}}>₹{b.cost.toLocaleString()}</td>
                    <td>
                      <select className="form-select" value={b.status} onChange={e=>updateBStatus(b.id,e.target.value)} style={{padding:'4px 8px',fontSize:11,borderRadius:6}}>
                        {Object.keys(B_STATUS).map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><button className="btn btn-outline btn-sm" onClick={()=>{setForm({...b});setModal(b);}}><IconEdit/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CAPACITY TAB ── */}
      {tab==='capacity'&&(
        <div>
          <div style={{marginBottom:16,fontSize:13,color:'var(--muted)'}}>
            Real-time workshop capacity · {BAYS.length} total bays · {bayStatus.filter(b=>b.free).length} available now
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
            {bayStatus.map(b=>(
              <div key={b.bay} className="card" style={{border:`1px solid ${b.free?'rgba(34,197,94,0.3)':'rgba(232,160,32,0.3)'}`,background:b.free?'rgba(34,197,94,0.04)':'rgba(232,160,32,0.04)'}}>
                <div style={{padding:'16px 18px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:18}}>Bay {b.bay}</div>
                    <span className={`tag ${b.free?'tag-green':'tag-orange'}`}>{b.free?'Available':'Occupied'}</span>
                  </div>
                  {b.booking?(
                    <>
                      <div style={{fontWeight:600,marginBottom:4}}>{b.booking.customer}</div>
                      <div style={{fontSize:12,color:'var(--muted2)',marginBottom:2}}>{b.booking.vehicle}</div>
                      <div style={{fontSize:11,color:'var(--muted)',marginBottom:8}}>{b.booking.service}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:12,color:'var(--muted)'}}>{b.booking.time} · Tech: {b.booking.tech}</span>
                        <span className={`tag ${B_STATUS[b.booking.status]||'tag-gray'}`} style={{fontSize:10}}>{b.booking.status}</span>
                      </div>
                    </>
                  ):(
                    <div style={{textAlign:'center',padding:'16px 0',color:'var(--muted)'}}>
                      <div style={{fontSize:24,marginBottom:8}}>✅</div>
                      <div style={{fontSize:12}}>Bay available for booking</div>
                      <button className="btn btn-primary btn-sm" style={{marginTop:8}} onClick={()=>{setForm({...EMPTY_B,bay:b.bay});setModal('add-b');setTab('schedule');}}>Book Now</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Advisor workload */}
          <div className="card">
            <div className="card-header"><div className="card-title">Advisor &amp; Technician Workload</div></div>
            <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Role</th><th>Active Jobs</th><th>Completed Today</th><th>Workload</th></tr></thead>
                <tbody>
                  {[...ADVISORS.map((a,i)=>({name:a,role:'Service Advisor',active:bookings.filter(b=>b.advisor===a&&b.status==='In Progress').length,done:i+2})),
                    ...TECHS.map((t,i)=>({name:t,role:'Technician',active:bookings.filter(b=>b.tech===t&&b.status==='In Progress').length,done:i+1}))
                  ].map(w=>(
                    <tr key={w.name}>
                      <td style={{fontWeight:500}}>{w.name}</td>
                      <td style={{fontSize:12,color:'var(--muted2)'}}>{w.role}</td>
                      <td style={{fontFamily:'var(--syne)',fontWeight:700,color:w.active>2?'var(--red)':w.active>0?'var(--accent)':'var(--muted)'}}>{w.active}</td>
                      <td style={{color:'var(--green)',fontWeight:600}}>{w.done}</td>
                      <td style={{width:120}}>
                        <div className="prog-bar" style={{height:6}}>
                          <div className="prog-fill" style={{width:`${Math.min(100,(w.active/3)*100)}%`,background:w.active>2?'var(--red)':w.active>0?'var(--accent)':'var(--green)'}}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PARTS TAB ── */}
      {tab==='parts'&&(
        <div className="card">
          <div className="card-header">
            <div className="card-title">Parts Inventory</div>
            <div className="card-sub">Auto-reorder · Manufacturer catalog sync</div>
          </div>
          {crit>0&&(
            <div style={{margin:'12px 16px 0',padding:'10px 14px',background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,fontSize:13}}>
              🚨 <strong>{crit} parts critically low</strong> — auto-order has been triggered for enabled items.
            </div>
          )}
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>Part</th><th>SKU</th><th>Make/Fitment</th><th>In Stock</th><th>Reorder At</th><th>Unit Cost</th><th>Auto-Order</th><th>Status</th><th>Adjust</th><th>Edit</th></tr></thead>
              <tbody>
                {filtered_p.map(p=>(
                  <tr key={p.id}>
                    <td style={{fontWeight:500}}>{p.name}</td>
                    <td style={{fontFamily:'monospace',fontSize:11,color:'var(--muted)'}}>{p.sku}</td>
                    <td style={{fontSize:12,color:'var(--muted2)'}}>{p.make}</td>
                    <td style={{fontFamily:'var(--syne)',fontWeight:700,color:p.status==='Critical Low'?'var(--red)':p.status==='Low Stock'?'var(--accent)':'var(--green)'}}>{p.stock}</td>
                    <td style={{color:'var(--muted)',fontSize:12}}>{p.reorderAt}</td>
                    <td>${p.unitCost}</td>
                    <td><span className={`tag ${p.autoOrder?'tag-green':'tag-orange'}`}>{p.autoOrder?'Auto':'Manual'}</span></td>
                    <td><span className={`tag ${P_STATUS[p.status]||'tag-gray'}`}>{p.status}</span></td>
                    <td>
                      <div style={{display:'flex',gap:4}}>
                        <button className="btn btn-outline btn-sm" onClick={()=>adjustStock(p.id,-1)}>−</button>
                        <button className="btn btn-primary btn-sm" onClick={()=>adjustStock(p.id,1)}>+</button>
                      </div>
                    </td>
                    <td><button className="btn btn-outline btn-sm" onClick={()=>{setForm({...p,stock:p.stock.toString(),unitCost:p.unitCost.toString()});setModal(p);}}><IconEdit/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── APPRAISAL TAB ── */}
      {tab==='appraisal'&&(
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">🔍 Used Vehicle Appraisal</div><div className="card-sub">KBB &amp; Black Book market data integration</div></div>
            </div>
            <div className="card-body">
              <div style={{background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:18,fontSize:12,color:'var(--muted2)'}}>
                💡 Enter vehicle details below to fetch live trade-in valuation from KBB and Black Book market data.
              </div>
              <div className="form-grid">
                <div className="form-field"><label className="form-label">Year</label><input className="form-input" value={appr.year} onChange={e=>setAppr(a=>({...a,year:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Make</label><input className="form-input" value={appr.make} onChange={e=>setAppr(a=>({...a,make:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Model</label><input className="form-input" value={appr.model} onChange={e=>setAppr(a=>({...a,model:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Mileage (km)</label><input className="form-input" type="number" value={appr.mileage} onChange={e=>setAppr(a=>({...a,mileage:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Condition</label><select className="form-select" value={appr.condition} onChange={e=>setAppr(a=>({...a,condition:e.target.value}))}>{['Excellent','Good','Fair','Poor'].map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="form-field"><label className="form-label">Color</label><input className="form-input" value={appr.color} onChange={e=>setAppr(a=>({...a,color:e.target.value}))}/></div>
              </div>
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:4}} onClick={runAppraisal}>
                🔍 Get Market Valuation
              </button>

              {apprResult&&(
                <div style={{marginTop:20}}>
                  <div style={{fontSize:11,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,fontWeight:600,marginBottom:10}}>Valuation Results</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                    {[
                      {l:'KBB Value',      v:'₹'+apprResult.kbb.toLocaleString(),        c:'var(--blue)'},
                      {l:'Black Book',     v:'₹'+apprResult.blackBook.toLocaleString(),   c:'var(--purple)'},
                      {l:'Recommended',    v:'₹'+apprResult.recommended.toLocaleString(), c:'var(--green)'},
                    ].map(r=>(
                      <div key={r.l} style={{background:'var(--bg3)',borderRadius:8,padding:'12px',textAlign:'center'}}>
                        <div style={{fontSize:10,color:'var(--muted)',marginBottom:4,textTransform:'uppercase',letterSpacing:.8}}>{r.l}</div>
                        <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:16,color:r.c}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-outline" style={{width:'100%',justifyContent:'center',marginTop:12}}
                    onClick={()=>setToast({msg:'Appraisal saved to reconditioning queue!',color:'var(--green)'})}>
                    📋 Add to Reconditioning Queue
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reconditioning Queue */}
          <div className="card" style={{height:'fit-content'}}>
            <div className="card-header"><div className="card-title">Reconditioning Queue</div><div className="card-sub">Vehicles awaiting prep</div></div>
            {[
              {v:'2021 Hyundai Creta SX',  vin:'KMHH3XL1NMU123456', cost:'₹18,000',days:3, status:'In Progress'},
              {v:'2020 Maruti Brezza ZXI', vin:'MA3EWDE1S00274859', cost:'₹22,000',days:5, status:'Pending'},
              {v:'2023 Tesla Model 3',     vin:'5YJ3E1EA9NF123456', cost:'₹8,500', days:1, status:'Review'},
              {v:'2019 Honda City VX',     vin:'MRHGE8820KP009831', cost:'₹31,000',days:7, status:'Approved'},
            ].map(r=>(
              <div key={r.vin} className="mini-list-item">
                <div>
                  <div style={{fontSize:13,fontWeight:500}}>{r.v}</div>
                  <div style={{fontSize:10,color:'var(--muted)',fontFamily:'monospace'}}>{r.vin}</div>
                  <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>Est. cost: {r.cost} · {r.days} days</div>
                </div>
                <span className={`tag ${r.status==='In Progress'?'tag-orange':r.status==='Approved'?'tag-green':r.status==='Review'?'tag-blue':'tag-gray'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {(modal==='add-b'||(modal&&modal.customer!==undefined&&modal.sku===undefined))&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">{modal==='add-b'?'🔧 Book Appointment':'✏️ Edit Booking'}</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Customer</label><input className="form-input" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Vehicle</label><input className="form-input" value={form.vehicle} onChange={e=>setForm(f=>({...f,vehicle:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Reg No</label><input className="form-input" value={form.regNo} onChange={e=>setForm(f=>({...f,regNo:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Bay (1-6)</label><input className="form-input" type="number" min="1" max="6" value={form.bay} onChange={e=>setForm(f=>({...f,bay:+e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Time</label><input className="form-input" type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Est. Cost (₹)</label><input className="form-input" type="number" value={form.cost} onChange={e=>setForm(f=>({...f,cost:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Service Advisor</label><select className="form-select" value={form.advisor} onChange={e=>setForm(f=>({...f,advisor:e.target.value}))}>{ADVISORS.map(a=><option key={a}>{a}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Technician</label><select className="form-select" value={form.tech} onChange={e=>setForm(f=>({...f,tech:e.target.value}))}>{TECHS.map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="form-field" style={{marginBottom:14}}>
              <label className="form-label">Service Description</label>
              <input className="form-input" value={form.service} onChange={e=>setForm(f=>({...f,service:e.target.value}))} placeholder="e.g. Oil change + Health check"/>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(null)}><IconClose/>Cancel</button>
              <button className="btn btn-primary" onClick={saveBooking}><IconCheck/>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Part Modal */}
      {(modal==='add-p'||(modal&&modal.sku!==undefined))&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">{modal==='add-p'?'📦 Add Part':'✏️ Edit Part'}</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Part Name</label><input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">SKU</label><input className="form-input" value={form.sku} onChange={e=>setForm(f=>({...f,sku:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Make / Fitment</label><input className="form-input" value={form.make} onChange={e=>setForm(f=>({...f,make:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Unit Cost ($)</label><input className="form-input" type="number" value={form.unitCost} onChange={e=>setForm(f=>({...f,unitCost:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Current Stock</label><input className="form-input" type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Reorder At</label><input className="form-input" type="number" value={form.reorderAt} onChange={e=>setForm(f=>({...f,reorderAt:e.target.value}))}/></div>
            </div>
            <div style={{padding:'10px 0',display:'flex',alignItems:'center',gap:10}}>
              <input type="checkbox" id="ao" checked={!!form.autoOrder} onChange={e=>setForm(f=>({...f,autoOrder:e.target.checked}))} style={{width:16,height:16,cursor:'pointer'}}/>
              <label htmlFor="ao" style={{fontSize:13,cursor:'pointer'}}>Enable Auto-Order when below reorder threshold</label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(null)}><IconClose/>Cancel</button>
              <button className="btn btn-primary" onClick={savePart}><IconCheck/>Save Part</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
