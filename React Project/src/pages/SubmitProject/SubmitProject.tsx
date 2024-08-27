import { FormEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { USER_ROLES } from "../../lib/utils";

import TextField from "../../components/TextField";
import { projectSchema } from "./validationSchema";
import TextEditor from "../../components/TextEditor";
import useAxios from "../../hooks/useAxios";

import * as marked from "marked";

export default function SubmitProject() {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const [loading, setLoading] = useState(false);

    const { toast } = useToast();
    const { user } = useAuth();
    const axiosInstance = useAxios();

    const navigate = useNavigate();
    const { state } = useLocation();

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
        setName(state.name);
        setBudget(state.budget);

        const date = new Date(state.deadline);
        const dateStr = date.toISOString().split("T")[0];

        setDeadline(dateStr);

        let html = await marked.parse(state.description);
        setDescription(html);
    };

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

            const url = state ? `/projects/${state.id}` : "/projects";
            const requestOptions = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (state) await axiosInstance.put(url, formData, requestOptions);
            else await axiosInstance.post(url, formData, requestOptions);

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
            <form
                className="flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md"
                id="add_form"
            >
                <TextField
                    required={true}
                    currentValue={name}
                    setCurrentValue={setName}
                    type="text"
                    label="Name"
                    placeholder="e.g., Ecommerce Website"
                />
                <TextField
                    required={true}
                    currentValue={budget}
                    label="Budget"
                    type="number"
                    placeholder="e.g., 500"
                    setCurrentValue={setBudget}
                />
                <TextField
                    required={true}
                    currentValue={deadline}
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
                    <div className="w-full md:w-2/3">
                        <TextEditor
                            value={description}
                            setValue={setDescription}
                            placeholder="e.g., I want you to create an Clothing Ecommerce Store using React"
                        />
                    </div>
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
