import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { projectSchema } from "./validationSchema";

import { AxiosResponse } from "axios";
import axiosInstance from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";
import { USER_ROLES } from "../../lib/utils";
import TextField from "../../components/TextField";

export default function AddProject() {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const { user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== USER_ROLES.client) {
            toast("Only clients can post a project", "error");
            navigate("/");
        }
    }, []);

    const handleProjectSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await projectSchema.validate(
                { name, budget, deadline, description },
                { abortEarly: false }
            );
        } catch (e: any) {
            const firstError = e.inner[0];
            toast(firstError.errors[0], "error");
            return;
        }

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

            let response: AxiosResponse = await axiosInstance.post("/projects", formData, {
                headers: {
                    Authorization: "Bearer " + user?.token,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast("Project Submitted Successfully!", "success");
                navigate("/");
            } else {
                toast("An error has occured. Please try again.", "error");
            }
        } catch (e: any) {
            console.log(e?.response);
            toast(e?.response?.data?.message || "An error has occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl mb-6">Add a project</h1>
            <form
                className="flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md"
                id="add_form"
            >
                <TextField
                    required={true}
                    setCurrentValue={setName}
                    type="text"
                    label="Name"
                    placeholder="e.g., Ecommerce Website"
                />
                <TextField
                    required={true}
                    label="Budget"
                    type="number"
                    placeholder="e.g., 500"
                    setCurrentValue={setBudget}
                />
                <TextField
                    required={true}
                    setCurrentValue={setDeadline}
                    placeholder="Date"
                    label="Deadline"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                />
                <div className="flex flex-col w-full items-start md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_description">
                        Project Description
                    </label>
                    <textarea
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none placeholder:text-gray-500 text-gray-500"
                        id="project_description"
                        name="Description"
                        placeholder="e.g., I want you to create an Clothing Ecommerce Store using React"
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex flex-col w-full items-start md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="projectFiles">
                        Upload relevant files
                    </label>
                    <input
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none placeholder:text-gray-500 text-gray-500"
                        id="projectFiles"
                        type="file"
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md w-full md:w-1/3 mt-4 outline-none"
                    onClick={handleProjectSubmit}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
