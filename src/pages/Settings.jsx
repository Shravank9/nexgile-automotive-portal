import { useState } from 'react';
import Toast from '../components/Toast';
import { IconCheck } from '../components/Icons';

export default function Settings() {
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState({ name:'Dealer Manager', email:'manager@nexgile.com', role:'Administrator', phone:'+91 98765 43210', dealership:'Nexgile Motors Pvt. Ltd.', location:'Hyderabad, Telangana' });
  const [prefs, setPrefs] = useState({ emailNotif:true, smsNotif:false, pushNotif:true, autoAssign:true, darkMode:true, compactView:false, currency:'USD', timezone:'IST (UTC+5:30)', language:'English' });
  const [tab, setTab] = useState('profile');

  function save() { setToast({ msg:'✅ Settings saved successfully!', color:'var(--green)' }); }

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Manage your account, preferences and portal configuration</div>
        </div>
        <button className="btn btn-primary" onClick={save}><IconCheck/>Save Changes</button>
      </div>

      <div className="tab-bar">
        {[['profile','👤 Profile'],['notifications','🔔 Notifications'],['preferences','⚙️ Preferences'],['team','👥 Team'],['integrations','🔌 Integrations']].map(([k,l])=>(
          <button key={k} className={`tab-btn${tab===k?' active':''}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {/* PROFILE */}
      {tab==='profile' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div className="card-title">Profile Information</div></div>
            <div className="card-body">
              <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,padding:'16px',background:'var(--bg3)',borderRadius:10}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),#c4780a)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font)',fontWeight:800,fontSize:22,color:'#000',flexShrink:0}}>DM</div>
                <div>
                  <div style={{fontFamily:'var(--font)',fontWeight:700,fontSize:16}}>{profile.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{profile.role}</div>
                  <button className="btn btn-outline btn-sm" style={{marginTop:8}}>Change Photo</button>
                </div>
              </div>
              <div className="form-grid">
                {[['Full Name','name'],['Email','email'],['Phone','phone'],['Role','role'],['Dealership','dealership'],['Location','location']].map(([l,k])=>(
                  <div key={k} className="form-field">
                    <label className="form-label">{l}</label>
                    <input className="form-input" value={profile[k]} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card" style={{height:'fit-content'}}>
            <div className="card-header"><div className="card-title">Security</div></div>
            <div className="card-body">
              {[['Current Password',''],['New Password',''],['Confirm Password','']].map(([l])=>(
                <div key={l} className="form-field" style={{marginBottom:14}}>
                  <label className="form-label">{l}</label>
                  <input className="form-input" type="password" placeholder="••••••••"/>
                </div>
              ))}
              <button className="btn btn-outline" style={{width:'100%',justifyContent:'center'}} onClick={()=>setToast({msg:'Password updated!',color:'var(--green)'})}>Update Password</button>
              <div style={{marginTop:20,padding:'14px',background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:8}}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>Two-Factor Authentication</div>
                <div style={{fontSize:12,color:'var(--muted)',marginBottom:10}}>Add an extra layer of security to your account.</div>
                <button className="btn btn-primary btn-sm" onClick={()=>setToast({msg:'2FA setup initiated.',color:'var(--blue)'})}>Enable 2FA</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {tab==='notifications' && (
        <div className="card" style={{maxWidth:600}}>
          <div className="card-header"><div className="card-title">Notification Preferences</div></div>
          <div className="card-body">
            {[
              {label:'Email Notifications', desc:'Receive deal updates, lead alerts via email', key:'emailNotif'},
              {label:'SMS Notifications',   desc:'Get urgent alerts via text message',          key:'smsNotif'},
              {label:'Push Notifications',  desc:'Browser push notifications',                  key:'pushNotif'},
              {label:'Auto-Assign Leads',   desc:'Automatically assign incoming leads to reps', key:'autoAssign'},
            ].map(p=>(
              <div key={p.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontSize:14,fontWeight:500}}>{p.label}</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{p.desc}</div>
                </div>
                <div onClick={()=>setPrefs(x=>({...x,[p.key]:!x[p.key]}))} style={{
                  width:44,height:24,borderRadius:12,cursor:'pointer',flexShrink:0,
                  background:prefs[p.key]?'var(--accent)':'#e2e8f0',
                  position:'relative',transition:'background .2s'
                }}>
                  <div style={{position:'absolute',top:3,left:prefs[p.key]?'calc(100% - 21px)':3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREFERENCES */}
      {tab==='preferences' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div className="card-title">Display & Region</div></div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Currency</label>
                  <select className="form-select" value={prefs.currency} onChange={e=>setPrefs(p=>({...p,currency:e.target.value}))}>
                    {['USD','INR','EUR','GBP','AED'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Timezone</label>
                  <select className="form-select" value={prefs.timezone} onChange={e=>setPrefs(p=>({...p,timezone:e.target.value}))}>
                    {['IST (UTC+5:30)','UTC','EST (UTC-5)','PST (UTC-8)','GST (UTC+4)'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={prefs.language} onChange={e=>setPrefs(p=>({...p,language:e.target.value}))}>
                    {['English','Hindi','Telugu','Tamil','Arabic'].map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              {[{label:'Compact View',desc:'Show denser tables and cards',key:'compactView'}].map(p=>(
                <div key={p.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderTop:'1px solid var(--border)',marginTop:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{p.label}</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>{p.desc}</div>
                  </div>
                  <div onClick={()=>setPrefs(x=>({...x,[p.key]:!x[p.key]}))} style={{width:44,height:24,borderRadius:12,cursor:'pointer',flexShrink:0,background:prefs[p.key]?'var(--accent)':'#e2e8f0',position:'relative',transition:'background .2s'}}>
                    <div style={{position:'absolute',top:3,left:prefs[p.key]?'calc(100% - 21px)':3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{height:'fit-content'}}>
            <div className="card-header"><div className="card-title">Portal Version</div></div>
            <div className="card-body">
              {[['Portal Version','v2.1.0'],['Build','2026-03-21'],['Environment','Production'],['Last Login','Today, 09:14 AM'],['Session','Active']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:13,color:'var(--muted)'}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEAM */}
      {tab==='team' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Team Members</div>
            <button className="btn btn-primary btn-sm" onClick={()=>setToast({msg:'Invite sent!',color:'var(--green)'})}>+ Invite Member</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Last Active</th></tr></thead>
            <tbody>
              {[
                {name:'Kiran S.',  role:'Sales Advisor',  email:'kiran@nexgile.com',  status:'Online',  last:'Now'},
                {name:'Raj P.',    role:'Sales Advisor',  email:'raj@nexgile.com',    status:'Online',  last:'5m ago'},
                {name:'Anita R.',  role:'Sales Advisor',  email:'anita@nexgile.com',  status:'Away',    last:'1h ago'},
                {name:'Deepak M.',  role:'Sales Advisor', email:'deepak@nexgile.com', status:'Offline', last:'Yesterday'},
                {name:'Pradeep V.', role:'Service Advisor',email:'pradeep@nexgile.com',status:'Online',last:'Now'},
                {name:'Meena L.',  role:'Service Advisor',email:'meena@nexgile.com',  status:'Away',    last:'2h ago'},
              ].map((m,i)=>(
                <tr key={m.name}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:['#e8a020','#3b82f6','#22c55e','#a855f7','#ef4444','#06b6d4'][i],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font)',fontWeight:700,fontSize:12,color:'#000',flexShrink:0}}>
                        {m.name.split(' ').map(w=>w[0]).join('')}
                      </div>
                      <span style={{fontWeight:500}}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{fontSize:12,color:'var(--muted2)'}}>{m.role}</td>
                  <td style={{fontSize:12,color:'var(--muted)'}}>{m.email}</td>
                  <td><span className={`tag ${m.status==='Online'?'tag-green':m.status==='Away'?'tag-orange':'tag-gray'}`}>{m.status}</span></td>
                  <td style={{fontSize:12,color:'var(--muted)'}}>{m.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* INTEGRATIONS */}
      {tab==='integrations' && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {[
            {name:'KBB / Black Book',  desc:'Trade-in valuation market data',      icon:'📊', status:'Connected',    color:'var(--green)'},
            {name:'Autotrader',        desc:'3rd party lead feed integration',      icon:'🚗', status:'Connected',    color:'var(--green)'},
            {name:'HDFC Bank',         desc:'F&I credit decisioning API',           icon:'🏦', status:'Connected',    color:'var(--green)'},
            {name:'Twilio SMS',        desc:'Automated customer follow-up SMS',     icon:'📱', status:'Not Connected',color:'var(--muted)'},
            {name:'Google Maps',       desc:'Location & directions for customers',  icon:'📍', status:'Connected',    color:'var(--green)'},
            {name:'DocuSign',          desc:'Electronic document signing',          icon:'✍️', status:'Not Connected',color:'var(--muted)'},
          ].map(intg=>(
            <div key={intg.name} className="card">
              <div className="card-body">
                <div style={{fontSize:28,marginBottom:10}}>{intg.icon}</div>
                <div style={{fontFamily:'var(--font)',fontWeight:700,fontSize:14,marginBottom:4}}>{intg.name}</div>
                <div style={{fontSize:12,color:'var(--muted)',marginBottom:14,lineHeight:1.5}}>{intg.desc}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span className={`tag ${intg.status==='Connected'?'tag-green':'tag-gray'}`} style={{fontSize:10}}>{intg.status}</span>
                  <button className="btn btn-outline btn-sm"
                    onClick={()=>setToast({msg:`${intg.name} ${intg.status==='Connected'?'disconnected':'connecting...'}`,color:intg.status==='Connected'?'var(--red)':'var(--green)'})}>
                    {intg.status==='Connected'?'Manage':'Connect'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast&&<Toast message={toast.msg} color={toast.color} onClose={()=>setToast(null)}/>}
    </div>
  );
}
