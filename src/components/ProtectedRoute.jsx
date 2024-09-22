import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to the appropriate dashboard if authenticated and trying to access login or root page
  React.useEffect(() => {
    if (token && (location.pathname === '/' || location.pathname === '/login')) {
      if (role === 'attorney') {
        navigate('/attDash');
      } else if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'expert') {
        navigate('/expDash');
      } else if (role === 'super_admin') {
        navigate('/superAdmin/dashboard');
      } else {
        navigate('/404'); // Redirect to 404 if role is not recognized
      }
    }
  }, [token, role, location.pathname, navigate]);

  // If authenticated and role is not allowed, redirect to 404
  if (token && !allowedRoles.includes(role) && location.pathname !== '/login') {
    return <Navigate to="/404" />;
  }

  // If not authenticated, redirect to login unless already on login page
  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;
