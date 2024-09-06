export type ContextType = {
    user: {
        error: boolean;
        data: {
            role: "CLIENT" | "FREELANCER";
            id: number;
        };
    };
};

export type MessageType = {
    id: number;
    text: String;
    projectId: number;
    userId: number;
};
