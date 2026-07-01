import {
    createBrowserRouter,
} from "react-router-dom";

import Login from "../features/auth/components/LoginForm";
import Register from "../features/auth/components/RegisterForm";
import Home from "../features/home/pages/Home";
import Landing from "../features/auth/pages/LandingPage";
import ProductList from "../features/home/pages/ProductList";
import ExtraHome from "../features/home/pages/ExtraHome";
import Dashboard from "../features/home/pages/Dashboard";
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
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/products",
        element: <ProductList />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/staff",
        element: <StaffList />,
    },
    {
        path: "/ExtraHome",
        element: <ExtraHome />,
    }

]);