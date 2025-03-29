import React from 'react';

function UserMenu() {
  return (
    <div className="d-flex align-items-center gap-1">
      <div className="topbar-item">
        <button type="button" className="topbar-button" id="light-dark-mode">
          <i className="solar:moon-bold-duotone fs-24 align-middle"></i>
        </button>
      </div>
      <div className="dropdown topbar-item">
        <button type="button" className="topbar-button">
          <img className="rounded-circle" width="32" src="/assets/images/users/avatar-1.jpg" alt="user" />
        </button>
      </div>
    </div>
  );
}

export default UserMenu;