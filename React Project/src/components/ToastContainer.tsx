import { useToast } from "../contexts/ToastContext";

export default function ToastContainer() {
    const { toastState } = useToast();

    return (
        <div
            className={`bg-white border-2 border-${toastState.color} text-${
                toastState.color
            } rounded-md p-6 w-72 text-wrap fixed top-10 transition-all duration-500 ${
                toastState.showToast ? "right-10" : "-right-full"
            }`}
        >
            {toastState.toastMessage}
        </div>
    );
}
