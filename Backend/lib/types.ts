import { Request } from "express";

export type UserType = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "FREELANCER" | "CLIENT";
};

export type ProjectType = {
    id?: number;
    name: string;
    budget: number;
    deadline: string;
    description: string;
    userId: string;
};

export type BidType = {
    id?: number;
    budget: number;
    deadline: string;
    description: string;
    userId: number;
    projectId: number;
};

export interface CustomRequest extends Request {
    user: UserType;
}
