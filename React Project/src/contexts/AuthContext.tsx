import React, { createContext, useState } from "react";
import { User } from "../pages/SignUp/SignUp";

export const AuthContext = createContext<{ user: User | undefined; setUser: Function }>({
    user: undefined,
    setUser: () => {},
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | undefined>();

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
