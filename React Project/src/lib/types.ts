export type SignUpError = {
    type?: "firstName" | "lastName" | "email" | "password" | "confirmPassword";
    message: string;
};

export type LoginError = {
    type?: "email" | "password";
    message: string;
};

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
};

export type Project = {
    ProjectId: number;
    Name: string;
    Budget: string;
    Timeline: string;
    Description: string;
};
