import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo/logo.png";
import { useCart } from "../hooks/useCart";

const NavItems = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [cartBadgeAnimation, setCartBadgeAnimation] = useState(false);
  const { cartCount } = useCart();

  // Animate cart badge when count changes
  React.useEffect(() => {
    if (cartCount > 0) {
      setCartBadgeAnimation(true);
      const timer = setTimeout(() => setCartBadgeAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // addevent listener
  window.addEventListener("scroll", () => {
    if (window.scroll > 200) {
      setHeaderFixed(true);
    } else {
      setHeaderFixed(false);
    }
  });
  return (
    <>
      {/* CSS for cart badge animation */}
      <style>
        {`
          .cart-badge-animate {
            animation: cartBounce 0.6s ease-in-out;
          }

          @keyframes cartBounce {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.3); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }

          .cart-icon-link {
            text-decoration: none !important;
            color: inherit;
          }

          .cart-icon-link:hover .cart-badge {
            background-color: #dc3545 !important;
          }
        `}
      </style>

      <header
        className={`header-section style-4 ${
          headerFixed ? "header-fixed fadeInUp" : ""
        }`}
      >
      {/* header top start */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {/* Login/signup buttons removed */}
          </div>
        </div>
      </div>

      {/* header bottom */}
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            {/* logo */}
            <div className="logo-search-acte">
              <div className="logo">
                <Link to={"/"}>
                  <img src={logo} alt="" />
                </Link>
              </div>
            </div>

            {/* menu area */}
            <div className="menu-area">
              <div className="menu">
                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                  <li>
                    <Link
                      to="/"
                      className={`text-decoration-none ${
                        !isHomePage && "text-white"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      className={`text-decoration-none ${
                        !isHomePage && "text-white"
                      }`}
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className={`text-decoration-none ${
                        !isHomePage && "text-white"
                      }`}
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className={`text-decoration-none ${
                        !isHomePage && "text-white"
                      }`}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className={`text-decoration-none ${
                        !isHomePage && "text-white"
                      }`}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Cart Icon */}
              <div className="cart-icon-wrapper">
                <Link
                  to="/cart-page"
                  className={`cart-icon-link ${!isHomePage && "text-white"}`}
                  title="View Cart"
                >
                  <div className="cart-icon position-relative">
                    <i className="icofont-shopping-cart fs-4"></i>
                    {cartCount > 0 && (
                      <span
                        className={`cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${cartBadgeAnimation ? 'cart-badge-animate' : ''}`}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: cartBadgeAnimation ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(1)'
                        }}
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                        <span className="visually-hidden">items in cart</span>
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* sign in & log in buttons removed */}

              {/* menu toggler */}
              <div
                onClick={() => setMenuToggle(!menuToggle)}
                className={`header-bar d-lg-none ${menuToggle ? "active" : ""}`}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>

              {/* social toggler */}
              <div
                className="ellepsis-bar d-md-none"
                onClick={() => setSocialToggle(!socialToggle)}
              >
                <i className="icofont-info-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default NavItems;
