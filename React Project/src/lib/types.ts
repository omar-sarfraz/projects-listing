export type SignUpError = {
    type?: "firstName" | "lastName" | "email" | "password" | "confirmPassword";
    message: string;
};

export type LoginError = {
    type?: "email" | "password";
    message: string;
};

export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    token?: string;
};

export type Bid = {
    id: number;
    budget: string;
    deadline: string;
    description: string;
    user?: User;
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
