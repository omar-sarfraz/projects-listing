import { Context } from "graphql-ws/lib/server";

export const verifyUser = async (token: string) => {
    try {
        const response = await fetch("http://localhost:5000/users/verify", {
            method: "POST",
            headers: { authorization: "Bearer " + token },
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Verification failed:", error);
        throw error;
    }
};

export const getUser = async (context: Context) => {
    try {
        const authHeader: string | undefined = context.connectionParams?.Authorization as
            | string
            | undefined;

        if (!authHeader) throw new Error("Auth token is required!");
        const token: string = authHeader.split(" ")[1];
        if (!token) throw new Error("Missing Token!");

        const data = await verifyUser(token);
        return data;
    } catch (error: any) {
        return null;
    }
};

export const channels = {
    PROJECT_UPDATE: "project_update",
};

export const events = {
    BID_UPDATE: "bid_update",
    BID_CREATE: "bid_create",
};
