import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";

/**
 * ProtectedRoute component to control access to routes that require authentication
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @param {String[]} [props.allowedRoles] - Optional array of roles allowed to access this route
 * @returns {ReactNode} - The protected route component
 */
function ProtectedRoute({ children, allowedRoles }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if user is authenticated
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth && allowedRoles?.length > 0) {
        // If role-based access control is required, check user role
        try {
          const role = authService.getUserRole();
          setUserRole(role);
        } catch (error) {
          console.error("Error getting user role:", error);
          setIsAuthenticated(false);
        }
      }

      setIsChecking(false);
    };

    checkAuthStatus();
  }, [allowedRoles]);

  // Show loading state while checking authentication
  if (isChecking) {
    return <div className="text-center p-5">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles?.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and authorized
  return children;
}

export default ProtectedRoute;
