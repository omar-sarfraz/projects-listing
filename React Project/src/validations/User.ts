import { object, string, ref, mixed } from "yup";
import { USER_ROLES } from "../lib/utils";

export const loginSchema = object().shape({
    email: string().email().required("Email is required."),
    password: string().required("Please enter your password."),
});

export const signUpSchema = object().shape({
    firstName: string().required("First Name is required."),
    lastName: string().required("Last Name is required."),
    email: string().email().required("Email is required."),
    password: string()
        .required("Please enter your password.")
        .min(8, "Your password must be at least 8 characters long."),
    confirmPassword: string()
        .required("Please retype your password.")
        .oneOf([ref("password")], "Your passwords do not match."),
    role: mixed().oneOf([USER_ROLES.freelancer, USER_ROLES.clint]).required("Role is required. yo"),
});
