import { useState } from 'react';
import { leads as INIT } from '../data/staticData';
import { IconPlus, IconSearch, IconEdit, IconClose, IconCheck, IconArrowUp } from '../components/Icons';
import Toast from '../components/Toast';

const STATUS_CFG = {
  'Hot Lead':       {tag:'tag-red',    dot:'var(--red)'   },
  'Qualified':      {tag:'tag-blue',   dot:'var(--blue)'  },
  'New':            {tag:'tag-gray',   dot:'var(--muted)' },
  'Follow-up Due':  {tag:'tag-orange', dot:'var(--accent)'},
  'Negotiating':    {tag:'tag-purple', dot:'var(--purple)'},
  'Contacted':      {tag:'tag-blue',   dot:'var(--blue)'  },
  'Closed Won':     {tag:'tag-green',  dot:'var(--green)' },
  'Closed Lost':    {tag:'tag-gray',   dot:'var(--muted)' },
};
const SOURCES=['All','Web','Autotrader','Phone','Walk-in'];
const SOURCE_TAG={Web:'tag-blue',Autotrader:'tag-green',Phone:'tag-orange','Walk-in':'tag-gray'};
const AVATARS=['#e8a020','#3b82f6','#22c55e','#a855f7','#ef4444','#f59e0b','#06b6d4','#ec4899'];
const EMPTY={name:'',phone:'',email:'',interest:'',source:'Web',status:'New',assignedTo:'',budget:'',notes:''};

export default function Leads() {
  const [data,    setData]   = useState(INIT);
  const [search,  setSearch] = useState('');
  const [statTab, setStat]   = useState('All');
  const [srcTab,  setSrc]    = useState('All');
  const [modal,   setModal]  = useState(null);
  const [form,    setForm]   = useState(EMPTY);
  const [detail,  setDetail] = useState(null);
  const [toast,   setToast]  = useState(null);

  const STATUSES=['All',...Object.keys(STATUS_CFG)];

  const filtered = data.filter(l=>{
    const q=search.toLowerCase();
    const mQ=!q||`${l.name} ${l.phone} ${l.email} ${l.interest} ${l.notes}`.toLowerCase().includes(q);
    const mS=statTab==='All'||l.status===statTab;
    const mR=srcTab==='All'||l.source===srcTab;
    return mQ&&mS&&mR;
  });

  const counts=Object.fromEntries(Object.keys(STATUS_CFG).map(s=>[s,data.filter(l=>l.status===s).length]));

  function openAdd()  { setForm(EMPTY); setModal('add'); }
  function openEdit(l){ setForm({...l}); setModal(l); }

  function handleSave(){
    if(!form.name||!form.phone){ setToast({msg:'Name & Phone required',color:'var(--red)'}); return; }
    if(modal==='add'){ setData(d=>[...d,{...form,id:Date.now(),lastContact:'Just now'}]); setToast({msg:'Lead added!',color:'var(--green)'}); }
    else             { setData(d=>d.map(l=>l.id===modal.id?{...form,id:modal.id}:l));     setToast({msg:'Lead updated.',color:'var(--blue)'}); }
    setModal(null);
  }

  function updateStatus(id,status){
    setData(d=>d.map(l=>l.id===id?{...l,status}:l));
    setToast({msg:`Status → ${status}`,color:STATUS_CFG[status]?.dot||'var(--accent)'});
  }

  function scheduleFollowUp(id){
    setData(d=>d.map(l=>l.id===id?{...l,lastContact:'Just now'}:l));
    setToast({msg:'✅ Follow-up task created!',color:'var(--green)'});
  }

  function routeLead(id,rep){
    setData(d=>d.map(l=>l.id===id?{...l,assignedTo:rep}:l));
    setToast({msg:`Lead routed to ${rep}`,color:'var(--blue)'});
  }

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Lead Management</div>
          <div className="page-sub">Omnichannel pipeline · Web · Autotrader · Phone · Walk-in · Auto follow-up</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd}><IconPlus/>New Lead</button>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid" style={{marginBottom:20}}>
        {[
          {l:'Total Leads',        v:data.length,                         c:'c-blue'},
          {l:'Hot Leads',          v:counts['Hot Lead']||0,               c:'c-red'},
          {l:'Follow-up Due',      v:counts['Follow-up Due']||0,          c:'c-orange'},
          {l:'Closed Won (Month)', v:counts['Closed Won']||0,             c:'c-green'},
        ].map(k=>(
          <div key={k.l} className={`kpi-card ${k.c}`} style={{cursor:'pointer'}} onClick={()=>setStat(k.l.includes('Total')?'All':k.l.includes('Hot')?'Hot Lead':k.l.includes('Follow')?'Follow-up Due':'Closed Won')}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{fontSize:28,marginTop:10}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Source Tabs + Status Tabs */}
      <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:12}}>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          <div style={{fontSize:10,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,fontWeight:600}}>By Source</div>
          <div className="tab-bar" style={{marginBottom:0}}>
            {SOURCES.map(s=>(
              <button key={s} className={`tab-btn${srcTab===s?' active':''}`} onClick={()=>setSrc(s)} style={{padding:'5px 10px',fontSize:12}}>
                {s} {s!=='All'?`(${data.filter(l=>l.source===s).length})`:``}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tab-bar" style={{marginBottom:12,flexWrap:'wrap'}}>
        {STATUSES.map(s=>(
          <button key={s} className={`tab-btn${statTab===s?' active':''}`} onClick={()=>setStat(s)} style={{padding:'6px 12px',fontSize:12}}>
            {s}{s!=='All'&&counts[s]?` (${counts[s]})`:s==='All'?` (${data.length})`:''}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:9,padding:'8px 14px',marginBottom:16,maxWidth:380}}>
        <IconSearch/>
        <input style={{background:'none',border:'none',outline:'none',color:'var(--text)',fontFamily:'var(--dm)',fontSize:13,flex:1}} placeholder="Search name, phone, interest…" value={search} onChange={e=>setSearch(e.target.value)}/>
        {search&&<span style={{cursor:'pointer',color:'var(--muted)',fontSize:16}} onClick={()=>setSearch('')}>×</span>}
      </div>

      {/* Auto follow-up alert */}
      {counts['Follow-up Due']>0&&(
        <div style={{background:'rgba(10,102,194,0.06)',border:'1px solid rgba(10,102,194,0.2)',borderRadius:10,padding:'10px 16px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:13}}>
          <span>⚠️ <strong>{counts['Follow-up Due']} leads</strong> have overdue follow-ups</span>
          <button className="btn btn-primary btn-sm" onClick={()=>{data.filter(l=>l.status==='Follow-up Due').forEach(l=>scheduleFollowUp(l.id)); setToast({msg:'All follow-ups scheduled!',color:'var(--green)'}); }}>
            Auto-Schedule All
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Lead Pipeline</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>{filtered.length} leads shown</div>
        </div>
        {filtered.length===0
          ? <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>No leads match your filters.</div>
          : <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead><tr><th>Customer</th><th>Interest</th><th>Source</th><th>Budget</th><th>Assigned To</th><th>Last Contact</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map((l,i)=>(
                    <tr key={l.id} style={{cursor:'pointer'}} onClick={()=>setDetail(l)}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:34,height:34,borderRadius:'50%',background:AVATARS[i%AVATARS.length],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font)',fontWeight:700,fontSize:12,color:'#000',flexShrink:0}}>
                            {l.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div style={{fontSize:13,fontWeight:500}}>{l.name}</div>
                            <div style={{fontSize:11,color:'var(--muted)'}}>{l.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{fontSize:12,maxWidth:160}}>{l.interest}</td>
                      <td><span className={`tag ${SOURCE_TAG[l.source]||'tag-gray'}`}>{l.source}</span></td>
                      <td style={{fontFamily:'var(--font)',fontWeight:600,fontSize:13}}>{l.budget}</td>
                      <td style={{fontSize:12,color:'var(--muted2)'}}>{l.assignedTo||'—'}</td>
                      <td style={{fontSize:11,color:'var(--muted)'}}>{l.lastContact}</td>
                      <td onClick={e=>e.stopPropagation()}>
                        <select className="form-select" value={l.status} onChange={e=>updateStatus(l.id,e.target.value)} style={{padding:'4px 8px',fontSize:11,borderRadius:6,color:STATUS_CFG[l.status]?.dot||'var(--text)',background:'var(--bg3)',border:'1px solid var(--border)'}}>
                          {Object.keys(STATUS_CFG).map(s=><option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td onClick={e=>e.stopPropagation()}>
                        <div style={{display:'flex',gap:4}}>
                          <button className="btn btn-outline btn-sm" title="Schedule Follow-up" onClick={()=>scheduleFollowUp(l.id)}>📅</button>
                          <button className="btn btn-outline btn-sm" onClick={()=>openEdit(l)}><IconEdit/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

      {/* Detail panel */}
      {detail&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetail(null)}>
          <div className="modal-box" style={{maxWidth:480}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:AVATARS[data.findIndex(l=>l.id===detail.id)%AVATARS.length],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font)',fontWeight:800,fontSize:16,color:'#000',flexShrink:0}}>
                {detail.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--font)',fontWeight:800,fontSize:18}}>{detail.name}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>{detail.phone} · {detail.email}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={()=>setDetail(null)}><IconClose/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
              {[['Interest',detail.interest],['Budget',detail.budget],['Source',detail.source],['Status',detail.status],['Assigned To',detail.assignedTo||'Unassigned'],['Last Contact',detail.lastContact]].map(([l,v])=>(
                <div key={l} style={{background:'var(--bg3)',borderRadius:8,padding:'9px 12px'}}>
                  <div style={{fontSize:10,color:'var(--muted)',marginBottom:2,textTransform:'uppercase',letterSpacing:.8}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:500}}>{v}</div>
                </div>
              ))}
            </div>
            {detail.notes&&<div style={{background:'var(--bg3)',borderRadius:8,padding:'10px 12px',marginBottom:16,fontSize:13,color:'var(--muted2)',fontStyle:'italic'}}>📝 {detail.notes}</div>}
            {/* Route lead */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>Route Lead To</div>
              <div style={{display:'flex',gap:6}}>
                {['Kiran S.','Raj P.','Anita R.','Deepak M.'].map(rep=>(
                  <button key={rep} className={`btn btn-sm ${detail.assignedTo===rep?'btn-primary':'btn-outline'}`} onClick={()=>{routeLead(detail.id,rep);setDetail({...detail,assignedTo:rep});}}>
                    {rep}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}} onClick={()=>{scheduleFollowUp(detail.id);setDetail(null);}}>📅 Schedule Follow-up</button>
              <button className="btn btn-outline" onClick={()=>{setDetail(null);openEdit(detail);}}><IconEdit/>Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal!==null&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">{modal==='add'?'👤 Add New Lead':'✏️ Edit Lead'}</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Arjun Mehta"/></div>
              <div className="form-field"><label className="form-label">Phone *</label><input className="form-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+91 98765…"/></div>
              <div className="form-field"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Vehicle Interest</label><input className="form-input" value={form.interest} onChange={e=>setForm(f=>({...f,interest:e.target.value}))} placeholder="2024 Toyota Camry"/></div>
              <div className="form-field"><label className="form-label">Source</label><select className="form-select" value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))}>{['Web','Autotrader','Phone','Walk-in'].map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{Object.keys(STATUS_CFG).map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Assigned To</label><select className="form-select" value={form.assignedTo} onChange={e=>setForm(f=>({...f,assignedTo:e.target.value}))}><option value="">Unassigned</option>{['Kiran S.','Raj P.','Anita R.','Deepak M.'].map(r=><option key={r}>{r}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Budget</label><input className="form-input" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} placeholder="$35,000"/></div>
            </div>
            <div className="form-field" style={{marginBottom:14}}>
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={3} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{resize:'vertical'}}/>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(null)}><IconClose/>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><IconCheck/>Save Lead</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
