import useAuth from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const RequireAuth = ({ children, allowedRoles }: Readonly<RequireAuthProps>) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  }

  if (user.role === "customer" && allowedRoles && !allowedRoles.includes("customer")) {
    return (
      <Navigate to="/login" replace />
    )
  }

  if (user.role === "barista" && allowedRoles && !allowedRoles.includes("barista")) {
    return (
      <Navigate to="/barista" replace />
    )
  }

  if (user.role === "admin" && allowedRoles && !allowedRoles.includes("admin")) {
    return (
      <Navigate to="/admin" replace />
    )
  }

  return <>{children}</>;
}

export default RequireAuth;