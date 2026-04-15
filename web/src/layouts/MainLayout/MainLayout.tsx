import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
