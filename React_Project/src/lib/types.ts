export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    id?: number;
    token?: string;
};

export type Bid = {
    id: number;
    budget: string;
    deadline: string;
    description: string;
    user?: User;
    projectId?: number;
};

export type Project = {
    id: number;
    name: string;
    budget: string;
    deadline: string;
    description: string;
    userId?: number;
    acceptedBid?: number;
    bids?: Bid[];
    files?: string[];
};

export type MessageType = {
    id: number;
    text: String;
    projectId: number;
    userId: number;
};

export type ProjectInput = {
    name: string;
    budget: string;
    deadline: string;
    description: string;
    files: FileList | null;
};

export type CreateProject = {
    data: ProjectInput & { user: User | undefined };
    url: string;
    requestOptions?: {
        headers: {
            "Content-Type": string;
        };
    };
};

export type BidInput = {
    budget: string;
    deadline: string;
    description: string;
};

export type CreateBid = {
    data: BidInput & { userId: number | undefined };
    url: string;
};

export type OfflineEventType = {
    id?: number;
    name: "CREATE_PROJECT" | "CREATE_BID";
    payload: CreateProject | CreateBid;
};
