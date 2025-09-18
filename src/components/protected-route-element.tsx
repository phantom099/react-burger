import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteElementProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

function isAuthenticated() {
  // Проверка наличия accessToken в localStorage
  return Boolean(localStorage.getItem("accessToken"));
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({ onlyUnAuth = false, children }) => {
  const location = useLocation();
  const authed = isAuthenticated();

  if (!authed && !onlyUnAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (authed && onlyUnAuth) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRouteElement;
