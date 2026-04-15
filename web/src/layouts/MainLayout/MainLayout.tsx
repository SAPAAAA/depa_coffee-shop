import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router";
import "./MainLayout.css";
import Sidebar from "@/components/layout/CartSidebar";
import CartSidebarProvider from "@/providers/CartSidebarProvider";

const MainLayout = () => {
  return (
    <CartSidebarProvider>
      <div className="main-layout">
        <Header />
        <Outlet />
        <Sidebar />
      </div>
    </CartSidebarProvider>
  );
};

export default MainLayout;
