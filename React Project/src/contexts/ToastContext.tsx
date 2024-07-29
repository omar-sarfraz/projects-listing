import React, { createContext, useState } from "react";

export const ToastContext = createContext<{
    showToast: boolean;
    toastMessage: string;
    displayToastMessage: Function;
}>({
    showToast: false,
    toastMessage: "",
    displayToastMessage: () => {},
});

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const displayToastMessage = (message: string) => {
        setShowToast(true);
        setToastMessage(message);

        setTimeout(() => {
            setShowToast(false);
            setToastMessage("");
        }, 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast, toastMessage, displayToastMessage }}>
            {children}
        </ToastContext.Provider>
    );
}
