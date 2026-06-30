import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export default function Input({
    label,
    error,
    id,
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="text-sm font-medium text-slate-900"
            >
                {label}
            </label>

            <input
                id={id}
                {...props}
                className="
                    w-full
                    rounded-lg
                    border
                    border-slate-900
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-gray-500
                    focus:ring-2
                    focus:ring-green-200
                "
            />

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}