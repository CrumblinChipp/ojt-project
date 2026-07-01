import React from "react";

interface actionCardProps {
    children: React.ReactNode;
    onClose: () => void;
    borderColorClass?: string;
}

export default function actionCard({
    children,
    onClose = () => {},
    borderColorClass = "border-blue-500",
}: actionCardProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            
            <div
                className={`
                    relative
                    w-full
                    max-w-md
                    rounded-xl
                    p-8
                    bg-gray-200
                    border-2
                    shadow-2xl
                    ${borderColorClass}
                `}
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Close modal"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" 
                        />
                    </svg>
                </button>

                {children}
            </div>
        </div>
    );
}