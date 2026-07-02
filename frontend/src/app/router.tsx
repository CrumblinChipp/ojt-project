import { createBrowserRouter, Navigate } from "react-router-dom";

import Landing from "../features/auth/pages/LandingPage";
import Login from "../features/auth/components/LoginForm";
import Register from "../features/auth/components/RegisterForm";

import ExtraHome from "../features/home/pages/ExtraHome";
import Dashboard from "../features/home/pages/Dashboard";
import ProductList from "../features/home/pages/ProductList";
import StaffList from "../features/home/pages/StaffList";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },

    // Layout for authenticated pages
    {
        path: "/home",
        element: <ExtraHome />,
        children: [
            {
                index: true,
                element: <Navigate to="/home/dashboard" replace />,
            },
            {
                path: "/home/dashboard",
                element: <Dashboard />,
            },
            {
                path: "products",
                element: <ProductList />,
            },
            {
                path: "staff",
                element: <StaffList />,
            },
        ],
    },
]);