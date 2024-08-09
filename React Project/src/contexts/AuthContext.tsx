import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../lib/types";

const AuthContext = createContext<{
    user: User | undefined;
    setUser: Function;
    loading: boolean;
    setLoading: Function;
}>({
    user: undefined,
    setUser: () => {},
    loading: true,
    setLoading: () => {},
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const localUser = localStorage.getItem("user");

        if (localUser) {
            const userData: User | undefined = JSON.parse(localUser);
            setUser(userData);
        }

        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    return { ...context };
}
