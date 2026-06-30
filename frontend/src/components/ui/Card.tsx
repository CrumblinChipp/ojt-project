import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
};

export default function Card({
    children,
}: CardProps) {
    return (
        <div
            className="
                w-full
                max-w-md
                rounded-xl
                p-8
            "
        >
            {children}
        </div>
    );
}