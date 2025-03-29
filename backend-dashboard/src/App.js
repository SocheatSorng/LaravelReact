import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserMenu from "./components/UserMenu";
import SidebarMenu from "./components/SidebarMenu";
import Dashboard from "./components/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./components/orders/OrderDetails";
import OrderCart from "./components/orders/OrderCart";
import OrderCheckout from "./components/orders/OrderCheckout";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";
import BookDetail from "./pages/BookDetail";
import CreateBook from "./pages/CreateBook";
import EditBook from "./pages/EditBook";
import EditBookDetail from "./pages/EditBookDetail";
import Login from "./pages/Login";
import Users from './pages/Users';

function App() {
  // Add CSS files from public folder
  React.useEffect(() => {
    // Add vendor CSS
    const linkVendor = document.createElement("link");
    linkVendor.href = "/assets/css/vendor.min.css";
    linkVendor.rel = "stylesheet";
    document.head.appendChild(linkVendor);

    // Add app CSS
    const linkApp = document.createElement("link");
    linkApp.href = "/assets/css/app.min.css";
    linkApp.rel = "stylesheet";
    document.head.appendChild(linkApp);

    // Remove links on unmount
    return () => {
      document.head.removeChild(linkVendor);
      document.head.removeChild(linkApp);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <div className="wrapper">
              <Header />
              <Sidebar />
              <div className="page-content">
                <div className="container-fluid">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/details" element={<OrderDetails />} />
                    <Route path="orders/cart" element={<OrderCart />} />
                    <Route path="orders/checkout" element={<OrderCheckout />} />
                    <Route path="products" element={<Products />} />
                    <Route path="purchases" element={<Purchases />} />
                    <Route path="books" element={<BookDetail />} />
                    <Route path="books/create" element={<CreateBook />} />
                    <Route path="books/:id/edit" element={<EditBook />} />
                    <Route path="books/:id" element={<BookDetail />} />
                    <Route
                      path="books/:id/edit-detail"
                      element={<EditBookDetail />}
                    />
                    <Route path="users" element={<Users />} />
                  </Routes>
                </div>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

// Header Component
function Header() {
  return (
    <header className="topbar">
      <div className="container-fluid">
        <div className="navbar-header">
          <div className="d-flex align-items-center">
            <div className="topbar-item">
              <button type="button" className="button-toggle-menu me-2">
                <span className="fs-24 align-middle">☰</span>
              </button>
            </div>
            <div className="topbar-item">
              <h4 className="fw-bold topbar-button pe-none text-uppercase mb-0">
                Welcome!
              </h4>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

// Sidebar Component
function Sidebar() {
  return (
    <div className="main-nav">
      <div className="logo-box">
        <a href="/" className="logo-dark">
          <img
            src="/assets/images/logo-sm.png"
            className="logo-sm"
            alt="logo sm"
          />
          <img
            src="/assets/images/logo-dark.png"
            className="logo-lg"
            alt="logo dark"
          />
        </a>
      </div>
      <SidebarMenu />
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            {new Date().getFullYear()} © Larkon. Crafted with ♥ by Techzaa
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
