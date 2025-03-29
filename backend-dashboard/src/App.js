import React from 'react';
import './App.css';
import UserMenu from './components/UserMenu';
import SidebarMenu from './components/SidebarMenu';
import Dashboard from './components/Dashboard';

function App() {
  // Add CSS and JS files from public folder
  React.useEffect(() => {
    // Add vendor CSS
    const linkVendor = document.createElement('link');
    linkVendor.href = `${process.env.PUBLIC_URL}/assets/css/vendor.min.css`;
    linkVendor.rel = 'stylesheet';
    document.head.appendChild(linkVendor);

    // Add app CSS  
    const linkApp = document.createElement('link');
    linkApp.href = `${process.env.PUBLIC_URL}/assets/css/app.min.css`;
    linkApp.rel = 'stylesheet';
    document.head.appendChild(linkApp);

    // Remove links on unmount
    return () => {
      document.head.removeChild(linkVendor);
      document.head.removeChild(linkApp);
    };
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />
      <PageContent />
    </div>
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
                <i className="solar:hamburger-menu-broken fs-24 align-middle"></i>
              </button>
            </div>
            <div className="topbar-item">
              <h4 className="fw-bold topbar-button pe-none text-uppercase mb-0">Welcome!</h4>
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
            src={`${process.env.PUBLIC_URL}/assets/images/logo-sm.png`}
            className="logo-sm" 
            alt="logo sm" 
          />
          <img 
            src={`${process.env.PUBLIC_URL}/assets/images/logo-dark.png`}
            className="logo-lg"
            alt="logo dark"
          />
        </a>
      </div>
      <SidebarMenu />
    </div>
  );
}

// Page Content Component
function PageContent() {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <Dashboard />
        </div>
      </div>
      <Footer />
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