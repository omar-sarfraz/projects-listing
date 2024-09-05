import { Link, useNavigate } from "react-router-dom";
import { Field, Form, Formik, FormikHelpers } from "formik";

import TextField from "../../components/TextField";
import Button from "../../components/Button";

import { useToast } from "../../contexts/ToastContext";
import { signUpSchema } from "./validationSchema";
import useAxios from "../../hooks/useAxios";

import { USER_ROLES } from "../../lib/utils";
import { User } from "../../lib/types";

export type SignUpValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
};

export default function SignUp() {
    const { toast } = useToast();
    const axiosInstance = useAxios();

    const navigate = useNavigate();

    const handleSignUp = async (
        { firstName, lastName, email, password, role }: SignUpValues,
        actions: FormikHelpers<SignUpValues>
    ) => {
        try {
            let userData: User = {
                firstName,
                lastName,
                email,
                password,
                role,
            };

            await axiosInstance.post("/signup", userData);

            actions.resetForm();

            toast("Account registered successfully", "success");
            navigate("/login");
        } catch (e: any) {
            console.log("Sign up error", e?.response);
            toast(e?.response?.data?.message || "Sign Up Error", "error");
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-gray-100 px-10 py-10 rounded-md md:w-1/2 w-full">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-3xl font-medium mb-2">SignUp</h2>
                    <p>SignUp to access thousands of projects</p>
                </div>
                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        role: USER_ROLES.freelancer,
                    }}
                    onSubmit={handleSignUp}
                    validationSchema={signUpSchema}
                >
                    <Form>
                        <TextField
                            required={true}
                            name="firstName"
                            type="text"
                            placeholder="John"
                            label="First Name"
                            vertical={true}
                        />
                        <TextField
                            required={true}
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            label="Last Name"
                            vertical={true}
                        />
                        <TextField
                            required={true}
                            name="email"
                            type="email"
                            placeholder="johndoe@gmail.com"
                            label="Email"
                            vertical={true}
                        />
                        <TextField
                            required={true}
                            name="password"
                            type="password"
                            placeholder="Password"
                            label="Password"
                            vertical={true}
                        />
                        <TextField
                            required={true}
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            label="Confirm Password"
                            vertical={true}
                        />
                        <div className="flex flex-col gap-1 mt-3">
                            <label className="text-xl">Sign Up As</label>
                            <Field as="select" name="role" className="w-full px-2 py-3 rounded-md">
                                <option value={USER_ROLES.freelancer}>Freelancer</option>
                                <option value={USER_ROLES.client}>Client</option>
                            </Field>
                        </div>
                        <div className="mt-4 mb-10">
                            <div className="text-end">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold">
                                    Login
                                </Link>
                            </div>
                        </div>
                        <Button text="SignUp" type="submit" />
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
