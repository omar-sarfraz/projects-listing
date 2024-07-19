import { BASE_URL } from "../../configs/urls";
import { useEffect, useState } from "react";

export type Project = {
    ProjectId: number;
    Name: string;
    Budget: string;
    Timeline: string;
    Description: string;
};

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[] | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const response: Response = await fetch(BASE_URL);
        const projects: Project[] = await response.json();
        setProjects(projects);
        setLoading(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl">Project Listings</h1>
                <a
                    href="/projects/add"
                    className="bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md cursor-pointer"
                >
                    Add Project
                </a>
            </div>
            <form
                id="search_form"
                className="flex items-center border-2 border-gray-300 rounded-full my-4 px-4"
            >
                <input
                    placeholder="Search"
                    id="search_input"
                    className="py-2 w-full focus:outline-none"
                    type="text"
                />
            </form>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul id="list" className="flex flex-wrap justify-start gap-2">
                    {projects?.length &&
                        projects.map((project, index) => (
                            <li
                                className="relative bg-gray-100 flex flex-col grow justify-between rounded-md p-4 sm:w-full lg:w-1/4 group"
                                key={index}
                            >
                                <div>
                                    <h3 className="text-2xl font-medium">
                                        {project.ProjectId}: {project.Name}
                                    </h3>
                                    <div className="my-4">
                                        <div className="font-bold">Description:</div>
                                        {project.Description}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex w-full justify-between group-hover:opacity-0 transition duration-500">
                                        <div>
                                            <h3 className="font-bold">Budget</h3>
                                            <div className="bg-cyan-500 rounded-full px-3 mt-1 text-white">
                                                {project.Budget}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Timeline</h3>
                                            <div className="bg-emerald-500 rounded-full px-3 mt-1 text-white">
                                                {project.Timeline}
                                            </div>
                                        </div>
                                    </div>
                                    <a className="absolute left-0 w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-md text-center py-2 mt-4 opacity-0 group-hover:-translate-y-full group-hover:opacity-100 transition duration-500 ease-in-out">
                                        Apply Now
                                    </a>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}
