import React from "react";
import { NavLink } from "react-router-dom";
import type { NavItem } from "../../auth/types";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Product List", path: "/products" },
  { label: "Staff List", path: "/staff" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-neutral-900 py-8">
      <nav className="flex flex-col gap-6 px-8">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "text-left text-base transition-colors",
                isActive
                  ? "font-semibold text-white"
                  : "text-neutral-400 hover:text-neutral-200",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;