import { MouseEventHandler } from "react";

type ButtonProps = {
    text: string;
    handleClick: MouseEventHandler;
};

export default function Button({ text, handleClick }: ButtonProps) {
    return (
        <button
            className="bg-emerald-500 text-white w-full py-2 text-xl font-medium rounded-md"
            onClick={handleClick}
        >
            {text}
        </button>
    );
}
