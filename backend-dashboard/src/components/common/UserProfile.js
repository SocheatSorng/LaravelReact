import React from 'react';

function UserProfile() {
  return (
    <div className="dropdown topbar-item">
      <button type="button" className="topbar-button">
        <img 
          className="rounded-circle" 
          width="32" 
          src="/assets/images/users/avatar-1.jpg" 
          alt="user" 
        />
      </button>
    </div>
  );
}

export default UserProfile;