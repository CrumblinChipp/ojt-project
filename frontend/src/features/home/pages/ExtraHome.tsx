import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/home/products": "Product List",
  "/home/staff": "Staff List",
};

interface ExtraHomeProps {
  onLogout?: () => void;
}

const ExtraHome: React.FC<ExtraHomeProps> = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Header title={title} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ExtraHome;