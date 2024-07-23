import { useState } from "react";
import { Link } from "react-router-dom";

type Error = {
    type: "" | "EMAIL" | "PASSWORD";
    message: string;
};

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<Error>({ type: "", message: "" });

    const handleLogin = () => {
        setError({ type: "", message: "" });

        if (!email) {
            setError({ type: "EMAIL", message: "Email is required!" });
            return;
        }

        if (!password) {
            setError({ type: "PASSWORD", message: "Password is required!" });
            return;
        }

        const correctEmail = "test@gmail.com";
        const correctPassword = "12345678";

        if (email === correctEmail && password === correctPassword) {
            alert("Email and Password is correct!");
        } else {
            alert("Email or password is incorrect!");
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
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-xl">
                            Email
                        </label>
                        <input
                            id="password"
                            value={email}
                            type="email"
                            placeholder="johndoe@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className={`p-2 rounded-md outline-none ${
                                error.type === "EMAIL" ? "border-2 border-red-500" : ""
                            }`}
                        />
                        {error.type === "EMAIL" && (
                            <p className="text-red-500 pl-2">{error.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                        <label htmlFor="password" className="text-xl">
                            Password
                        </label>
                        <input
                            id="password"
                            value={password}
                            type="password"
                            placeholder="********"
                            onChange={(e) => setPassword(e.target.value)}
                            className={`p-2 rounded-md outline-none ${
                                error.type === "PASSWORD" ? "border-2 border-red-500" : ""
                            }`}
                        />
                        {error.type === "PASSWORD" && (
                            <p className="text-red-500 pl-2">{error.message}</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="text-end">
                            Don't have an account?{" "}
                            <Link to="/sign-up" className="font-semibold">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
                <button
                    className="bg-emerald-500 text-white w-full py-2 text-xl font-medium rounded-md"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
