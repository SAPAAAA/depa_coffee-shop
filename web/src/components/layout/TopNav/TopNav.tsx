import { memo } from "react";
import { NavLink } from "react-router";

import "./TopNav.css";

interface TopNavProps {}

const TABS = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const TopNav = memo(({}: Readonly<TopNavProps>) => {
    return (
    <nav className="nav">
      <ul className="nav-list">
        {
          TABS.map((tab) => {
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
            )
          })
        }
      </ul>
    </nav>
  );
});

export default TopNav;