import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    loading: boolean;
}

export default function Button({ text, loading, ...props }: ButtonProps) {
    return (
        <button
            className={`bg-${
                loading ? "gray" : "emerald"
            }-500 text-white w-full py-2 text-xl font-medium rounded-md`}
            {...props}
            disabled={loading}
        >
            {text}
        </button>
    );
}
