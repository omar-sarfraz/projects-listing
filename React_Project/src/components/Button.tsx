import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

export default function Button({ text, ...props }: ButtonProps) {
    return (
        <button
            className="bg-emerald-500 text-white w-full py-2 text-xl font-medium rounded-md"
            {...props}
        >
            {text}
        </button>
    );
}
