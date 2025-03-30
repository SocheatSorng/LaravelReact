import React from "react";
import { Link, useLocation } from "react-router-dom";

function SidebarMenu() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="scrollbar" data-simplebar>
      <ul className="navbar-nav" id="navbar-nav">
        <li className="menu-title">General</li>

        {/* Dashboard */}
        <li className="nav-item">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <span className="nav-icon">
              <span className="fs-24 align-middle">📊</span>
            </span>
            <span className="nav-text">Dashboard</span>
          </Link>
        </li>

        {/* Orders */}
        <li className="nav-item">
          <Link
            to="/orders"
            className={`nav-link ${isActive("/orders") ? "active" : ""}`}
          >
            <span className="nav-icon">
              <span className="fs-24 align-middle">🛍️</span>
            </span>
            <span className="nav-text">Orders</span>
          </Link>
        </li>

        {/* Books (renamed from Products) */}
        <li className="nav-item">
          <Link
            to="/products"
            className={`nav-link ${isActive("/products") ? "active" : ""}`}
          >
            <span className="nav-icon">
              <span className="fs-24 align-middle">📚</span>
            </span>
            <span className="nav-text">Books</span>
          </Link>
        </li>

        {/* Categories (added from old version) */}
        <li className="nav-item">
          <Link
            to="/categories"
            className={`nav-link ${isActive("/categories") ? "active" : ""}`}
          >
            <span className="nav-icon">
              <span className="fs-24 align-middle">📂</span>
            </span>
            <span className="nav-text">Categories</span>
          </Link>
        </li>

        {/* Purchases */}
        <li className="nav-item">
          <Link
            to="/purchases"
            className={`nav-link ${isActive("/purchases") ? "active" : ""}`}
          >
            <span className="nav-icon">
              <span className="fs-24 align-middle">💳</span>
            </span>
            <span className="nav-text">Purchases</span>
          </Link>
        </li>

        {/* Users */}
        <li className="nav-item">
          <Link
            to="/users"
            className={`nav-link ${isActive("/users") ? "active" : ""}`}
          >
            <span className="nav-icon">
              <span className="fs-24 align-middle">👥</span>
            </span>
            <span className="nav-text">Users</span>
          </Link>
        </li>

        {/* Pages */}
        <li className="nav-item">
          <Link
            to="/pages"
            className={`nav-link ${isActive("/pages") ? "active" : ""}`}
          >
            <span className="nav-icon">
              <span className="fs-24 align-middle">📝</span>
            </span>
            <span className="nav-text">Pages</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SidebarMenu;
