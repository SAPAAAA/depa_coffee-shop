import { memo } from "react";
import "./Header.css";
import { TopNav } from "@/components/layout/TopNav";

interface HeaderProps {}

const Header = memo(({}: Readonly<HeaderProps>) => {
  return (
    <header className="header">
      <div className="header-content">
        <img src="/src/assets/logo.png" alt="Coffee Shop Logo" className="header-logo" />
        <TopNav />
      </div>
    </header>
  );
});

export default Header;
