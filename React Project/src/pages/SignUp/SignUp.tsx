import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useToast } from "../../contexts/ToastContext";
import { SignUpError, User } from "../../lib/types";
import { signUpSchema } from "./validationSchema";
import { USER_ROLES } from "../../lib/utils";
import useAxios from "../../hooks/useAxios";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(USER_ROLES.freelancer);
    const [error, setError] = useState<SignUpError>({ type: undefined, message: "" });

    const { toast } = useToast();
    const axiosInstance = useAxios();

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

            await axiosInstance.post("/signup", userData);
            toast("Account registered successfully", "success");
            navigate("/login");
        } catch (e: any) {
            console.log("Sign up error", e?.response);
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
                        required={true}
                        setCurrentValue={setFirstName}
                        type="text"
                        placeholder="John"
                        error={error}
                        label="First Name"
                        errorType="firstName"
                        vertical={true}
                    />
                    <TextField
                        required={true}
                        setCurrentValue={setLastName}
                        type="text"
                        placeholder="Doe"
                        error={error}
                        label="Last Name"
                        errorType="lastName"
                        vertical={true}
                    />
                    <TextField
                        required={true}
                        setCurrentValue={setEmail}
                        type="email"
                        placeholder="johndoe@gmail.com"
                        error={error}
                        label="Email"
                        errorType="email"
                        vertical={true}
                    />
                    <TextField
                        required={true}
                        setCurrentValue={setPassword}
                        type="password"
                        placeholder="Password"
                        error={error}
                        label="Password"
                        errorType="password"
                        vertical={true}
                    />
                    <TextField
                        required={true}
                        setCurrentValue={setConfirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        error={error}
                        label="Confirm Password"
                        errorType="confirmPassword"
                        vertical={true}
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
