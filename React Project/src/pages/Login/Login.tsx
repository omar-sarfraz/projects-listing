import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { encrypt } from "@omar-sarfraz/caesar-cipher";
import { User } from "../SignUp/SignUp";
import bcrypt from "bcryptjs";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export type LoginError = {
    type: "" | "EMAIL" | "PASSWORD";
    message: string;
};

export default function Login() {
    const [email, setEmail] = useState<string>("omar@gmail.com");
    const [password, setPassword] = useState<string>("12345678");
    const [error, setError] = useState<LoginError>({ type: "", message: "" });
    const { setUser } = useAuth();
    const { displayToastMessage } = useToast();

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError({ type: "", message: "" });

        if (!email) {
            setError({ type: "EMAIL", message: "Email is required!" });
            return;
        }

        if (!password) {
            setError({ type: "PASSWORD", message: "Password is required!" });
            return;
        }

        const key = parseInt(import.meta.env.VITE_CIPHER_KEY);

        if (!key) {
            displayToastMessage("An error has occured. Please try again after some time.", "error");
            return;
        }

        const encryptedEmail = encrypt(key, email);

        let existingUser = localStorage.getItem(encryptedEmail);
        if (!existingUser) {
            displayToastMessage("Email or Password is Incorrect", "error");
            return;
        }

        let existingUserData: User = JSON.parse(existingUser);
        let match = await bcrypt.compare(password, existingUserData.password);

        if (match) {
            setUser(existingUserData);
            displayToastMessage("Login Successfull", "success");
            localStorage.setItem("user", JSON.stringify(existingUserData));
            navigate("/", { replace: true });
        } else {
            displayToastMessage("Email or Password is Incorrect", "error");
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="bg-gray-100 px-10 py-10 rounded-md md:w-1/2 w-full">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-medium mb-2">Login</h2>
                    <p>Login to access thousands of projects</p>
                </div>
                <div className="my-10">
                    <TextField
                        currentValue={email}
                        setCurrentValue={setEmail}
                        type="email"
                        placeholder="johndoe@gmail.com"
                        error={error}
                        label="Email"
                        errorType="EMAIL"
                    />
                    <TextField
                        currentValue={password}
                        setCurrentValue={setPassword}
                        type="password"
                        placeholder="Password"
                        error={error}
                        label="Password"
                        errorType="PASSWORD"
                    />
                    <div className="mt-4">
                        <div className="text-end">
                            Don't have an account?{" "}
                            <Link to="/sign-up" className="font-semibold">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
                <Button text="Login" handleClick={handleLogin} />
            </div>
        </div>
    );
}
