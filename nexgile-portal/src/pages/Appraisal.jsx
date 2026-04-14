import { useState } from 'react';
import { appraisals as INIT } from '../data/staticData';
import { IconPlus, IconClose, IconCheck, IconEdit, IconSearch } from '../components/Icons';
import Toast from '../components/Toast';

const STATUS_TAG = {
  'Offer Made':      'tag-orange',
  'Accepted':        'tag-green',
  'Inspecting':      'tag-blue',
  'Reconditioning':  'tag-gray',
  'Completed':       'tag-green',
  'Declined':        'tag-red',
};

const CONDITION_COLOR = {
  'Excellent': 'var(--green)',
  'Good':      'var(--accent)',
  'Fair':      'var(--red)',
};

const EMPTY = { customer:'', make:'', model:'', year: new Date().getFullYear(), mileage:'', color:'', condition:'Good', kbbValue:'', bbValue:'', offerMade:'', reconCost:'', status:'Inspecting' };

// Live calculator state
const CALC_INIT = { make:'Toyota', model:'Camry', year:2021, mileage:42000, condition:'Good' };

const ESTIMATE_TABLE = {
  Excellent: { base: 1.08, kbbAdj: 1.02 },
  Good:      { base: 1.00, kbbAdj: 1.00 },
  Fair:      { base: 0.88, kbbAdj: 0.95 },
};

function estimateValue(year, mileage, condition) {
  const age = new Date().getFullYear() - year;
  const base = Math.max(5000, 45000 - age * 3200 - mileage * 0.12);
  const adj = ESTIMATE_TABLE[condition] || ESTIMATE_TABLE.Good;
  const kbb = Math.round(base * adj.kbbAdj);
  const bb  = Math.round(base * adj.base * 1.04);
  return { kbb, bb, offer: Math.round((kbb + bb) / 2) };
}

export default function Appraisal() {
  const [data,    setData]    = useState(INIT);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [calc,    setCalc]    = useState(CALC_INIT);
  const [toast,   setToast]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [calcDone, setCalcDone] = useState(false);

  const filtered = data.filter(d => {
    const q = search.toLowerCase();
    return !q || `${d.customer} ${d.make} ${d.model} ${d.year}`.toLowerCase().includes(q);
  });

  function openAdd()   { setForm(EMPTY); setModal('add'); }
  function openEdit(d) { setForm({ ...d, mileage: String(d.mileage), kbbValue: String(d.kbbValue), bbValue: String(d.bbValue), offerMade: String(d.offerMade), reconCost: String(d.reconCost) }); setModal(d); }

  function handleSave() {
    if (!form.customer || !form.make) return;
    const entry = {
      ...form, id: modal === 'add' ? Date.now() : modal.id,
      mileage: parseInt(form.mileage) || 0,
      kbbValue: parseFloat(form.kbbValue) || 0,
      bbValue: parseFloat(form.bbValue) || 0,
      offerMade: parseFloat(form.offerMade) || 0,
      reconCost: parseFloat(form.reconCost) || 0,
    };
    if (modal === 'add') {
      setData(d => [...d, entry]);
      setToast({ msg: 'Appraisal created!', color: 'var(--green)' });
    } else {
      setData(d => d.map(x => x.id === entry.id ? entry : x));
      setToast({ msg: 'Appraisal updated.', color: 'var(--blue)' });
    }
    setModal(null);
  }

  function updateStatus(id, status) {
    setData(d => d.map(x => x.id === id ? { ...x, status } : x));
    setToast({ msg: `Appraisal → ${status}`, color: 'var(--accent)' });
  }

  const est = calcDone ? estimateValue(parseInt(calc.year), parseInt(calc.mileage || 0), calc.condition) : null;

  return (
    <div className="page-fade">
      <div className="page-header">
        <div>
          <div className="page-title">Used Vehicle Appraisal</div>
          <div className="page-sub">KBB &amp; Black Book integration · Trade-in valuations · Reconditioning workflows</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd}><IconPlus />New Appraisal</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid mb-24">
        {[
          { l: 'Total Appraisals', v: data.length, c: 'c-blue' },
          { l: 'Offers Made',      v: data.filter(d => d.offerMade > 0).length, c: 'c-orange' },
          { l: 'Accepted',         v: data.filter(d => d.status === 'Accepted' || d.status === 'Completed').length, c: 'c-green' },
          { l: 'In Reconditioning',v: data.filter(d => d.status === 'Reconditioning').length, c: 'c-red' },
        ].map(k => (
          <div key={k.l} className={`kpi-card ${k.c}`}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{ fontSize: 28, marginTop: 10 }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        {/* Valuation Calculator */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🔍 Live Valuation Tool</div>
              <div className="card-sub">KBB &amp; Black Book market data simulation</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Make</label>
                <input className="form-input" value={calc.make} onChange={e => { setCalc(c => ({ ...c, make: e.target.value })); setCalcDone(false); }} />
              </div>
              <div className="form-field">
                <label className="form-label">Model</label>
                <input className="form-input" value={calc.model} onChange={e => { setCalc(c => ({ ...c, model: e.target.value })); setCalcDone(false); }} />
              </div>
              <div className="form-field">
                <label className="form-label">Year</label>
                <input className="form-input" type="number" min="2000" max="2025" value={calc.year}
                  onChange={e => { setCalc(c => ({ ...c, year: e.target.value })); setCalcDone(false); }} />
              </div>
              <div className="form-field">
                <label className="form-label">Mileage (km)</label>
                <input className="form-input" type="number" value={calc.mileage}
                  onChange={e => { setCalc(c => ({ ...c, mileage: e.target.value })); setCalcDone(false); }} />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Condition</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Excellent', 'Good', 'Fair'].map(cond => (
                    <button key={cond} type="button"
                      className="btn btn-sm"
                      onClick={() => { setCalc(c => ({ ...c, condition: cond })); setCalcDone(false); }}
                      style={{
                        flex: 1, justifyContent: 'center',
                        background: calc.condition === cond ? `${CONDITION_COLOR[cond]}22` : 'var(--bg3)',
                        color: calc.condition === cond ? CONDITION_COLOR[cond] : 'var(--muted2)',
                        border: `1px solid ${calc.condition === cond ? CONDITION_COLOR[cond] + '44' : 'var(--border)'}`,
                        padding: '9px 0',
                      }}>{cond}</button>
                  ))}
                </div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}
              onClick={() => setCalcDone(true)}>
              Get Market Valuation
            </button>

            {/* Result */}
            {calcDone && est && (
              <div style={{ marginTop: 18, border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: 'rgba(34,197,94,0.06)', padding: '14px 16px', borderBottom: '1px solid rgba(34,197,94,0.1)' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Estimated Trade-In Range</div>
                  <div style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 30, color: 'var(--green)' }}>
                    ₹{est.offer.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {[['KBB Estimate', est.kbb, 'var(--blue)'], ['Black Book', est.bb, 'var(--accent)']].map(([l, v, c]) => (
                    <div key={l} style={{ padding: '12px 16px', borderRight: l === 'KBB Estimate' ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{l}</div>
                      <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 18, color: c }}>₹{v.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reconditioning Queue */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔧 Reconditioning Queue</div>
            <div className="card-sub">Estimated costs and timelines</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 420 }}>
            {data.map(a => (
              <div key={a.id} className="mini-list-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{a.year} {a.make} {a.model}</div>
                    <span className={`tag ${STATUS_TAG[a.status] || 'tag-gray'}`} style={{ fontSize: 10 }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.customer} · {a.mileage.toLocaleString()} km · <span style={{ color: CONDITION_COLOR[a.condition] }}>{a.condition}</span></div>
                  {a.reconCost > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 3 }}>Recon: ₹{a.reconCost.toLocaleString()}</div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {a.offerMade > 0
                    ? <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 15, color: 'var(--green)' }}>₹{a.offerMade.toLocaleString()}</div>
                    : <div style={{ fontSize: 12, color: 'var(--muted)' }}>No offer yet</div>
                  }
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Offer made</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appraisals Table */}
      <div className="search-input-wrap">
        <IconSearch /><input placeholder="Search appraisals…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Appraisal Records</div></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Customer</th><th>Vehicle</th><th>Mileage</th><th>Condition</th><th>KBB</th><th>Black Book</th><th>Offer Made</th><th>Recon Cost</th><th>Net Value</th><th>Status</th><th>Edit</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const net = a.offerMade - a.reconCost;
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.customer}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>{a.year} {a.make} {a.model}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.color}</div>
                    </td>
                    <td style={{ color: 'var(--muted2)' }}>{a.mileage.toLocaleString()} km</td>
                    <td><span style={{ fontWeight: 600, color: CONDITION_COLOR[a.condition] }}>{a.condition}</span></td>
                    <td style={{ color: 'var(--blue)', fontFamily: 'var(--syne)', fontWeight: 600 }}>₹{a.kbbValue.toLocaleString()}</td>
                    <td style={{ color: 'var(--accent)', fontFamily: 'var(--syne)', fontWeight: 600 }}>₹{a.bbValue.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--syne)', fontWeight: 700, color: a.offerMade > 0 ? 'var(--green)' : 'var(--muted)' }}>
                      {a.offerMade > 0 ? '₹' + a.offerMade.toLocaleString() : '—'}
                    </td>
                    <td style={{ color: 'var(--red)' }}>₹{a.reconCost.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--syne)', fontWeight: 700, color: net > 0 ? 'var(--green)' : 'var(--red)' }}>
                      {net > 0 ? '₹' + net.toLocaleString() : '—'}
                    </td>
                    <td>
                      <select className="form-select" value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6 }}>
                        {['Inspecting', 'Offer Made', 'Accepted', 'Reconditioning', 'Completed', 'Declined'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}><IconEdit /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">{modal === 'add' ? '🔍 New Appraisal' : '✏️ Edit Appraisal'}</div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Customer</label><input className="form-input" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Make</label><input className="form-input" value={form.make} onChange={e => setForm(f => ({ ...f, make: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Model</label><input className="form-input" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Year</label><input className="form-input" type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Mileage (km)</label><input className="form-input" type="number" value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></div>
              <div className="form-field">
                <label className="form-label">Condition</label>
                <select className="form-select" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                  {['Excellent', 'Good', 'Fair'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {['Inspecting', 'Offer Made', 'Accepted', 'Reconditioning', 'Completed', 'Declined'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-field"><label className="form-label">KBB Value (₹)</label><input className="form-input" type="number" value={form.kbbValue} onChange={e => setForm(f => ({ ...f, kbbValue: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Black Book Value (₹)</label><input className="form-input" type="number" value={form.bbValue} onChange={e => setForm(f => ({ ...f, bbValue: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Offer Made (₹)</label><input className="form-input" type="number" value={form.offerMade} onChange={e => setForm(f => ({ ...f, offerMade: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Recon Cost (₹)</label><input className="form-input" type="number" value={form.reconCost} onChange={e => setForm(f => ({ ...f, reconCost: e.target.value }))} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}><IconClose />Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><IconCheck />Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} color={toast.color} onClose={() => setToast(null)} />}
    </div>
  );
}
