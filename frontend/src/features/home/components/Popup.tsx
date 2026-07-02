import React from "react";

interface PopupProps {
    message: React.ReactNode;
    onClose: () => void;
    confirmationLogic?: () => Promise<void> | void;
    borderColorClass?: string;
}

export default function Popup({
    message,
    onClose,
    confirmationLogic,
    borderColorClass = "border-blue-500",
}: PopupProps) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className={`relative w-full max-w-md rounded-xl p-8 bg-gray-200 border-2 shadow-2xl ${borderColorClass}`}>
                
                {/* Content */}
                <div className="mb-8">
                    {message}
                </div>

                {/* Button Container */}
                <div className="flex gap-4">
                    <button
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                        onClick={async () => {
                            if (confirmationLogic) {
                                await confirmationLogic();
                            }

                            console.log("Confirmed!");
                            onClose();
                        }}
                    >
                        Confirm
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}