import { FormEvent, useState } from "react";
import { Project } from "../ProjectsList/ProjectList";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

export default function AddProject() {
    const [id, setId] = useState<number>();
    const [name, setName] = useState<string>();
    const [budget, setBudget] = useState<string>();
    const [timeline, setTimeline] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const navigate = useNavigate();

    const handleProjectSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!id || !name || !budget || !timeline || !description) {
            toast("All fields are required!", "error");
            return;
        }

        const bodyData: Project = {
            ProjectId: id,
            Name: name,
            Budget: budget,
            Timeline: timeline,
            Description: description,
        };

        try {
            setLoading(true);
            let response: Response = await fetch("https://sheetlabs.com/CRES/project_list", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify([bodyData]),
            });

            if (response.status === 204) {
                toast("Project Submitted Successfully!", "success");
                navigate("/");
            } else {
                toast("An error has occured. Please try again.", "error");
            }
        } catch (e: any) {
            console.log(e);
            toast(`An error has occured! ${e.message}`, "error");
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
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_id">
                        Project Id
                    </label>
                    <input
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none"
                        name="ProjectId"
                        id="project_id"
                        type="number"
                        placeholder="e.g., 1"
                        required
                        onChange={(e) => setId(parseInt(e.target.value))}
                    />
                </div>
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
                        type="text"
                        placeholder="e.g., 500 USD"
                        required
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full items-center md:flex-row">
                    <label className="w-full md:w-1/3 text-xl" htmlFor="project_timeline">
                        Project Timeline
                    </label>
                    <input
                        className="w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none"
                        name="Timeline"
                        id="project_timeline"
                        type="text"
                        placeholder="e.g., 4 months"
                        required
                        onChange={(e) => setTimeline(e.target.value)}
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
