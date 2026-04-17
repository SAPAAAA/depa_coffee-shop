// src/layouts/ProtectedLayout/ProtectedLayout.tsx
import { Outlet } from "react-router";
import RequireAuth from "@/features/auth/components/RequireAuth";

interface ProtectedLayoutProps {
  allowedRoles?: string[];
}

const ProtectedLayout = ({ allowedRoles }: Readonly<ProtectedLayoutProps>) => {
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <Outlet />
    </RequireAuth>
  );
}

export default ProtectedLayout;