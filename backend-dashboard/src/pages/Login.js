import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-5 col-lg-6">
            <div className="card mb-0 border-0 shadow-none">
              <div className="card-body p-4">
                {/* Logo */}
                <div className="text-center mb-4">
                  <Link to="/" className="logo-dark">
                    <img src="/assets/images/logo-dark.png" alt="dark logo" height="24" />
                  </Link>
                </div>

                {/* Title */}
                <h4 className="text-dark-50 text-center mt-0 fw-bold">Sign In</h4>
                <p className="text-muted text-center mb-4">
                  Enter your email address and password to access admin panel.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="emailaddress" className="form-label">Email address</label>
                    <input 
                      className="form-control" 
                      type="email" 
                      id="emailaddress" 
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <a href="#!" className="text-muted float-end">Forgot your password?</a>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      className="form-control"
                      type="password" 
                      id="password" 
                      placeholder="Enter your password"
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                      <label className="form-check-label" htmlFor="checkbox-signin">Remember me</label>
                    </div>
                  </div>

                  <div className="mb-3 text-center d-grid">
                    <button className="btn btn-primary" type="submit">Log In</button>
                  </div>
                </form>

                {/* Social login */}
                <div className="text-center mt-4">
                  <p className="text-muted font-16">Sign in with</p>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-soft-primary">
                      <i className="ri-facebook-circle-fill"></i>
                    </button>
                    <button className="btn btn-soft-danger">
                      <i className="ri-google-fill"></i>
                    </button>
                    <button className="btn btn-soft-info">
                      <i className="ri-twitter-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;