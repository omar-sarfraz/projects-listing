import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type MessageVariant = undefined | "success" | "error";
type Color = "green-500" | "red-500";

type Toast = {
    color: Color;
    type: MessageVariant;
    toastMessage: string;
    showToast: boolean;
};

const ToastContext = createContext<{
    toastState: Toast;
    toast: (message: string, type: MessageVariant) => void;
}>({
    toastState: {
        color: "green-500",
        type: "success",
        toastMessage: "",
        showToast: false,
    },
    toast: () => {},
});

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
    const [toastState, setToastState] = useState<Toast>({
        color: "green-500",
        type: "success",
        toastMessage: "",
        showToast: false,
    });
    const toastRef = useRef<any>();

    const toast = useCallback((message: string, type: MessageVariant) => {
        if (toastRef.current) clearTimeout(toastRef.current);

        let typeColor: Color = "green-500";
        if (type === "error") typeColor = "red-500";
        setToastState({
            showToast: true,
            toastMessage: message,
            color: typeColor,
            type,
        });

        toastRef.current = setTimeout(() => {
            setToastState((prev) => ({
                ...prev,
                showToast: false,
                toastMessage: "",
                type: undefined,
            }));
        }, 4000);
    }, []);

    return <ToastContext.Provider value={{ toastState, toast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
    const context = useContext(ToastContext);
    return { ...context };
}
