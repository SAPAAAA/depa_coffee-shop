import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
