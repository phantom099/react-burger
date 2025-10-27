import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { clearUser } from '../services/userSlice';
import { isTokenExpired } from '../utils/jwt';

interface ProtectedRouteElementProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({ onlyUnAuth = false, children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [authed, setAuthed] = React.useState<boolean>(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    const jwt = token.replace(/^Bearer /, '');
    return !isTokenExpired(jwt);
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAuthed(false);
      return;
    }
    const jwt = token.replace(/^Bearer /, '');
    if (isTokenExpired(jwt)) {
      dispatch(clearUser());
      setAuthed(false);
    } else {
      setAuthed(true);
    }
  }, [dispatch]);

  if (!authed && !onlyUnAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (authed && onlyUnAuth) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRouteElement;
