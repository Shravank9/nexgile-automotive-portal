export default function KpiCard({ label, value, change, up, color, sparkData, icon }) {
  const sparkColor = {
    orange: '#e8a020', blue: '#3b82f6',
    green: '#22c55e',  red: '#ef4444', purple: '#a855f7'
  }[color] || '#e8a020';

  return (
    <div className={`kpi-card c-${color}`}>
      <div className="kpi-header">
        <div className="kpi-label">{label}</div>
        {icon && (
          <div className={`kpi-icon-wrap c-${color}`} style={{ fontSize: 16 }}>
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      {change && (
        <div className={`kpi-change ${up === false ? 'down' : up === true ? 'up' : 'neu'}`}>
          {up === true  && <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 10l7-7 7 7M12 3v18"/></svg>}
          {up === false && <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 14l-7 7-7-7M12 21V3"/></svg>}
          {change}
        </div>
      )}
      {sparkData && (
        <div className="sparkline">
          {sparkData.map((h, i) => (
            <div key={i} className="spark-bar" style={{
              height: `${h}%`,
              background: i === sparkData.length - 1 ? sparkColor : sparkColor + '44'
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
