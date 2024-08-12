import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthTextField from "../../components/AuthTextField";
import Button from "../../components/Button";
import { useToast } from "../../contexts/ToastContext";
import axiosInstance from "../../lib/axios";
import { AxiosResponse } from "axios";
import { SignUpError, User } from "../../lib/types";
import { signUpSchema } from "../../validations/User";
import { USER_ROLES } from "../../lib/utils";

export default function SignUp() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<string>(USER_ROLES.freelancer);
    const [error, setError] = useState<SignUpError>({ type: undefined, message: "" });

    const { toast } = useToast();

    const navigate = useNavigate();

    const handleSignUp = async () => {
        setError({ type: undefined, message: "" });

        try {
            await signUpSchema.validate(
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                    role,
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
                role,
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
                    <AuthTextField
                        currentValue={firstName}
                        setCurrentValue={setFirstName}
                        type="text"
                        placeholder="John"
                        error={error}
                        label="First Name"
                        errorType="firstName"
                    />
                    <AuthTextField
                        currentValue={lastName}
                        setCurrentValue={setLastName}
                        type="text"
                        placeholder="Doe"
                        error={error}
                        label="Last Name"
                        errorType="lastName"
                    />
                    <AuthTextField
                        currentValue={email}
                        setCurrentValue={setEmail}
                        type="email"
                        placeholder="johndoe@gmail.com"
                        error={error}
                        label="Email"
                        errorType="email"
                    />
                    <AuthTextField
                        currentValue={password}
                        setCurrentValue={setPassword}
                        type="password"
                        placeholder="Password"
                        error={error}
                        label="Password"
                        errorType="password"
                    />
                    <AuthTextField
                        currentValue={confirmPassword}
                        setCurrentValue={setConfirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        error={error}
                        label="Confirm Password"
                        errorType="confirmPassword"
                    />
                    <div className="flex flex-col gap-1 mt-3">
                        <label className="text-xl">Sign Up As</label>
                        <select
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-2 py-3 rounded-md"
                        >
                            <option value={USER_ROLES.freelancer}>Freelancer</option>
                            <option value={USER_ROLES.client}>Client</option>
                        </select>
                    </div>
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
