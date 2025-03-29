import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here later
    navigate('/login');
  };

  return (
    <div className="d-flex align-items-center gap-1">
      <div className="topbar-item">
        <button type="button" className="topbar-button" id="light-dark-mode">
          <i className="solar:moon-bold-duotone fs-24 align-middle"></i>
        </button>
      </div>
      <div className={`dropdown topbar-item ${isOpen ? 'show' : ''}`}>
        <button 
          type="button" 
          className="topbar-button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <img 
            className="rounded-circle" 
            width="32" 
            src="/assets/images/users/avatar-1.jpg" 
            alt="user" 
          />
        </button>
        <div className={`dropdown-menu dropdown-menu-end ${isOpen ? 'show' : ''}`}>
          <a className="dropdown-item" href="#!">
            <i className="fs-18 align-middle me-1">👤</i> My Profile
          </a>
          <a className="dropdown-item" href="#!">
            <i className="fs-18 align-middle me-1">⚙️</i> Settings
          </a>
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item text-danger" 
            onClick={handleLogout}
          >
            <i className="fs-18 align-middle me-1">🚪</i> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;