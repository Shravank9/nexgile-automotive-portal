import { useState } from 'react';

export default function Login({ onLogin }) {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (form.password === 'demo123') {
        onLogin({ name: 'Dealer Manager', role: 'Administrator', initials: 'DM' });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }, 1200);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4f9',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* ── LEFT PANEL */}
      <div style={{
        flex: '0 0 42%',
        background: 'linear-gradient(160deg, #0c1929 0%, #0a2040 55%, #0c3566 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '48px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: -120, right: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,102,194,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,102,194,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 11,
            background: 'linear-gradient(135deg, #0a66c2, #0d7ae8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 18, color: '#fff',
            boxShadow: '0 4px 16px rgba(10,102,194,0.5)',
            flexShrink: 0,
          }}>N</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>Nexgile</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.6px', fontWeight: 600 }}>Auto Retail Portal</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1, paddingBottom: 40 }}>
          <div style={{
            fontSize: 28, fontWeight: 800, color: '#fff',
            lineHeight: 1.25, letterSpacing: '-0.8px', marginBottom: 16,
          }}>
            The smarter way<br/>to run your<br/><span style={{ color: '#63b3fc' }}>dealership.</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 32, maxWidth: 280 }}>
            Unified inventory, leads, sales, F&I, and service — all in one real-time platform.
          </div>

          {[
            { icon: '🏛️', title: 'Unified DMS', desc: 'Single source of truth across all departments' },
            { icon: '📊', title: 'Live Analytics', desc: 'Real-time BI dashboards and sales forecasting' },
            { icon: '📱', title: 'Digital Retailing', desc: '24/7 online configuration, finance & scheduling' },
            { icon: '⭐', title: 'Service Excellence', desc: 'Intelligent scheduling and automated follow-ups' },
          ].map(p => (
            <div key={p.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'rgba(10,102,194,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15,
              }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
          © 2026 Nexgile Technologies Pvt. Ltd.
        </div>
      </div>

      {/* ── RIGHT PANEL */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#1a2332', letterSpacing: '-0.6px', marginBottom: 6 }}>
              Sign in
            </div>
            <div style={{ fontSize: 13, color: '#6b7a8d', fontWeight: 400 }}>
              Enter your credentials to access the portal
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 11, textTransform: 'uppercase',
                letterSpacing: '0.9px', color: '#6b7a8d', fontWeight: 700, marginBottom: 6,
              }}>Email Address</label>
              <input
                type="email"
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 9,
                  fontSize: 14, color: '#1a2332', fontFamily: 'inherit',
                  background: '#f8fafc', outline: 'none',
                  transition: 'border-color .15s, box-shadow .15s',
                  boxSizing: 'border-box',
                }}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@dealership.com"
                onFocus={e => { e.target.style.borderColor='#0a66c2'; e.target.style.boxShadow='0 0 0 3px rgba(10,102,194,0.1)'; e.target.style.background='#fff'; }}
                onBlur={e => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{
                  fontSize: 11, textTransform: 'uppercase',
                  letterSpacing: '0.9px', color: '#6b7a8d', fontWeight: 700,
                }}>Password</label>
                <span style={{ fontSize: 12, color: '#0a66c2', cursor: 'pointer', fontWeight: 600 }}>
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px',
                    border: '1.5px solid #e2e8f0', borderRadius: 9,
                    fontSize: 14, color: '#1a2332', fontFamily: 'inherit',
                    background: '#f8fafc', outline: 'none',
                    transition: 'border-color .15s, box-shadow .15s',
                    boxSizing: 'border-box',
                  }}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  onFocus={e => { e.target.style.borderColor='#0a66c2'; e.target.style.boxShadow='0 0 0 3px rgba(10,102,194,0.1)'; e.target.style.background='#fff'; }}
                  onBlur={e => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#8e9bb0', padding: 4, lineHeight: 1,
                  }}
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, marginTop: 14 }}>
              <input type="checkbox" id="remember" defaultChecked style={{ accentColor: '#0a66c2', width: 14, height: 14, cursor: 'pointer' }}/>
              <label htmlFor="remember" style={{ fontSize: 13, color: '#6b7a8d', cursor: 'pointer', fontWeight: 500 }}>
                Keep me signed in
              </label>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(199,0,11,0.07)', border: '1px solid rgba(199,0,11,0.2)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#c7000b',
                marginBottom: 16, fontWeight: 500,
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#5a9fd4' : '#0a66c2',
                color: '#fff', border: 'none', borderRadius: 9,
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background .2s, transform .15s',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(10,102,194,0.3)',
                letterSpacing: '-0.1px',
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.background='#0d7ae8'; e.target.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e => { if (!loading) { e.target.style.background='#0a66c2'; e.target.style.transform='translateY(0)'; }}}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign In <span style={{ fontSize: 16 }}>→</span></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center', fontSize: 12, color: '#8e9bb0' }}>
            Protected by Nexgile Security &nbsp;·&nbsp; v2.1.0
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}