import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { AxiosResponse } from "axios";
import { LoginError } from "../../lib/types";
import { loginSchema } from "./validationSchema";
import useAxios from "../../hooks/useAxios";

export default function Login() {
    const [email, setEmail] = useState("test@gmail.com");
    const [password, setPassword] = useState("12345678");
    const [error, setError] = useState<LoginError>({ type: undefined, message: "" });

    const { setUser } = useAuth();
    const { toast } = useToast();
    const axiosInstance = useAxios();

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError({ type: undefined, message: "" });

        try {
            await loginSchema.validate({ email, password }, { abortEarly: false });
        } catch (e: any) {
            const firstError = e.inner[0];
            setError({ type: firstError.path, message: firstError.errors[0] });
            return;
        }

        try {
            let response: AxiosResponse = await axiosInstance.post("/login", { email, password });

            const user = { ...response.data.user, token: response.data.token };
            setUser(user);
            toast("Logged in successfully", "success");
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/", { replace: true });
        } catch (e: any) {
            console.log("Login Error", e?.response);
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
                        required={true}
                        currentValue={email}
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
                        currentValue={password}
                        setCurrentValue={setPassword}
                        type="password"
                        placeholder="Password"
                        error={error}
                        label="Password"
                        errorType="password"
                        vertical={true}
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
