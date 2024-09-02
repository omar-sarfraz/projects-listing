import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { USER_ROLES } from "../../lib/utils";

import TextField from "../../components/TextField";
import { projectSchema } from "./validationSchema";
import TextEditor from "../../components/TextEditor";
import useAxios from "../../hooks/useAxios";

import * as marked from "marked";
import { Field, Form, Formik, FormikHelpers } from "formik";

type ProjectInput = {
    name: string;
    budget: string;
    deadline: string;
    description: string;
    files: FileList | null;
};

export default function SubmitProject() {
    const [loading, setLoading] = useState(false);
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    const { toast } = useToast();
    const { user } = useAuth();
    const axiosInstance = useAxios();

    const navigate = useNavigate();
    const { state } = useLocation();

    const initialValues: ProjectInput = {
        name: state ? state.name : "",
        budget: state ? state.budget : "",
        deadline: deadline,
        description: description,
        files: null,
    };

    useEffect(() => {
        if (user?.role !== USER_ROLES.client) {
            toast("Only clients can post a project", "error");
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (state) updateProjectFilds();
    }, []);

    const updateProjectFilds = async () => {
        const date = new Date(state.deadline);
        const dateStr = date.toISOString().split("T")[0];

        setDeadline(dateStr);

        let html = await marked.parse(state.description);
        setDescription(html);
    };

    const handleProjectSubmit = async (
        { name, deadline, description, budget, files }: ProjectInput,
        actions: FormikHelpers<ProjectInput>
    ) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", name);
            formData.append("budget", budget);
            formData.append("deadline", deadline);
            formData.append("description", description);
            if (user?.id) formData.append("userId", String(user.id));
            if (files?.length) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("projectFiles", files[i]);
                }
            }

            const url = state ? `/projects/${state.id}` : "/projects";
            const requestOptions = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (state) await axiosInstance.put(url, formData, requestOptions);
            else await axiosInstance.post(url, formData, requestOptions);

            actions.resetForm();

            toast("Project Submitted Successfully!", "success");
            navigate("/");
        } catch (e: any) {
            console.log(e?.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl mb-6">{state ? "Edit" : "Add"} a project</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={handleProjectSubmit}
                validationSchema={projectSchema}
                enableReinitialize={true}
            >
                <Form
                    className="flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md"
                    id="add_form"
                >
                    <TextField
                        required={true}
                        name="name"
                        type="text"
                        label="Name"
                        placeholder="e.g., Ecommerce Website"
                    />
                    <TextField
                        required={true}
                        name="budget"
                        label="Budget"
                        type="number"
                        placeholder="e.g., 500"
                    />
                    <TextField
                        required={true}
                        name="deadline"
                        placeholder="Date"
                        label="Deadline"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                    />
                    <div className="flex flex-col w-full items-start md:flex-row">
                        <label className="w-full md:w-1/3 text-xl" htmlFor="project_description">
                            Project Description
                        </label>
                        <div className="w-full md:w-2/3">
                            <TextEditor
                                name="description"
                                placeholder="e.g., I want you to create an Clothing Ecommerce Store using React"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start md:flex-row">
                        <label className="w-full md:w-1/3 text-xl" htmlFor="projectFiles">
                            Upload relevant files
                        </label>
                        <Field
                            as="input"
                            className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none placeholder:text-gray-500 text-gray-500"
                            id="projectFiles"
                            type="file"
                            multiple
                            name="files"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md w-full md:w-1/3 mt-4 outline-none"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
