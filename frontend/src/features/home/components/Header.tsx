import React from "react";

interface HeaderProps {
  /** Title of the currently active section, e.g. "Product List" */
  title: string;
  /** Called when the user clicks "Log Out" */
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  return (
    <header className="flex h-20 w-full items-center justify-between bg-neutral-800 px-8 shrink-0">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-md bg-red-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
      >
        Log Out
      </button>
    </header>
  );
};

export default Header;