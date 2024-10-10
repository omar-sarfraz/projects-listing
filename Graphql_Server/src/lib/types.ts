export type ContextType = {
    user: {
        error: boolean;
        data: {
            role: "CLIENT" | "FREELANCER";
            id: number;
            projectIds?: number[];
            bidIds?: number[];
        };
    };
};

export type MessageType = {
    id: number;
    text: string;
    projectId: number;
    userId: number;
};

export type ProjectType = {
    id: number;
    name: string;
    budget: number;
    deadline: string;
    description: string;
    userId: number;
    acceptedBid: number;
};
