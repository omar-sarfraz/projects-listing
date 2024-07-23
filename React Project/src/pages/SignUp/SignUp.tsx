import { useState } from "react";
import { Link } from "react-router-dom";

type Error = {
    type: "" | "FIRST_NAME" | "LAST_NAME" | "EMAIL" | "PASSWORD" | "CONFIRM_PASSWORD";
    message: string;
};

export default function SignUp() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<Error>({ type: "", message: "" });

    const handleSignUp = () => {
        setError({ type: "", message: "" });

        if (!firstName) {
            setError({ type: "FIRST_NAME", message: "First Name is required!" });
            return;
        }

        if (!lastName) {
            setError({ type: "LAST_NAME", message: "Last Name is required!" });
            return;
        }

        if (!email) {
            setError({ type: "EMAIL", message: "Email is required!" });
            return;
        }

        if (!password || password.length < 8) {
            setError({ type: "PASSWORD", message: "Password must be 8 or more characters long!" });
            return;
        }

        if (!confirmPassword) {
            setError({ type: "CONFIRM_PASSWORD", message: "Please confirm your password!" });
            return;
        }

        if (password !== confirmPassword) {
            setError({ type: "CONFIRM_PASSWORD", message: "Passwords do not match!" });
            return;
        }

        alert("Implement Sign Up");
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-gray-100 px-10 py-10 rounded-md md:w-1/2 w-full">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-medium mb-2">SignUp</h2>
                    <p>SignUp to access thousands of projects</p>
                </div>
                <div className="my-10">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="first_name" className="text-xl">
                            First Name
                        </label>
                        <input
                            id="first_name"
                            value={firstName}
                            type="text"
                            placeholder="John"
                            onChange={(e) => setFirstName(e.target.value)}
                            className={`p-2 rounded-md outline-none ${
                                error.type === "FIRST_NAME" ? "border-2 border-red-500" : ""
                            }`}
                        />
                        {error.type === "FIRST_NAME" && (
                            <p className="text-red-500 pl-2">{error.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                        <label htmlFor="last_name" className="text-xl">
                            Last Name
                        </label>
                        <input
                            id="last_name"
                            value={lastName}
                            type="text"
                            placeholder="Doe"
                            onChange={(e) => setLastName(e.target.value)}
                            className={`p-2 rounded-md outline-none ${
                                error.type === "LAST_NAME" ? "border-2 border-red-500" : ""
                            }`}
                        />
                        {error.type === "LAST_NAME" && (
                            <p className="text-red-500 pl-2">{error.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                        <label htmlFor="email" className="text-xl">
                            Email
                        </label>
                        <input
                            id="email"
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
                    <div className="flex flex-col gap-1 mt-3">
                        <label htmlFor="confirmPassword" className="text-xl">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            value={confirmPassword}
                            type="password"
                            placeholder="********"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`p-2 rounded-md outline-none ${
                                error.type === "CONFIRM_PASSWORD" ? "border-2 border-red-500" : ""
                            }`}
                        />
                        {error.type === "CONFIRM_PASSWORD" && (
                            <p className="text-red-500 pl-2">{error.message}</p>
                        )}
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
                <button
                    className="bg-emerald-500 text-white w-full py-2 text-xl font-medium rounded-md"
                    onClick={handleSignUp}
                >
                    SignUp
                </button>
            </div>
        </div>
    );
}
