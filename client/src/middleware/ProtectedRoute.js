import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = localStorage.getItem('role');

  if (role !== allowedRole) {
    alert('You are not authorized to access this page: ' + role);
    return <Navigate to="/error" />;
  }

  return children;
};

export default ProtectedRoute;
