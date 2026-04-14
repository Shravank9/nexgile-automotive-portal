import { useState } from 'react';
import { IconPlus, IconCheck, IconClose, IconEye } from '../components/Icons';
import Toast from '../components/Toast';

const INIT_APPS = [
  { id:1, customer:'Arjun Mehta',  vehicle:'2024 Toyota Camry XSE',  amount:28600, lender:'HDFC Bank',     rate:7.2, term:60, status:'Approved',    score:780, docs:['Contract','GAP Waiver','Service Contract'], signed:['Contract'] },
  { id:2, customer:'Priya Sharma', vehicle:'2024 Ford Explorer ST',   amount:36900, lender:'ICICI Bank',    rate:6.9, term:48, status:'Conditional', score:710, docs:['Contract','GAP Waiver','Tire Protection'],   signed:[] },
  { id:3, customer:'Rahul Verma',  vehicle:'2023 BMW 530i xDrive',    amount:49200, lender:'BMW Financial', rate:5.9, term:60, status:'Approved',    score:820, docs:['Contract','GAP Waiver','Service Contract','Paint Protection'], signed:['Contract','GAP Waiver'] },
  { id:4, customer:'Sneha Patel',  vehicle:'2024 Honda CR-V Hybrid',  amount:32750, lender:'SBI Motors',    rate:null,term:60, status:'Pending',     score:660, docs:['Contract'], signed:[] },
  { id:5, customer:'Kavya Nair',   vehicle:'2024 Kia Seltos HTX',     amount:20000, lender:'Kotak Mahindra',rate:8.1, term:48, status:'Delivered',   score:740, docs:['Contract','GAP Waiver'], signed:['Contract','GAP Waiver'] },
];

const PRODUCTS = [
  { id:'gap',    name:'GAP Waiver',       emoji:'🛡️', desc:'Covers difference between insurance payout and loan balance', price:595,  popular:true  },
  { id:'svc',    name:'Service Contract', emoji:'🔧', desc:'Extended coverage up to 5 years / 100,000 km',               price:1495, popular:true  },
  { id:'tire',   name:'Tire & Wheel',     emoji:'🛞', desc:'Covers flat tires and rim damage',                            price:395,  popular:false },
  { id:'paint',  name:'Paint Protection', emoji:'🎨', desc:'Protects against chips, scratches and UV fading',            price:695,  popular:false },
  { id:'key',    name:'Key Replacement',  emoji:'🔑', desc:'Lost or damaged key fob replacement',                        price:295,  popular:false },
  { id:'credit', name:'Credit Insurance', emoji:'💳', desc:'Covers payments in case of disability or job loss',          price:895,  popular:false },
];

const STATUS_TAGS = { Approved:'tag-green', Conditional:'tag-orange', Pending:'tag-red', Delivered:'tag-blue' };
const LENDERS = ['HDFC Bank','ICICI Bank','BMW Financial','SBI Motors','Kotak Mahindra','Axis Bank','Bajaj Finance'];

export default function FI() {
  const [apps,    setApps]   = useState(INIT_APPS);
  const [prods,   setProds]  = useState(PRODUCTS.map(p=>({...p,sel:false})));
  const [tab,     setTab]    = useState('applications');
  const [sel,     setSel]    = useState(null);
  const [modal,   setModal]  = useState(false);
  const [form,    setForm]   = useState({ customer:'', vehicle:'', amount:'', lender:'HDFC Bank', rate:'', term:'60' });
  const [toast,   setToast]  = useState(null);

  const selApp = apps.find(a=>a.id===sel);

  function signDoc(appId, doc) {
    setApps(a=>a.map(x=>x.id===appId?{...x,signed:[...new Set([...x.signed,doc])]}:x));
    setToast({ msg:`"${doc}" e-signed!`, color:'var(--green)' });
  }

  function updateStatus(id, status) {
    setApps(a=>a.map(x=>x.id===id?{...x,status}:x));
    setToast({ msg:`Status → ${status}`, color:'var(--accent)' });
  }

  function saveApp() {
    if (!form.customer||!form.vehicle) return;
    setApps(a=>[...a,{ ...form,id:Date.now(),amount:parseFloat(form.amount)||0,rate:parseFloat(form.rate)||null,term:parseInt(form.term)||60,status:'Pending',score:Math.floor(Math.random()*200+600),docs:['Contract'],signed:[] }]);
    setModal(false); setToast({ msg:'Application added!', color:'var(--green)' });
  }

  const esignPending = apps.flatMap(a=>a.docs.filter(d=>!a.signed.includes(d)).map(d=>({...a,doc:d})));
  const approvalRate = Math.round(apps.filter(a=>['Approved','Delivered'].includes(a.status)).length/apps.length*100);
  const selectedTotal = prods.filter(p=>p.sel).reduce((s,p)=>s+p.price,0);

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">F&amp;I Integration</div>
          <div className="page-sub">Digital credit decisioning · Product menu · Electronic document signing</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={()=>setModal(true)}><IconPlus />New Application</button>
        </div>
      </div>

      <div className="kpi-grid mb-24">
        {[
          { l:'Applications',  v:apps.length,                                                                  c:'c-blue'   },
          { l:'Approved',      v:apps.filter(a=>['Approved','Delivered'].includes(a.status)).length,           c:'c-green'  },
          { l:'Approval Rate', v:approvalRate+'%',                                                             c:'c-orange' },
          { l:'E-Sign Pending',v:esignPending.filter(e=>apps.find(a=>a.id===e.id)?.status==='Approved').length,c:'c-red'    },
        ].map(k=>(
          <div key={k.l} className={`kpi-card ${k.c}`}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{fontSize:28,marginTop:10}}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar">
        {[['applications','📋 Applications'],['products','🛍️ Product Menu'],['esign','✍️ E-Sign Queue']].map(([k,l])=>(
          <button key={k} className={`tab-btn${tab===k?' active':''}`} onClick={()=>setTab(k)}>{l}
            {k==='esign'&&esignPending.length>0&&<span className="nav-badge" style={{marginLeft:6}}>{esignPending.filter(e=>apps.find(a=>a.id===e.id)?.status==='Approved').length}</span>}
          </button>
        ))}
      </div>

      {/* APPLICATIONS */}
      {tab==='applications' && (
        <div style={{display:'grid',gridTemplateColumns:sel?'1fr 340px':'1fr',gap:20}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Credit Applications</div></div>
            <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead><tr><th>Customer</th><th>Vehicle</th><th>Amount</th><th>Lender</th><th>Score</th><th>Status</th><th>View</th></tr></thead>
                <tbody>
                  {apps.map(a=>(
                    <tr key={a.id} style={{cursor:'pointer',background:sel===a.id?'rgba(232,160,32,0.04)':''}}>
                      <td style={{fontWeight:500}}>{a.customer}</td>
                      <td style={{fontSize:12,color:'var(--muted2)'}}>{a.vehicle}</td>
                      <td style={{fontFamily:'var(--syne)',fontWeight:700}}>${a.amount.toLocaleString()}</td>
                      <td style={{fontSize:12}}>{a.lender}</td>
                      <td>
                        <span style={{fontFamily:'var(--syne)',fontWeight:700,color:a.score>=750?'var(--green)':a.score>=680?'var(--accent)':'var(--red)'}}>{a.score}</span>
                      </td>
                      <td>
                        <select className="form-select" value={a.status}
                          onChange={e=>updateStatus(a.id,e.target.value)}
                          style={{padding:'4px 8px',fontSize:11,borderRadius:6}}>
                          {Object.keys(STATUS_TAGS).map(s=><option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={()=>setSel(sel===a.id?null:a.id)}><IconEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selApp && (
            <div className="card" style={{height:'fit-content',position:'sticky',top:80}}>
              <div className="card-header">
                <div><div className="card-title">{selApp.customer}</div><div className="card-sub">{selApp.vehicle}</div></div>
                <button className="btn btn-outline btn-sm" onClick={()=>setSel(null)}><IconClose /></button>
              </div>
              <div className="card-body">
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:18}}>
                  {[['Amount','$'+selApp.amount.toLocaleString()],['Lender',selApp.lender],['Rate',selApp.rate?selApp.rate+'%':'TBD'],['Term',selApp.term+'mo']].map(([l,v])=>(
                    <div key={l} style={{background:'var(--bg3)',borderRadius:8,padding:'8px 10px'}}>
                      <div style={{fontSize:10,color:'var(--muted)',marginBottom:2,textTransform:'uppercase',letterSpacing:.8}}>{l}</div>
                      <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:13}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1,fontWeight:600,marginBottom:8}}>Documents</div>
                {selApp.docs.map(doc=>{
                  const signed = selApp.signed.includes(doc);
                  return (
                    <div key={doc} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 10px',background:'var(--bg3)',borderRadius:8,marginBottom:6}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span>{signed?'✅':'📄'}</span>
                        <span style={{fontSize:13}}>{doc}</span>
                      </div>
                      {signed
                        ? <span className="tag tag-green" style={{fontSize:10}}>Signed</span>
                        : <button className="btn btn-primary btn-sm" onClick={()=>signDoc(selApp.id,doc)} disabled={selApp.status==='Pending'}>Sign</button>
                      }
                    </div>
                  );
                })}
                <div style={{marginTop:14}}>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{width:`${(selApp.signed.length/selApp.docs.length)*100}%`,background:'var(--green)'}}/>
                  </div>
                  <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>{selApp.signed.length}/{selApp.docs.length} signed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRODUCT MENU */}
      {tab==='products' && (
        <div>
          <div style={{marginBottom:16,padding:'14px 18px',background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:13,fontWeight:500}}>Selected F&I Products</div>
              <div style={{fontSize:11,color:'var(--muted)'}}>{prods.filter(p=>p.sel).length} products selected</div>
            </div>
            <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:24,color:'var(--accent)'}}>${selectedTotal.toLocaleString()}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {prods.map(p=>(
              <div key={p.id} className="card" style={{cursor:'pointer',border:p.sel?'1px solid var(--accent)':'1px solid var(--border)',background:p.sel?'rgba(232,160,32,0.04)':'var(--card)',transition:'all .16s'}}
                onClick={()=>setProds(ps=>ps.map(x=>x.id===p.id?{...x,sel:!x.sel}:x))}>
                <div className="card-body" style={{position:'relative'}}>
                  {p.popular&&<span className="tag tag-orange" style={{position:'absolute',top:0,right:0,fontSize:9}}>Popular</span>}
                  <div style={{fontSize:26,marginBottom:8}}>{p.emoji}</div>
                  <div style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:13,marginBottom:4}}>{p.name}</div>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:12,lineHeight:1.5}}>{p.desc}</div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:16,color:p.sel?'var(--accent)':'var(--text)'}}>${p.price}</span>
                    <div style={{width:22,height:22,borderRadius:'50%',border:'2px solid',borderColor:p.sel?'var(--accent)':'var(--border)',background:p.sel?'var(--accent)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      {p.sel&&<svg width="10" height="10" fill="none" stroke="#000" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:16}}>
            <button className="btn btn-outline" onClick={()=>setProds(ps=>ps.map(p=>({...p,sel:false})))}>Clear All</button>
            <button className="btn btn-primary" onClick={()=>setToast({msg:'Products added to deal!',color:'var(--green)'})}>
              <IconCheck />Add to Deal (${selectedTotal.toLocaleString()})
            </button>
          </div>
        </div>
      )}

      {/* E-SIGN QUEUE */}
      {tab==='esign' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Electronic Signature Queue</div></div>
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>Customer</th><th>Vehicle</th><th>Document</th><th>App Status</th><th>Action</th></tr></thead>
              <tbody>
                {esignPending.length===0
                  ? <tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'var(--green)'}}>✅ All documents signed!</td></tr>
                  : esignPending.map((e,i)=>{
                    const appStatus = apps.find(a=>a.id===e.id)?.status;
                    return (
                      <tr key={i}>
                        <td style={{fontWeight:500}}>{e.customer}</td>
                        <td style={{fontSize:12,color:'var(--muted2)'}}>{e.vehicle}</td>
                        <td><div style={{display:'flex',alignItems:'center',gap:8}}><span>📄</span>{e.doc}</div></td>
                        <td><span className={`tag ${STATUS_TAGS[appStatus]||'tag-gray'}`}>{appStatus}</span></td>
                        <td>
                          <button className="btn btn-primary btn-sm" disabled={appStatus!=='Approved'} onClick={()=>signDoc(e.id,e.doc)}>
                            ✍️ Sign Now
                          </button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal-box">
            <div className="modal-title">📋 New Credit Application</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Customer</label><input className="form-input" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))} /></div>
              <div className="form-field"><label className="form-label">Vehicle</label><input className="form-input" value={form.vehicle} onChange={e=>setForm(f=>({...f,vehicle:e.target.value}))} /></div>
              <div className="form-field"><label className="form-label">Finance Amount ($)</label><input className="form-input" type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} /></div>
              <div className="form-field"><label className="form-label">Lender</label><select className="form-select" value={form.lender} onChange={e=>setForm(f=>({...f,lender:e.target.value}))}>{LENDERS.map(l=><option key={l}>{l}</option>)}</select></div>
              <div className="form-field"><label className="form-label">Rate (%)</label><input className="form-input" type="number" step="0.1" value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))} /></div>
              <div className="form-field"><label className="form-label">Term</label><select className="form-select" value={form.term} onChange={e=>setForm(f=>({...f,term:e.target.value}))}>{[24,36,48,60,72,84].map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(false)}><IconClose />Cancel</button>
              <button className="btn btn-primary" onClick={saveApp}><IconCheck />Create</button>
            </div>
          </div>
        </div>
      )}
      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
