import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { object, string, ref } from "yup";

import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useToast } from "../../contexts/ToastContext";
import axiosInstance from "../../lib/axios";
import { AxiosResponse } from "axios";

export type SignUpError = {
    type?: "firstName" | "lastName" | "email" | "password" | "confirmPassword";
    message: string;
};

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

let userSchema = object().shape({
    firstName: string().required("First Name is required."),
    lastName: string().required("Last Name is required."),
    email: string().email().required("Email is required."),
    password: string()
        .required("Please enter your password.")
        .min(8, "Your password must be at least 8 characters long."),
    confirmPassword: string()
        .required("Please retype your password.")
        .oneOf([ref("password")], "Your passwords do not match."),
});

export default function SignUp() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<SignUpError>({ type: undefined, message: "" });

    const { toast } = useToast();

    const navigate = useNavigate();

    const handleSignUp = async () => {
        setError({ type: undefined, message: "" });

        try {
            await userSchema.validate(
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                },
                { abortEarly: false }
            );
        } catch (e: any) {
            const firstError = e.inner[0];
            setError({ type: firstError.path, message: firstError.errors[0] });
            return;
        }

        try {
            let userData: User = {
                firstName,
                lastName,
                email,
                password,
            };

            let response: AxiosResponse = await axiosInstance.post("/signup", userData);
            if (response.status === 200) {
                toast("Account registered successfully", "success");
                navigate("/login");
            } else {
                toast(response.data?.message || "An error has occurred", "error");
            }
        } catch (e: any) {
            toast(e?.response?.data?.message || "An error has occurred", "error");
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-gray-100 px-10 py-10 rounded-md md:w-1/2 w-full">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-medium mb-2">SignUp</h2>
                    <p>SignUp to access thousands of projects</p>
                </div>
                <div className="my-10">
                    <TextField
                        currentValue={firstName}
                        setCurrentValue={setFirstName}
                        type="text"
                        placeholder="John"
                        error={error}
                        label="First Name"
                        errorType="firstName"
                    />
                    <TextField
                        currentValue={lastName}
                        setCurrentValue={setLastName}
                        type="text"
                        placeholder="Doe"
                        error={error}
                        label="Last Name"
                        errorType="lastName"
                    />
                    <TextField
                        currentValue={email}
                        setCurrentValue={setEmail}
                        type="email"
                        placeholder="johndoe@gmail.com"
                        error={error}
                        label="Email"
                        errorType="email"
                    />
                    <TextField
                        currentValue={password}
                        setCurrentValue={setPassword}
                        type="password"
                        placeholder="Password"
                        error={error}
                        label="Password"
                        errorType="password"
                    />
                    <TextField
                        currentValue={confirmPassword}
                        setCurrentValue={setConfirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        error={error}
                        label="Confirm Password"
                        errorType="confirmPassword"
                    />
                    <div className="mt-4">
                        <div className="text-end">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                <Button text="SignUp" handleClick={handleSignUp} />
            </div>
        </div>
    );
}
