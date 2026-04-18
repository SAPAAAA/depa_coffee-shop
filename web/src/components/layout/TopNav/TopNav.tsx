import { memo, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";

import "./TopNav.css";
import useCartSidebar from "@/hooks/useCartSidebar";
import useAuth from "@/hooks/useAuth";

interface TopNavProps {}

const TABS = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const TopNav = memo(({}: Readonly<TopNavProps>) => {
  const navigate = useNavigate();
  const { openSidebar } = useCartSidebar();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <ul className="nav-list">
        {TABS.map((tab) => {
          return (
            <li key={tab.path} className="nav-item">
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {tab.name}
              </NavLink>
            </li>
          );
        })}
        {/* Kiểm tra nếu là barista thì hiển thị thêm tab Order */}
        {user?.role === "barista" && (
          <li className="nav-item">
            <NavLink
              to="/barista"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Order
            </NavLink>
          </li>
        )}
      </ul>

      {/* Cart icon for logged in users */}
      {user && (
        <div className="nav-cart">
          <button
            className="cart-button"
            type="button"
            aria-label="Open cart"
            onClick={() => openSidebar()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M5.929 1.757a.5.5 0 1 0-.858-.514L2.217 6H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.623l1.844 6.456A.75.75 0 0 0 3.69 15h8.622a.75.75 0 0 0 .722-.544L14.877 8h.623a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.717L10.93 1.243a.5.5 0 1 0-.858.514L12.617 6H3.383zM4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm4-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1" />
            </svg>
          </button>
        </div>
      )}

      {/* User menu */}
      <div className="nav-user">
        {user ? (
          <div className="user-menu-container">
            <button
              className="user-icon-btn"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="User menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <span className="user-dropdown-name">
                    Hello, {user.firstName || "User"}!
                  </span>
                </div>
                <button className="user-dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
});

export default TopNav;
