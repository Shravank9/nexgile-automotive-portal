import { useEffect } from 'react';

export default function Toast({ message, color = '#22c55e', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast">
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color, flexShrink: 0
      }} />
      {message}
    </div>
  );
}
