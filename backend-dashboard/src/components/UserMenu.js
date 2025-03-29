import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user from localStorage
    const userStr = localStorage.getItem("auth_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, redirect to login
      navigate("/login");
    }
  };

  // Get user's initials for display when no avatar is available
  const getUserInitials = () => {
    if (!user) return "U";

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="d-flex align-items-center gap-1">
      <div className="topbar-item">
        <button type="button" className="topbar-button" id="light-dark-mode">
          <i className="solar:moon-bold-duotone fs-24 align-middle"></i>
        </button>
      </div>
      <div className={`dropdown topbar-item ${isOpen ? "show" : ""}`}>
        <button
          type="button"
          className="topbar-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user && user.avatar ? (
            <img
              className="rounded-circle"
              width="32"
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
            >
              {getUserInitials()}
            </div>
          )}
        </button>
        <div
          className={`dropdown-menu dropdown-menu-end ${isOpen ? "show" : ""}`}
        >
          <div className="dropdown-header">
            <h6 className="text-overflow m-0">
              {user ? `${user.firstName} ${user.lastName}` : "Welcome"}
            </h6>
            <small className="text-muted">{user?.role || "User"}</small>
          </div>
          <a className="dropdown-item" href="#!">
            <i className="fs-18 align-middle me-1">👤</i> My Profile
          </a>
          <a className="dropdown-item" href="#!">
            <i className="fs-18 align-middle me-1">⚙️</i> Settings
          </a>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            <i className="fs-18 align-middle me-1">🚪</i> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
