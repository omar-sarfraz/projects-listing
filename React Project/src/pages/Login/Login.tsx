import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { encrypt } from "@omar-sarfraz/caesar-cipher";
import { User } from "../SignUp/SignUp";
import bcrypt from "bcryptjs";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { object, string } from "yup";

export type LoginError = {
    type?: "email" | "password";
    message: string;
};

const loginSchema = object().shape({
    email: string().email().required("Email is required."),
    password: string().required("Please enter your password."),
});

export default function Login() {
    const [email, setEmail] = useState<string>("omar@gmail.com");
    const [password, setPassword] = useState<string>("12345678");
    const [error, setError] = useState<LoginError>({ type: undefined, message: "" });
    const { setUser } = useAuth();
    const { toast } = useToast();

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError({ type: undefined, message: "" });

        try {
            await loginSchema.validate({ email, password }, { abortEarly: false });

            const key = parseInt(import.meta.env.VITE_CIPHER_KEY);

            if (!key) {
                toast("An error has occured. Please try again after some time.", "error");
                return;
            }

            const encryptedEmail = encrypt(key, email);

            let existingUser = localStorage.getItem(encryptedEmail);
            if (!existingUser) {
                toast("Email or Password is Incorrect", "error");
                return;
            }

            let existingUserData: User = JSON.parse(existingUser);
            let match = await bcrypt.compare(password, existingUserData.password);

            if (match) {
                setUser(existingUserData);
                toast("Login Successfull", "success");
                localStorage.setItem("user", JSON.stringify(existingUserData));
                navigate("/", { replace: true });
            } else {
                toast("Email or Password is Incorrect", "error");
            }
        } catch (e: any) {
            const firstError = e.inner[0];
            setError({ type: firstError.path, message: firstError.errors[0] });
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
