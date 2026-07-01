import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import ProductList from "./ProductList";
import StaffList from "./StaffList";

// Maps each route path to the title shown in the header.
// Add an entry here whenever a new sidebar section is created.
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Product List",
  "/staff": "Staff List",
};

interface MainLayoutProps {
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden rounded-lg border-2 border-blue-500 bg-white">
      <Header title={title} onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Page content is rendered here. Each sidebar section (Dashboard,
            Product List, Staff List, ...) supplies its own routed page
            component, which appears in this container via <Outlet />. */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;