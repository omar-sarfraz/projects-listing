import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export default function ToastContainer() {
    const { toastMessage, showToast } = useContext(ToastContext);

    return (
        <div
            className={`bg-white border-2 border-black rounded-md p-6 w-72 text-wrap fixed top-10 transition-all duration-500 ${
                showToast ? "right-10" : "-right-full"
            }`}
        >
            {toastMessage}
        </div>
    );
}
