import React from "react";
import Login from "../Login";

const ProtectedRoute = ({ Component, ...props }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    isAuthenticated ? <Component {...props} /> : <Login />
  );
};

export default ProtectedRoute;
