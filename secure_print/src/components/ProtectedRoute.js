import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils';

const ProtectedRoute = ({ Component, ...props }) =>
  getSession() ? <Component {...props} /> : <Navigate to='/login' replace />;

export default ProtectedRoute;
