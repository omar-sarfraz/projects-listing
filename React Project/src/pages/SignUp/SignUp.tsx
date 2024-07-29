import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { encrypt } from "@omar-sarfraz/caesar-cipher";
import bcrypt from "bcryptjs";
import { ToastContext } from "../../contexts/ToastContext";

export type SignUpError = {
    type: "" | "FIRST_NAME" | "LAST_NAME" | "EMAIL" | "PASSWORD" | "CONFIRM_PASSWORD";
    message: string;
};

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export default function SignUp() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<SignUpError>({ type: "", message: "" });

    const { displayToastMessage } = useContext(ToastContext);

    const navigate = useNavigate();

    const handleSignUp = async () => {
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

        const key = parseInt(import.meta.env.VITE_CIPHER_KEY);

        if (!key) {
            displayToastMessage("An error has occured. Please try again after some time.", "error");
            return;
        }

        const encryptedFirstName = encrypt(key, firstName);
        const encryptedLastName = encrypt(key, lastName);
        const encryptedEmail = encrypt(key, email);

        const hash = await bcrypt.genSalt(key);
        const encryptedPassword = await bcrypt.hash(password, hash);

        let userData: User = {
            firstName: encryptedFirstName,
            lastName: encryptedLastName,
            email: encryptedEmail,
            password: encryptedPassword,
        };
        let existingUser = localStorage.getItem(encryptedEmail);

        if (existingUser) displayToastMessage("User with this email already exists", "error");
        else {
            localStorage.setItem(encryptedEmail, JSON.stringify(userData));
            displayToastMessage("Account registered successfully", "success");
            navigate("/login");
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
                        errorType="FIRST_NAME"
                    />
                    <TextField
                        currentValue={lastName}
                        setCurrentValue={setLastName}
                        type="text"
                        placeholder="Doe"
                        error={error}
                        label="Last Name"
                        errorType="LAST_NAME"
                    />
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
                    <TextField
                        currentValue={confirmPassword}
                        setCurrentValue={setConfirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        error={error}
                        label="Confirm Password"
                        errorType="CONFIRM_PASSWORD"
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
