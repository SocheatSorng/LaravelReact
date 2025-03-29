import React from 'react';

function ThemeColorToggle() {
  return (
    <div className="topbar-item">
      <button type="button" className="topbar-button" id="light-dark-mode">
        <span className="fs-24 align-middle">🌙</span>
      </button>
    </div>
  );
}

export default ThemeColorToggle;