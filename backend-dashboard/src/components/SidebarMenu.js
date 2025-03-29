import React from 'react';

function SidebarMenu() {
  return (
    <div className="scrollbar" data-simplebar>
      <ul className="navbar-nav" id="navbar-nav">
        <li className="menu-title">General</li>

        <li className="nav-item">
          <a className="nav-link" href="/">
            <span className="nav-icon">
              <i className="solar:widget-5-bold-duotone"></i>
            </span>
            <span className="nav-text">Dashboard</span>
          </a>
        </li>

        {/* Add more menu items as needed */}
      </ul>
    </div>
  );
}

export default SidebarMenu;