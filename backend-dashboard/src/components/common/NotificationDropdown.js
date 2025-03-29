import React from 'react';

function NotificationDropdown() {
  return (
    <div className="dropdown topbar-item">
      <button 
        type="button" 
        className="topbar-button position-relative" 
        id="page-header-notifications-dropdown" 
        data-bs-toggle="dropdown" 
        aria-haspopup="true" 
        aria-expanded="false"
      >
        <span className="fs-24 align-middle">🔔</span>
        <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
          3
          <span className="visually-hidden">unread messages</span>
        </span>
      </button>

      <div className="dropdown-menu py-0 dropdown-lg dropdown-menu-end">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <div className="row align-items-center">
            <div className="col">
              <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
            </div>
            <div className="col-auto">
              <a href="#!" className="text-dark text-decoration-underline">
                <small>Clear All</small>
              </a>
            </div>
          </div>
        </div>

        <div style={{maxHeight: "280px"}}>
          <NotificationItem 
            image="/assets/images/users/avatar-1.jpg"
            name="Josephine Thompson"
            message="commented on admin panel"
            comment="Wow 😍! this admin looks good and awesome design"
          />
          {/* Add more notification items as needed */}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ image, name, message, comment }) {
  return (
    <a href="#!" className="dropdown-item py-3 border-bottom text-wrap">
      <div className="d-flex">
        <div className="flex-shrink-0">
          <img 
            src={image} 
            className="img-fluid me-2 avatar-sm rounded-circle" 
            alt={name} 
          />
        </div>
        <div className="flex-grow-1">
          <p className="mb-0">
            <span className="fw-medium">{name} </span>
            {message} 
            {comment && <span>" {comment}"</span>}
          </p>
        </div>
      </div>
    </a>
  );
}

export default NotificationDropdown;