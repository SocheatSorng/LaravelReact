import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic will be added later
  };

  return (
    <div className="d-flex flex-column h-100 p-3">
      <div className="d-flex flex-column flex-grow-1">
        <div className="row h-100">
          <div className="col-xxl-7">
            <div className="row justify-content-center h-100">
              <div className="col-lg-6 py-lg-5">
                <div className="d-flex flex-column h-100 justify-content-center">
                  <div className="auth-logo mb-4">
                    <Link to="/" className="logo-dark">
                      <img src="/assets/images/logo-dark.png" height="24" alt="logo dark" />
                    </Link>
                    <Link to="/" className="logo-light">
                      <img src="/assets/images/logo-light.png" height="24" alt="logo light" />
                    </Link>
                  </div>

                  <h2 className="fw-bold fs-24">Sign In</h2>
                  <p className="text-muted mt-1 mb-4">
                    Enter your email address and password to access admin panel.
                  </p>

                  <div className="mb-5">
                    <form onSubmit={handleSubmit} className="authentication-form">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="mb-3">
                        <Link to="/reset-password" className="float-end text-muted text-unline-dashed ms-1">
                          Reset password
                        </Link>
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="Enter your password"
                        />
                      </div>

                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkbox-signin"
                          />
                          <label className="form-check-label" htmlFor="checkbox-signin">
                            Remember me
                          </label>
                        </div>
                      </div>

                      <div className="mb-1 text-center d-grid">
                        <button className="btn btn-soft-primary" type="submit">
                          Sign In
                        </button>
                      </div>
                    </form>

                    <p className="mt-3 fw-semibold no-span">OR sign with</p>

                    <div className="d-grid gap-2">
                      <button className="btn btn-soft-dark">
                        <i className="bx bxl-google fs-20 me-1"></i> Sign in with Google
                      </button>
                      <button className="btn btn-soft-primary">
                        <i className="bx bxl-facebook fs-20 me-1"></i> Sign in with Facebook
                      </button>
                    </div>
                  </div>

                  <p className="text-danger text-center">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-dark fw-bold ms-1">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-5 d-none d-xxl-flex">
            <div className="card h-100 mb-0 overflow-hidden">
              <div className="d-flex flex-column h-100">
                <img src="/assets/images/small/img-10.jpg" alt="" className="w-100 h-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;