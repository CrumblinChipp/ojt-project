type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit";
    onClick?: () => void;
};

export default function Button({
    children,
    type = "button",
    onClick,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="
                w-full
                rounded-lg
                bg-gray-900
                px-4
                py-3
                font-semibold
                text-white
                transition
                hover:bg-gray-700
            "
        >
            {children}
        </button>
    );
}