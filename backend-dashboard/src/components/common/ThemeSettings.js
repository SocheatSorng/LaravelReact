import React from 'react';

function ThemeSettings() {
  return (
    <div className="topbar-item d-none d-md-flex">
      <button type="button" className="topbar-button" id="theme-settings-btn" data-bs-toggle="offcanvas" data-bs-target="#theme-settings-offcanvas">
        <span className="fs-24 align-middle">⚙️</span>
      </button>
    </div>
  );
}

export default ThemeSettings;