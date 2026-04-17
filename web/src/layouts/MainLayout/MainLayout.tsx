import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router";
import "./MainLayout.css";
import Sidebar from "@/components/layout/CartSidebar";
import CartSidebarProvider from "@/providers/CartSidebarProvider";
import useAuth from "@/hooks/useAuth";

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <CartSidebarProvider>
      <div className="main-layout">
        <Header />
        <Outlet />
        {/* Only render the actual sidebar drawer if the user is logged in */}
        {user && <Sidebar />}
      </div>
    </CartSidebarProvider>
  );
};

export default MainLayout;
