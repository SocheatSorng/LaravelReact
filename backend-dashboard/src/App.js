import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserMenu from "./components/UserMenu";
import SidebarMenu from "./components/SidebarMenu";
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
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import ViewUser from "./pages/ViewUser";
import TestUser from "./pages/TestUser";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import { checkApiHealth } from "./services/api";
import PageList from "./pages/PageEditor/PageList";
import PageEditor from "./pages/PageEditor";

// API Test Component
function TestAPI() {
  const [testResult, setTestResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [healthCheckResult, setHealthCheckResult] = React.useState(null);

  const testApi = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error("API Test Error:", err);
      setError(
        `Error: ${err.message}. ${
          err.response
            ? "Status: " +
              err.response.status +
              ", Data: " +
              JSON.stringify(err.response.data)
            : ""
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await checkApiHealth();
      setHealthCheckResult(result);
      if (!result.success) {
        setError(`API Health Check Failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Health Check Error:", err);
      setError(`Health Check Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>API Connection Test</h2>
      <p>
        Use these tools to check if your React app can connect to the Laravel
        backend API.
      </p>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Direct API Test</div>
            <div className="card-body">
              <button
                className="btn btn-primary mb-3"
                onClick={testApi}
                disabled={isLoading}
              >
                {isLoading ? "Testing..." : "Test Direct API Connection"}
              </button>
              <p className="text-muted small">
                This tests a direct connection to
                http://localhost:8000/api/users without using the configured API
                client.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">API Health Check</div>
            <div className="card-body">
              <button
                className="btn btn-success mb-3"
                onClick={runHealthCheck}
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Run API Health Check"}
              </button>
              <p className="text-muted small">
                This uses the configured API client with all middleware to test
                the API.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {healthCheckResult && (
        <div
          className={`card mb-4 ${
            healthCheckResult.success ? "border-success" : "border-danger"
          }`}
        >
          <div
            className={`card-header ${
              healthCheckResult.success
                ? "bg-success text-white"
                : "bg-danger text-white"
            }`}
          >
            API Health Check Result
          </div>
          <div className="card-body">
            <p>
              <strong>Status:</strong>{" "}
              {healthCheckResult.success ? "Healthy" : "Unhealthy"}
            </p>
            <p>
              <strong>Message:</strong> {healthCheckResult.message}
            </p>
            <p>
              <strong>Endpoint:</strong> {healthCheckResult.endpoint}
            </p>
            {healthCheckResult.pingTime && (
              <p>
                <strong>Response Time:</strong> {healthCheckResult.pingTime}ms
              </p>
            )}
            <pre className="bg-light p-3 mt-3">
              {JSON.stringify(healthCheckResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {testResult && (
        <div className="card">
          <div className="card-header">Direct API Response</div>
          <div className="card-body">
            <pre className="mb-0">{testResult}</pre>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-header">Troubleshooting Steps</div>
        <div className="card-body">
          <ol>
            <li>
              Ensure Laravel backend is running on port 8000 (php artisan serve)
            </li>
            <li>
              Check Laravel CORS configuration to allow requests from
              localhost:3000
            </li>
            <li>Verify network connectivity between frontend and backend</li>
            <li>Check browser console for any CORS or network errors</li>
            <li>
              Ensure API routes are correctly defined in Laravel routes/api.php
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

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
        <Route path="/test-api" element={<TestAPI />} />
        <Route path="/test-user" element={<TestUser />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
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
                      <Route
                        path="orders/checkout"
                        element={<OrderCheckout />}
                      />
                      <Route path="products" element={<Products />} />
                      <Route path="products/:id/edit" element={<EditBook />} />
                      <Route path="products/:id/edit-detail" element={<EditBookDetail />} />
                      <Route path="purchases" element={<Purchases />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="books" element={<BookDetail />} />
                      <Route path="books/create" element={<CreateBook />} />
                      <Route path="books/:id/edit" element={<EditBook />} />
                      <Route path="books/:id" element={<BookDetail />} />
                      <Route
                        path="books/:id/edit-detail"
                        element={<EditBookDetail />}
                      />
                      <Route path="users" element={<Users />} />
                      <Route path="users/create" element={<CreateUser />} />
                      <Route path="users/:id/edit" element={<EditUser />} />
                      <Route path="users/:id" element={<ViewUser />} />
                      <Route path="pages" element={<PageList />} />
                      <Route path="pages/new" element={<PageEditor />} />
                      <Route path="pages/edit/:slug" element={<PageEditor />} />
                      <Route path="pages/frontend/:page" element={<PageEditor frontendEdit={true} />} />
                    </Routes>
                  </div>
                </div>
                <Footer />
              </div>
            </ProtectedRoute>
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
