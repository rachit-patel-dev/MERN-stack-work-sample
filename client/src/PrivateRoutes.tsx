import React from 'react';

import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from './Store/store';

export default function PrivateRoutes() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isUserLoggedin,
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
