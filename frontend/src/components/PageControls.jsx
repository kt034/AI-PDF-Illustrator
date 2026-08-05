import React from 'react';
export default function PageControls({ current, total, onChange }) {
  return (
    <div className="page-controls">
      <button onClick={() => onChange(current - 1)} disabled={current <= 1}>‹ Prev</button>
      <span>Page {current} of {total}</span>
      <button onClick={() => onChange(current + 1)} disabled={current >= total}>Next ›</button>
    </div>
  );
}
