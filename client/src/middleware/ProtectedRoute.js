import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = sessionStorage.getItem('role');

  if (role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
