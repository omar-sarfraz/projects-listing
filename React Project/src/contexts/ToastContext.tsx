import React, { createContext, useEffect, useRef, useState } from "react";

type MessageVariant = undefined | "success" | "error";
type Color = "black" | "green-500" | "red-500";

export const ToastContext = createContext<{
    showToast: boolean;
    toastMessage: string;
    displayToastMessage: Function;
    color: Color;
}>({
    showToast: false,
    toastMessage: "",
    displayToastMessage: () => {},
    color: "black",
});

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [type, setType] = useState<MessageVariant>();
    const [color, setColor] = useState<Color>("black");
    const toastRef = useRef<number>();

    useEffect(() => {
        let typeColor: Color = "black";
        if (type === "success") typeColor = "green-500";
        else if (type === "error") typeColor = "red-500";
        setColor(typeColor);
    }, [type]);

    const displayToastMessage = (message: string, type: MessageVariant) => {
        if (toastRef.current) clearTimeout(toastRef.current);

        setShowToast(true);
        setToastMessage(message);
        setType(type ?? undefined);

        toastRef.current = setTimeout(() => {
            setShowToast(false);
            setToastMessage("");
            setType(undefined);
        }, 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast, toastMessage, displayToastMessage, color }}>
            {children}
        </ToastContext.Provider>
    );
}
