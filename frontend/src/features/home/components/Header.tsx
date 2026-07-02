import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/services/authService";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="flex h-20 w-full shrink-0 items-center justify-between bg-neutral-800 px-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {title}
            </h1>

            <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
                Log Out
            </button>
        </header>
    );
};

export default Header;