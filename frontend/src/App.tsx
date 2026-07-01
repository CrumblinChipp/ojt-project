import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./features/home/pages/ExtraHome";
import Dashboard from "./features/home/pages/Dashboard";
import ProductList from "./features/home/pages/ProductList";
import StaffList from "./features/home/pages/StaffList";

const App: React.FC = () => {
  const handleLogout = () => {
    // TODO: clear auth state / tokens, then redirect to login
    console.log("logging out...");
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen w-full items-center justify-center bg-neutral-200 p-4">
        <Routes>
          <Route element={<MainLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/staff" element={<StaffList />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;