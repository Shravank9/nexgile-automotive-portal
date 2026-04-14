import { useState } from 'react';
import { vehicles as INIT } from '../data/staticData';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconClose, IconCheck } from '../components/Icons';
import Toast from '../components/Toast';

const STATUS_TAG = {
  'Available':'tag-green','Deal in Progress':'tag-orange',
  'On Hold':'tag-red','Reconditioning':'tag-gray','In-Transit':'tag-blue','Delivered':'tag-green'
};
const TYPES=['All','New','Used CPO'];
const CATS=['All','Sedan','SUV','EV','Hatch','Luxury'];
const STATUSES=['All','Available','Deal in Progress','On Hold','Reconditioning','In-Transit'];
const EMPTY={ make:'',model:'',year:new Date().getFullYear(),type:'New',category:'SUV',price:'',marketPrice:'',color:'',status:'Available',mileage:0,vin:'' };

export default function Inventory() {
  const [data,    setData]   = useState(INIT);
  const [search,  setSearch] = useState('');
  const [typeTab, setType]   = useState('All');
  const [catTab,  setCat]    = useState('All');
  const [statTab, setStat]   = useState('All');
  const [sortBy,  setSort]   = useState('daysOnLot');
  const [sortDir, setSortDir]= useState('desc');
  const [modal,   setModal]  = useState(null);
  const [form,    setForm]   = useState(EMPTY);
  const [toast,   setToast]  = useState(null);
  const [confirm, setConfirm]= useState(null);
  const [view,    setView]   = useState('table'); // 'table' | 'grid'
  const [detailV, setDetail] = useState(null);   // vehicle detail panel

  // ── FILTER + SORT ──
  const filtered = data
    .filter(v => {
      const q = search.toLowerCase();
      const mQ = !q || `${v.make} ${v.model} ${v.year} ${v.vin} ${v.color}`.toLowerCase().includes(q);
      const mT = typeTab==='All' || v.type===typeTab;
      const mC = catTab==='All'  || v.category===catTab;
      const mS = statTab==='All' || v.status===statTab;
      return mQ&&mT&&mC&&mS;
    })
    .sort((a,b) => {
      let av=a[sortBy]??0, bv=b[sortBy]??0;
      if(typeof av==='string') av=av.toLowerCase(), bv=bv.toLowerCase();
      return sortDir==='asc' ? (av>bv?1:-1) : (av<bv?1:-1);
    });

  function toggleSort(col){ if(sortBy===col) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSort(col); setSortDir('asc'); } }

  function openAdd()  { setForm(EMPTY); setModal('add'); }
  function openEdit(v){ setForm({...v,price:v.price.toString(),marketPrice:v.marketPrice.toString()}); setModal(v); }

  function handleSave() {
    if (!form.make||!form.model||!form.price) { setToast({msg:'Fill Make, Model & Price',color:'var(--red)'}); return; }
    const entry = {
      ...form, id: modal==='add' ? Date.now() : modal.id,
      price: parseFloat(form.price), marketPrice: parseFloat(form.marketPrice)||0,
      margin: (((parseFloat(form.price)-(parseFloat(form.marketPrice)||parseFloat(form.price)))/parseFloat(form.price))*100).toFixed(1),
      image:'🚗', daysOnLot: modal==='add' ? 0 : modal.daysOnLot
    };
    if(modal==='add'){ setData(d=>[...d,entry]); setToast({msg:'Vehicle added!',color:'var(--green)'}); }
    else             { setData(d=>d.map(v=>v.id===entry.id?entry:v)); setToast({msg:'Vehicle updated.',color:'var(--blue)'}); }
    setModal(null);
  }

  function handleDelete(id){ setData(d=>d.filter(v=>v.id!==id)); setConfirm(null); setToast({msg:'Vehicle removed.',color:'var(--red)'}); }

  const SortIcon = ({col}) => <span style={{marginLeft:4,color:sortBy===col?'var(--accent)':'var(--muted)',fontSize:10}}>{sortBy===col?(sortDir==='asc'?'▲':'▼'):'⇅'}</span>;

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Vehicle Inventory</div>
          <div className="page-sub">Real-time sync · Factory order to delivery · {data.length} total vehicles</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" style={{padding:'8px 12px'}} onClick={()=>setView(v=>v==='table'?'grid':'table')}>
            {view==='table'?'⊞ Grid':'☰ Table'}
          </button>
          <button className="btn btn-primary" onClick={openAdd}><IconPlus/>Add Vehicle</button>
        </div>
      </div>

      {/* KPI summary strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20}}>
        {[
          {l:'Total',          v:data.length,                                          c:'c-blue',   click:()=>setStat('All')},
          {l:'Available',      v:data.filter(v=>v.status==='Available').length,        c:'c-green',  click:()=>setStat('Available')},
          {l:'Deal in Progress',v:data.filter(v=>v.status==='Deal in Progress').length,c:'c-orange', click:()=>setStat('Deal in Progress')},
          {l:'Reconditioning', v:data.filter(v=>v.status==='Reconditioning').length,   c:'c-red',    click:()=>setStat('Reconditioning')},
          {l:'In-Transit',     v:data.filter(v=>v.status==='In-Transit').length,       c:'c-purple', click:()=>setStat('In-Transit')},
        ].map(k=>(
          <div key={k.l} className={`kpi-card ${k.c}`} onClick={k.click} style={{cursor:'pointer',padding:'14px 16px'}}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{fontSize:24,marginTop:6}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:'14px 16px',marginBottom:18}}>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
          {/* Search */}
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'7px 12px',flex:'1',minWidth:200}}>
            <IconSearch/>
            <input style={{background:'none',border:'none',outline:'none',color:'var(--text)',fontFamily:'var(--dm)',fontSize:13,flex:1}} placeholder="Search make, model, VIN, color…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<span style={{cursor:'pointer',color:'var(--muted)',fontSize:16}} onClick={()=>setSearch('')}>×</span>}
          </div>

          {/* Type filter */}
          <div style={{display:'flex',gap:4}}>
            {TYPES.map(t=><button key={t} className={`tab-btn${typeTab===t?' active':''}`} onClick={()=>setType(t)} style={{padding:'6px 12px',fontSize:12}}>{t}</button>)}
          </div>

          {/* Category filter */}
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {CATS.map(c=><button key={c} className={`tab-btn${catTab===c?' active':''}`} onClick={()=>setCat(c)} style={{padding:'6px 10px',fontSize:12}}>{c}</button>)}
          </div>

          {/* Status filter */}
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {STATUSES.map(s=><button key={s} className={`tab-btn${statTab===s?' active':''}`} onClick={()=>setStat(s)} style={{padding:'6px 10px',fontSize:12}}>{s}</button>)}
          </div>

          {/* Sort */}
          <select className="form-select" value={sortBy} onChange={e=>setSort(e.target.value)} style={{padding:'7px 10px',fontSize:12,minWidth:130}}>
            <option value="daysOnLot">Sort: Days on Lot</option>
            <option value="price">Sort: Price</option>
            <option value="margin">Sort: Margin</option>
            <option value="make">Sort: Make</option>
          </select>
          <button className="btn btn-outline" onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')} style={{padding:'7px 10px',fontSize:12}}>
            {sortDir==='asc'?'↑ Asc':'↓ Desc'}
          </button>

          {(search||typeTab!=='All'||catTab!=='All'||statTab!=='All')&&(
            <button className="btn btn-outline" style={{padding:'6px 10px',fontSize:11,color:'var(--red)'}} onClick={()=>{setSearch('');setType('All');setCat('All');setStat('All');}}>
              ✕ Clear Filters
            </button>
          )}
        </div>
        <div style={{marginTop:8,fontSize:12,color:'var(--muted)'}}>
          Showing <strong style={{color:'var(--text)'}}>{filtered.length}</strong> of {data.length} vehicles
        </div>
      </div>

      {/* INVENTORY ANALYTICS BAR */}
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:'14px 20px',marginBottom:18,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
        {[
          {l:'Avg Days on Lot',  v: Math.round(data.filter(v=>v.daysOnLot>0).reduce((s,v)=>s+v.daysOnLot,0)/Math.max(1,data.filter(v=>v.daysOnLot>0).length))+'d', sub:'Turn rate', c:'var(--accent)'},
          {l:'Avg Margin',       v: (data.reduce((s,v)=>s+parseFloat(v.margin||0),0)/data.length).toFixed(1)+'%',      sub:'Gross profit', c:'var(--green)'},
          {l:'Total Value',      v: '$'+Math.round(data.reduce((s,v)=>s+v.price,0)/1000)+'K',                          sub:'Inventory value',c:'var(--blue)'},
          {l:'Market Days Supply',v:'24d',                                                                              sub:'vs industry 30d', c:'var(--purple)'},
        ].map(s=>(
          <div key={s.l} style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:22,color:s.c}}>{s.v}</div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text)',marginTop:2}}>{s.l}</div>
            <div style={{fontSize:10,color:'var(--muted)'}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TABLE VIEW */}
      {view==='table' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Live Inventory</div>
            <div style={{fontSize:12,color:'var(--muted)'}}>{filtered.length} vehicles — click row to view details</div>
          </div>
          {filtered.length===0
            ? <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>
                <div style={{fontSize:32,marginBottom:8}}>🚗</div>
                No vehicles match your filters.{' '}
                <span style={{color:'var(--accent)',cursor:'pointer'}} onClick={()=>{setSearch('');setType('All');setCat('All');setStat('All');}}>Clear filters</span>
              </div>
            : <div style={{overflowX:'auto'}}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th style={{cursor:'pointer'}} onClick={()=>toggleSort('type')}>Type <SortIcon col="type"/></th>
                      <th>Category</th>
                      <th>Mileage</th>
                      <th style={{cursor:'pointer'}} onClick={()=>toggleSort('price')}>Price <SortIcon col="price"/></th>
                      <th>Market Price</th>
                      <th style={{cursor:'pointer'}} onClick={()=>toggleSort('margin')}>Margin <SortIcon col="margin"/></th>
                      <th style={{cursor:'pointer'}} onClick={()=>toggleSort('daysOnLot')}>Days on Lot <SortIcon col="daysOnLot"/></th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(v=>(
                      <tr key={v.id} style={{cursor:'pointer'}} onClick={()=>setDetail(v)}>
                        <td>
                          <div className="vehicle-cell">
                            <div className="vehicle-thumb">{v.image}</div>
                            <div>
                              <div className="v-name">{v.year} {v.make} {v.model}</div>
                              <div className="v-vin">{v.vin}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`tag ${v.type==='New'?'tag-blue':'tag-orange'}`}>{v.type}</span></td>
                        <td style={{fontSize:12,color:'var(--muted2)'}}>{v.category}</td>
                        <td style={{fontSize:12}}>{v.mileage>0?v.mileage.toLocaleString()+' km':'New'}</td>
                        <td style={{fontFamily:'var(--syne)',fontWeight:700}}>${v.price.toLocaleString()}</td>
                        <td style={{color:'var(--muted)',fontSize:12}}>${v.marketPrice.toLocaleString()}</td>
                        <td style={{fontWeight:600,color:parseFloat(v.margin)>7?'var(--green)':parseFloat(v.margin)>5?'var(--accent)':'var(--red)'}}>{v.margin}%</td>
                        <td style={{color:v.daysOnLot>30?'var(--red)':v.daysOnLot>15?'var(--accent)':'var(--muted2)',fontSize:13}}>{v.daysOnLot>0?v.daysOnLot+'d':'Today'}</td>
                        <td><span className={`tag ${STATUS_TAG[v.status]||'tag-gray'}`}>{v.status}</span></td>
                        <td onClick={e=>e.stopPropagation()}>
                          <div style={{display:'flex',gap:6}}>
                            <button className="btn btn-outline btn-sm" onClick={()=>openEdit(v)}><IconEdit/></button>
                            <button className="btn btn-sm" style={{background:'rgba(239,68,68,0.1)',color:'var(--red)',border:'1px solid rgba(239,68,68,0.2)'}} onClick={()=>setConfirm(v.id)}><IconTrash/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {/* GRID VIEW */}
      {view==='grid' && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
          {filtered.length===0
            ? <div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'var(--muted)'}}>No vehicles match your filters.</div>
            : filtered.map(v=>(
              <div key={v.id} className="card" style={{cursor:'pointer'}} onClick={()=>setDetail(v)}>
                <div style={{padding:'18px 18px 12px',background:'linear-gradient(135deg,#1e2535,#2a3248)',borderRadius:'12px 12px 0 0',textAlign:'center',fontSize:42}}>{v.image}</div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,marginBottom:4}}>{v.year} {v.make} {v.model}</div>
                  <div style={{fontSize:11,color:'var(--muted)',fontFamily:'monospace',marginBottom:10}}>{v.vin}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <span style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:18,color:'var(--accent)'}}>${v.price.toLocaleString()}</span>
                    <span className={`tag ${STATUS_TAG[v.status]||'tag-gray'}`} style={{fontSize:10}}>{v.status}</span>
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                    <span className={`tag ${v.type==='New'?'tag-blue':'tag-orange'}`} style={{fontSize:10}}>{v.type}</span>
                    <span className="tag tag-gray" style={{fontSize:10}}>{v.category}</span>
                    <span className="tag tag-gray" style={{fontSize:10}}>{v.daysOnLot>0?v.daysOnLot+'d on lot':'Today'}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{fontSize:11,color:'var(--muted)'}}>Margin: <span style={{fontWeight:700,color:parseFloat(v.margin)>7?'var(--green)':'var(--accent)'}}>{v.margin}%</span></div>
                    <div style={{fontSize:11,color:'var(--muted)'}}>{v.mileage>0?v.mileage.toLocaleString()+' km':'0 km'}</div>
                  </div>
                  <div style={{display:'flex',gap:6,marginTop:10}} onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-outline btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>openEdit(v)}><IconEdit/>Edit</button>
                    <button className="btn btn-sm" style={{background:'rgba(239,68,68,0.1)',color:'var(--red)',border:'1px solid rgba(239,68,68,0.2)'}} onClick={()=>setConfirm(v.id)}><IconTrash/></button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* ── VEHICLE DETAIL PANEL ── */}
      {detailV && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetail(null)}>
          <div className="modal-box" style={{maxWidth:560}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <div>
                <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:18,color:'#fff'}}>{detailV.year} {detailV.make} {detailV.model}</div>
                <div style={{fontSize:11,color:'var(--muted)',fontFamily:'monospace',marginTop:2}}>VIN: {detailV.vin}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={()=>setDetail(null)}><IconClose/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
              {[
                ['Status',       detailV.status],
                ['Type',         detailV.type],
                ['Category',     detailV.category],
                ['Color',        detailV.color],
                ['Mileage',      detailV.mileage>0?detailV.mileage.toLocaleString()+' km':'New'],
                ['Days on Lot',  detailV.daysOnLot>0?detailV.daysOnLot+' days':'Arrived today'],
                ['Sticker Price','$'+detailV.price.toLocaleString()],
                ['Market Price', '$'+detailV.marketPrice.toLocaleString()],
                ['Gross Margin', detailV.margin+'%'],
                ['Est. Profit',  '$'+Math.round(detailV.price*parseFloat(detailV.margin)/100).toLocaleString()],
              ].map(([l,v])=>(
                <div key={l} style={{background:'var(--bg3)',borderRadius:8,padding:'10px 12px'}}>
                  <div style={{fontSize:10,color:'var(--muted)',marginBottom:3,textTransform:'uppercase',letterSpacing:.8}}>{l}</div>
                  <div style={{fontFamily:'var(--syne)',fontWeight:600,fontSize:14}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>{setDetail(null);openEdit(detailV);}}><IconEdit/>Edit Vehicle</button>
              <button className="btn btn-primary" onClick={()=>setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal!==null&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">{modal==='add'?'🚗 Add New Vehicle':'✏️ Edit Vehicle'}</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>setForm(f=>({...f,make:e.target.value}))} placeholder="Toyota"/></div>
              <div className="form-field"><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>setForm(f=>({...f,model:e.target.value}))} placeholder="Camry XSE"/></div>
              <div className="form-field"><label className="form-label">Year</label><input className="form-input" type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">VIN</label><input className="form-input" value={form.vin} onChange={e=>setForm(f=>({...f,vin:e.target.value}))} placeholder="JTXXX…"/></div>
              <div className="form-field"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option>New</option><option>Used CPO</option></select></div>
              <div className="form-field"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{['Sedan','SUV','EV','Hatch','Luxury'].map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Sticker Price ($) *</label><input className="form-input" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Market Price ($)</label><input className="form-input" type="number" value={form.marketPrice} onChange={e=>setForm(f=>({...f,marketPrice:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{['Available','Deal in Progress','On Hold','Reconditioning','In-Transit'].map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(null)}><IconClose/>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><IconCheck/>Save Vehicle</button>
            </div>
          </div>
        </div>
      )}

      {confirm&&(
        <div className="modal-overlay" onClick={()=>setConfirm(null)}>
          <div className="modal-box" style={{maxWidth:340,textAlign:'center'}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑️</div>
            <div className="modal-title" style={{justifyContent:'center',fontSize:16}}>Delete Vehicle?</div>
            <p style={{color:'var(--muted)',fontSize:13,margin:'8px 0 20px'}}>This cannot be undone.</p>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button className="btn btn-outline" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="btn" style={{background:'var(--red)',color:'#fff'}} onClick={()=>handleDelete(confirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
