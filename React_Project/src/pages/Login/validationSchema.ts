import { object, string } from "yup";

export const loginSchema = object().shape({
    email: string().email().required("Email is required."),
    password: string().required("Please enter your password."),
});
