import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { projectSchema } from "../../validations/Project";

import { AxiosResponse } from "axios";
import axiosInstance from "../../lib/axios";
import { BASE_URL } from "../../configs/urls";
import { useAuth } from "../../contexts/AuthContext";

export default function AddProject() {
    const [name, setName] = useState<string>();
    const [budget, setBudget] = useState<string>();
    const [deadline, setDeadline] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const { user } = useAuth();

    const navigate = useNavigate();

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

            let response: AxiosResponse = await axiosInstance.post(
                BASE_URL + "/projects",
                { name, budget, deadline, description },
                { headers: { Authorization: "Bearer " + user?.token } }
            );

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
                <div className="flex flex-col w-full items-center md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_name">
                        Project Name
                    </label>
                    <input
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none"
                        name="Name"
                        id="project_name"
                        type="text"
                        placeholder="e.g., Ecommerce Website"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full items-center md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_budget">
                        Project Budget
                    </label>
                    <input
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none"
                        name="Budget"
                        id="project_budget"
                        type="number"
                        placeholder="e.g., 500"
                        required
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full items-center md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_timeline">
                        Project Deadline
                    </label>
                    <input
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none text-gray-400"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        name="Deadline"
                        id="project_timeline"
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col w-full items-start md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_description">
                        Project Description
                    </label>
                    <textarea
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none"
                        id="project_description"
                        name="Description"
                        placeholder="e.g., I want you to create an Clothing Ecommerce Store using React"
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
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
