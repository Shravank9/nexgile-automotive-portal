import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deals as INIT, vehicles } from '../data/staticData';
import { IconPlus, IconCheck, IconClose, IconMoney, IconEdit, IconEye } from '../components/Icons';
import Toast from '../components/Toast';

const STAGE_CLR = {
  'Desking':'var(--accent)','F&I Review':'var(--blue)',
  'E-Sign':'var(--green)','Credit Pending':'var(--red)',
  'Delivered':'var(--green)','Cancelled':'var(--muted)'
};

function calcMonthly(p,r,m){
  if(!p||!r||!m) return 0;
  const rate=r/100/12;
  return Math.round(p*rate*Math.pow(1+rate,m)/(Math.pow(1+rate,m)-1));
}

const EMPTY={ customer:'',vehicle:'',type:'Purchase',salePrice:'',tradeIn:'0',downPayment:'',rate:'7.0',term:'60',status:'Desking' };

export default function Sales() {
  const navigate = useNavigate();
  const [data,    setData]  = useState(INIT);
  const [modal,   setModal] = useState(null);
  const [form,    setForm]  = useState(EMPTY);
  const [tab,     setTab]   = useState('All');
  const [toast,   setToast] = useState(null);
  const [contract,setContract]=useState(null); // deal to show contract for
  const [printing,setPrinting]=useState(false);

  // Desking calculator
  const [desk, setDesk] = useState({
    salePrice:48900,tradeIn:12500,downPayment:5000,
    rate:6.9,term:60,type:'Purchase',tax:18
  });
  const financeAmt = Math.max(0,desk.salePrice-desk.tradeIn-desk.downPayment);
  const taxAmt     = Math.round(financeAmt*desk.tax/100);
  const totalFinance = financeAmt+taxAmt;
  const monthly    = calcMonthly(totalFinance,desk.rate,desk.term);

  const STATUSES=['All','Desking','F&I Review','E-Sign','Credit Pending','Delivered'];
  const filtered = data.filter(d=>tab==='All'||d.status===tab);

  function openNew(){ setForm(EMPTY); setModal('add'); }

  function handleSave(){
    if(!form.customer||!form.vehicle){ setToast({msg:'Customer & Vehicle required',color:'var(--red)'}); return; }
    const sp=parseFloat(form.salePrice)||0,ti=parseFloat(form.tradeIn)||0,dp=parseFloat(form.downPayment)||0;
    const fa=sp-ti-dp, mp=calcMonthly(fa,parseFloat(form.rate)||7,parseInt(form.term)||60);
    const stages={'Desking':20,'F&I Review':60,'E-Sign':85,'Credit Pending':45,'Delivered':100};
    setData(d=>[...d,{...form,id:Date.now(),salePrice:sp,tradeIn:ti,downPayment:dp,financeAmount:fa,monthlyPayment:mp,term:parseInt(form.term),rate:parseFloat(form.rate),stage:stages[form.status]||20}]);
    setModal(null);
    setToast({msg:`✅ Deal created for ${form.customer}!`,color:'var(--green)'});
  }

  function updateStatus(id,status){
    const stages={'Desking':20,'F&I Review':60,'E-Sign':85,'Credit Pending':45,'Delivered':100,'Cancelled':0};
    setData(d=>d.map(x=>x.id===id?{...x,status,stage:stages[status]||x.stage}:x));
    setToast({msg:`Deal → ${status}`,color:STAGE_CLR[status]||'var(--accent)'});
  }

  function sendToFI(deal){
    updateStatus(deal.id,'F&I Review');
    setToast({msg:'✅ Deal sent to F&I queue!',color:'var(--green)'});
    setTimeout(()=>navigate('/fi'),1200);
  }

  // Print contract function — opens browser print dialog
  function printContract(deal){
    const w=window.open('','_blank');
    w.document.write(`
      <!DOCTYPE html><html><head><title>Contract — ${deal.customer}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:40px;max-width:700px;margin:0 auto;color:#111}
        h1{font-size:22px;margin-bottom:4px}
        .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:#f0c060;color:#000;margin-bottom:24px}
        table{width:100%;border-collapse:collapse;margin:20px 0}
        td{padding:10px 14px;border:1px solid #ddd;font-size:14px}
        td:first-child{font-weight:600;background:#f9f9f9;width:40%}
        .total{font-size:20px;font-weight:800;color:#111;margin:20px 0}
        .monthly{font-size:28px;font-weight:900;color:#c4780a}
        .sig{margin-top:60px;display:flex;gap:60px}
        .sig-line{flex:1;border-top:2px solid #333;padding-top:8px;font-size:12px;color:#666}
        .footer{margin-top:40px;font-size:11px;color:#999;border-top:1px solid #ddd;padding-top:12px}
        @media print{button{display:none}}
      </style></head><body>
      <h1>NEXGILE AUTO RETAIL PORTAL</h1>
      <h2 style="margin:0 0 4px;font-size:16px;color:#666">Sales Contract / Deal Agreement</h2>
      <div class="badge">D-${deal.id.toString().slice(-4)} · ${deal.status.toUpperCase()}</div>
      <table>
        <tr><td>Customer Name</td><td>${deal.customer}</td></tr>
        <tr><td>Vehicle</td><td>${deal.vehicle}</td></tr>
        <tr><td>Deal Type</td><td>${deal.type}</td></tr>
        <tr><td>Sale Price</td><td>$${deal.salePrice.toLocaleString()}</td></tr>
        <tr><td>Trade-In Allowance</td><td>$${(deal.tradeIn||0).toLocaleString()}</td></tr>
        <tr><td>Down Payment</td><td>$${(deal.downPayment||0).toLocaleString()}</td></tr>
        <tr><td>Finance Amount</td><td>$${deal.financeAmount.toLocaleString()}</td></tr>
        <tr><td>Interest Rate</td><td>${deal.rate}% APR</td></tr>
        <tr><td>Loan Term</td><td>${deal.term} months</td></tr>
        <tr><td>Execution Date</td><td>${new Date().toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</td></tr>
        <tr><td>Status</td><td>${deal.status}</td></tr>
      </table>
      <div class="total">Finance Amount: <strong>$${deal.financeAmount.toLocaleString()}</strong></div>
      <div>Monthly Payment: <span class="monthly">$${deal.monthlyPayment}/mo</span></div>
      <p style="color:#888;font-size:13px;margin-top:4px">${deal.term} months @ ${deal.rate}% APR</p>
      <div class="sig">
        <div class="sig-line">Customer Signature & Date</div>
        <div class="sig-line">Dealer Representative & Date</div>
        <div class="sig-line">F&I Manager & Date</div>
      </div>
      <div class="footer">
        This document is generated by Nexgile Auto Retail Portal. All figures are subject to final verification.
        Nexgile Technologies · nexgile.com · +91 40 1234 5678
      </div>
      <br/><button onclick="window.print()" style="padding:10px 24px;background:#e8a020;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:14px">🖨️ Print Contract</button>
      </body></html>
    `);
    w.document.close();
  }

  const totalRevenue=data.filter(d=>d.status==='Delivered').reduce((s,d)=>s+d.salePrice,0);

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Sales &amp; Deals</div>
          <div className="page-sub">Interactive desking · Lease vs. Purchase · F&amp;I pipeline · {data.length} deals</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openNew}><IconPlus/>New Deal</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{marginBottom:24}}>
        {[
          {l:'Total Deals',      v:data.length,                                   c:'c-blue',   click:()=>setTab('All')},
          {l:'In Desking',       v:data.filter(d=>d.status==='Desking').length,   c:'c-orange', click:()=>setTab('Desking')},
          {l:'E-Sign Ready',     v:data.filter(d=>d.status==='E-Sign').length,    c:'c-green',  click:()=>setTab('E-Sign')},
          {l:'Revenue Delivered',v:'$'+Math.round(totalRevenue/1000)+'K',         c:'c-purple', click:()=>setTab('Delivered')},
        ].map(k=>(
          <div key={k.l} className={`kpi-card ${k.c}`} style={{cursor:'pointer'}} onClick={k.click}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{fontSize:26,marginTop:10}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Deal Table */}
      <div className="card" style={{marginBottom:28}}>
        <div className="card-header">
          <div className="card-title">Deal Pipeline</div>
          <div style={{display:'flex',gap:6}}>
            <button className="btn btn-primary btn-sm" onClick={openNew}><IconPlus/>New Deal</button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="tab-bar" style={{padding:'12px 16px 0',marginBottom:0,flexWrap:'wrap'}}>
          {STATUSES.map(s=>(
            <button key={s} className={`tab-btn${tab===s?' active':''}`} onClick={()=>setTab(s)} style={{fontSize:12}}>
              {s} ({s==='All'?data.length:data.filter(d=>d.status===s).length})
            </button>
          ))}
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr>
              <th>Customer</th><th>Vehicle</th><th>Type</th>
              <th>Sale Price</th><th>Trade-In</th><th>Monthly</th>
              <th>Term</th><th>Rate</th><th>Progress</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={11} style={{textAlign:'center',padding:40,color:'var(--muted)'}}>No deals in this stage.</td></tr>}
              {filtered.map(d=>(
                <tr key={d.id}>
                  <td style={{fontWeight:500}}>{d.customer}</td>
                  <td>
                    <div className="vehicle-cell">
                      <div className="vehicle-thumb">🚗</div>
                      <span className="v-name">{d.vehicle}</span>
                    </div>
                  </td>
                  <td><span className={`tag ${d.type==='Lease'?'tag-purple':'tag-blue'}`}>{d.type}</span></td>
                  <td style={{fontFamily:'var(--syne)',fontWeight:700}}>${d.salePrice.toLocaleString()}</td>
                  <td style={{color:'var(--green)',fontSize:12}}>${(d.tradeIn||0).toLocaleString()}</td>
                  <td style={{fontFamily:'var(--syne)',fontWeight:700,color:'var(--accent)'}}>${d.monthlyPayment}/mo</td>
                  <td style={{color:'var(--muted)',fontSize:12}}>{d.term}mo</td>
                  <td style={{color:'var(--muted)',fontSize:12}}>{d.rate}%</td>
                  <td>
                    <div style={{width:90}}>
                      <div className="stage-bar"><div className="stage-fill" style={{width:`${d.stage}%`,background:STAGE_CLR[d.status]||'var(--accent)'}}/></div>
                      <div className="stage-label">{d.stage}%</div>
                    </div>
                  </td>
                  <td>
                    <select className="form-select" value={d.status} onChange={e=>updateStatus(d.id,e.target.value)}
                      style={{padding:'4px 8px',fontSize:11,borderRadius:6,color:STAGE_CLR[d.status]||'var(--text)',background:'var(--bg3)',border:'1px solid var(--border)'}}>
                      {['Desking','F&I Review','E-Sign','Credit Pending','Delivered','Cancelled'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:4'}}>
                      <button className="btn btn-outline btn-sm" title="View Contract" onClick={()=>setContract(d)}>📄</button>
                      <button className="btn btn-primary btn-sm" title="Send to F&I" onClick={()=>sendToFI(d)} style={{fontSize:10,padding:'4px 6px'}}>→F&I</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── INTERACTIVE DESKING CALCULATOR ── */}
      <div style={{marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:3,height:18,background:'var(--accent)',borderRadius:2}}/>
        <span style={{fontFamily:'var(--syne)',fontWeight:700,fontSize:14,color:'#fff',textTransform:'uppercase',letterSpacing:.8}}>Interactive Desking</span>
        <span style={{fontSize:12,color:'var(--muted)'}}>— Real-time deal structuring · Lease vs. Purchase · Tax/Fee calculations</span>
      </div>
      <div className="grid-2">
        {/* Calculator */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🧮 Deal Calculator</div>
              <div className="card-sub">Real-time deal structuring</div>
            </div>
          </div>
          <div className="card-body">
            <div className="tab-bar" style={{marginBottom:18}}>
              {['Purchase','Lease','Balloon'].map(t=>(
                <button key={t} className={`tab-btn${desk.type===t?' active':''}`} onClick={()=>setDesk(d=>({...d,type:t}))}>{t}</button>
              ))}
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Vehicle Price ($)</label>
                <input className="form-input" type="number" value={desk.salePrice} onChange={e=>setDesk(d=>({...d,salePrice:+e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Trade-In Value ($)</label>
                <input className="form-input" type="number" value={desk.tradeIn} onChange={e=>setDesk(d=>({...d,tradeIn:+e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Down Payment ($)</label>
                <input className="form-input" type="number" value={desk.downPayment} onChange={e=>setDesk(d=>({...d,downPayment:+e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Interest Rate (%)</label>
                <input className="form-input" type="number" step="0.1" value={desk.rate} onChange={e=>setDesk(d=>({...d,rate:+e.target.value}))}/>
              </div>
              <div className="form-field">
                <label className="form-label">Loan Term (months)</label>
                <select className="form-select" value={desk.term} onChange={e=>setDesk(d=>({...d,term:+e.target.value}))}>
                  {[24,36,48,60,72,84].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Tax Rate (%)</label>
                <input className="form-input" type="number" value={desk.tax} onChange={e=>setDesk(d=>({...d,tax:+e.target.value}))}/>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Deal Summary</div>
            <div className="card-sub">{desk.type} · {desk.term} months</div>
          </div>
          <div>
            {[
              {l:'Vehicle Selling Price', v:`$${desk.salePrice.toLocaleString()}`,    c:'var(--text)'},
              {l:'Trade-In Allowance',    v:`−$${desk.tradeIn.toLocaleString()}`,      c:'var(--green)'},
              {l:'Down Payment',          v:`−$${desk.downPayment.toLocaleString()}`,  c:'var(--green)'},
              {l:'Net Finance Amount',    v:`$${financeAmt.toLocaleString()}`,         c:'var(--text)'},
              {l:`Tax (${desk.tax}%)`,    v:`$${taxAmt.toLocaleString()}`,             c:'var(--accent)'},
              {l:'Total Financed',        v:`$${totalFinance.toLocaleString()}`,       c:'var(--text)'},
            ].map(r=>(
              <div key={r.l} className="mini-list-item">
                <span style={{fontSize:13,color:'var(--muted2)'}}>{r.l}</span>
                <span style={{fontFamily:'var(--syne)',fontWeight:700,color:r.c}}>{r.v}</span>
              </div>
            ))}
            <div className="mini-list-item" style={{background:'rgba(232,160,32,0.06)',borderRadius:10,margin:'4px 8px',padding:'14px 12px'}}>
              <div>
                <div style={{fontSize:11,color:'var(--accent)',textTransform:'uppercase',letterSpacing:1,fontWeight:600}}>Monthly Payment</div>
                <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{desk.term} months @ {desk.rate}% APR</div>
              </div>
              <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:28,color:'var(--accent)'}}>${monthly}<span style={{fontSize:14}}>/mo</span></div>
            </div>
          </div>
          <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:12}}
              onClick={()=>{ setToast({msg:'✅ Deal sent to F&I queue!',color:'var(--green)'}); setTimeout(()=>navigate('/fi'),1200); }}>
              <IconMoney/>Send to F&amp;I
            </button>
            <button className="btn btn-outline" style={{width:'100%',justifyContent:'center',padding:10,fontSize:12}}
              onClick={()=>setToast({msg:'📋 Saved to desking queue.',color:'var(--blue)'})}>
              Save to Desking Queue
            </button>
          </div>
        </div>
      </div>

      {/* Contract Viewer */}
      {contract&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setContract(null)}>
          <div className="modal-box" style={{maxWidth:520}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <div>
                <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:18}}>Contract Details</div>
                <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>D-{contract.id.toString().slice(-4)}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={()=>setContract(null)}><IconClose/></button>
            </div>

            <div style={{background:'var(--bg3)',borderRadius:10,padding:'16px 20px',marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div>
                  <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:20}}>{contract.customer}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>D-{contract.id.toString().slice(-4)}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'var(--syne)',fontWeight:800,fontSize:20,color:'var(--accent)'}}>${contract.salePrice.toLocaleString()}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>{contract.type}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[
                  ['Vehicle',      contract.vehicle],
                  ['Execution Date',new Date().toLocaleDateString()],
                  ['Finance Amount','$'+contract.financeAmount.toLocaleString()],
                  ['Monthly',      '$'+contract.monthlyPayment+'/mo'],
                  ['Term',         contract.term+' months'],
                  ['Rate',         contract.rate+'% APR'],
                  ['Trade-In',     '$'+(contract.tradeIn||0).toLocaleString()],
                  ['Down Payment', '$'+(contract.downPayment||0).toLocaleString()],
                ].map(([l,v])=>(
                  <div key={l} style={{background:'var(--bg)',borderRadius:7,padding:'8px 10px'}}>
                    <div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>{l}</div>
                    <div style={{fontSize:13,fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:'rgba(232,160,32,0.07)',border:'1px solid rgba(232,160,32,0.2)',borderRadius:8,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10,fontSize:13}}>
              <span style={{color:'var(--accent)'}}>✓</span>
              <span>
                {contract.status==='Delivered'?'Contract executed and delivered.':
                 contract.status==='E-Sign'?'Awaiting electronic signature.':
                 contract.status==='F&I Review'?'Under F&I review.':
                 'Paperwork pending — deal in progress.'}
              </span>
              <span className={`tag ${contract.status==='Delivered'?'tag-green':contract.status==='E-Sign'?'tag-blue':'tag-orange'}`} style={{marginLeft:'auto'}}>{contract.status}</span>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={()=>{printContract(contract);}}>🖨️ Print Contract</button>
              <button className="btn btn-outline" onClick={()=>{setContract(null);sendToFI(contract);}}>→ Send to F&I</button>
              <button className="btn btn-outline" onClick={()=>setContract(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* New Deal Modal */}
      {modal==='add'&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">💰 Create New Deal</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Customer *</label><input className="form-input" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></div>
              <div className="form-field">
                <label className="form-label">Vehicle *</label>
                <select className="form-select" value={form.vehicle} onChange={e=>setForm(f=>({...f,vehicle:e.target.value}))}>
                  <option value="">— Select vehicle —</option>
                  {vehicles.filter(v=>v.status==='Available').map(v=>(
                    <option key={v.id} value={`${v.year} ${v.make} ${v.model}`}>{v.year} {v.make} {v.model} — ${v.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="form-field"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option>Purchase</option><option>Lease</option></select></div>
              <div className="form-field"><label className="form-label">Sale Price ($)</label><input className="form-input" type="number" value={form.salePrice} onChange={e=>setForm(f=>({...f,salePrice:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Trade-In ($)</label><input className="form-input" type="number" value={form.tradeIn} onChange={e=>setForm(f=>({...f,tradeIn:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Down Payment ($)</label><input className="form-input" type="number" value={form.downPayment} onChange={e=>setForm(f=>({...f,downPayment:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Rate (%)</label><input className="form-input" type="number" step="0.1" value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Term</label><select className="form-select" value={form.term} onChange={e=>setForm(f=>({...f,term:e.target.value}))}>{[24,36,48,60,72,84].map(t=><option key={t}>{t} months</option>)}</select></div>
              <div className="form-field"><label className="form-label">Initial Stage</label><select className="form-select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{['Desking','F&I Review','E-Sign','Credit Pending'].map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(null)}><IconClose/>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><IconCheck/>Create Deal</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
