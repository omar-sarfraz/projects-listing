import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Formik, FormikHelpers, Form } from "formik";
import { useDocumentTitle } from "@mantine/hooks";

import TextField from "../../components/TextField";
import Button from "../../components/Button";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

import { loginSchema } from "./validationSchema";
import useAxios from "../../hooks/useAxios";

type LoginValues = {
    email: string;
    password: string;
};

export default function Login() {
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();
    const { toast } = useToast();
    const axiosInstance = useAxios();

    const navigate = useNavigate();

    useDocumentTitle("Login");

    const handleLogin = async (
        { email, password }: LoginValues,
        actions: FormikHelpers<LoginValues>
    ) => {
        setLoading(true);
        try {
            let response: AxiosResponse = await axiosInstance.post("/login", { email, password });
            const user = { ...response.data.user, token: response.data.token };

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            actions.resetForm();

            toast("Logged in successfully", "success");
            navigate("/", { replace: true });
        } catch (e: any) {
            console.log("Login Error", e?.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="bg-gray-100 px-10 py-10 rounded-md md:w-1/2 w-full">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-3xl font-medium mb-2">Login</h2>
                    <p>Login to access thousands of projects</p>
                </div>
                <Formik
                    initialValues={{ email: "test@gmail.com", password: "12345678" }}
                    onSubmit={handleLogin}
                    validationSchema={loginSchema}
                >
                    <Form>
                        <TextField
                            required={true}
                            type="email"
                            placeholder="johndoe@gmail.com"
                            label="Email"
                            vertical={true}
                            name="email"
                        />
                        <TextField
                            required={true}
                            type="password"
                            placeholder="Password"
                            label="Password"
                            vertical={true}
                            name="password"
                        />
                        <div className="mt-4 mb-10">
                            <div className="text-end">
                                Don't have an account?{" "}
                                <Link to="/sign-up" className="font-semibold">
                                    Sign Up
                                </Link>
                            </div>
                        </div>

                        <Button text="Login" type="submit" loading={loading} />
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
