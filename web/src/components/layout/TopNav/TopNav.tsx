import { memo } from "react";
import { NavLink } from "react-router";

import "./TopNav.css";
import useCartSidebar from "@/hooks/useCartSidebar";

interface TopNavProps {}

const TABS = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const TopNav = memo(({}: Readonly<TopNavProps>) => {
  const { openSidebar } = useCartSidebar();

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
      </ul>
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
    </nav>
  );
});

export default TopNav;
