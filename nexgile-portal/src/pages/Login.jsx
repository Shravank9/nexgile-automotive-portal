import { useState } from 'react';

export default function Login({ onLogin }) {
  const [form, setForm]     = useState({ email: 'manager@nexgile.com', password: 'demo123' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

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
        setError('Invalid credentials. Use password: demo123');
      }
    }, 1200);
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: -100, left: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--card2)', border: '1px solid var(--border2)',
        borderRadius: 20, padding: '40px 36px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.4s ease'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: 'linear-gradient(135deg, #e8a020, #c4780a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 20, color: '#000',
            boxShadow: '0 0 24px rgba(232,160,32,0.35)'
          }}>N</div>
          <div>
            <div style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 20, color: '#fff' }}>Nexgile</div>
            <div style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.8px', fontWeight: 500 }}>Auto Retail Portal</div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Sign in to your dealership dashboard</div>
        </div>

        {/* Demo Credentials Hint */}
        <div style={{
          background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)',
          borderRadius: 8, padding: '12px 14px', fontSize: 12, color: 'var(--accent)',
          marginBottom: 20, lineHeight: 1.5
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>📝 Demo Credentials</div>
          <div>Email: <code style={{background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 3}}>manager@nexgile.com</code></div>
          <div>Password: <code style={{background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 3}}>demo123</code></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', fontWeight: 600, marginBottom: 6 }}>Email Address</label>
            <input
              className="form-input"
              type="email"
              style={{ width: '100%' }}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@dealership.com"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input
              className="form-input"
              type="password"
              style={{ width: '100%' }}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red)',
              marginBottom: 16
            }}>{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Signing in…
              </>
            ) : 'Sign In →'}
          </button>
        </form>

        <div style={{
          marginTop: 24, padding: '14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          fontSize: 12, color: 'var(--muted)', lineHeight: 1.7
        }}>
          <strong style={{ color: 'var(--accent)' }}>Demo credentials</strong><br/>
          Email: manager@nexgile.com<br/>
          Password: <code style={{ color: 'var(--text)' }}>demo123</code>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
