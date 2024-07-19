import { useEffect, useState } from "react";

export default function ProjectsList() {
    const [projects, setProjects] = useState();
    const [loading, setLoading] = useState(true);

    const [searchedProjects, setSearchedProjects] = useState(projects);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const response = await fetch("https://sheetlabs.com/CRES/project_list");
        const projects = await response.json();
        setProjects(projects);
        setSearchedProjects(projects);
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTerm) {
            if (!projects) return;

            const projectList = projects.filter((project) => {
                let name = project.Name.toLowerCase();
                let regex = new RegExp(searchTerm, "i");

                return name.match(regex) ? true : false;
            });

            setSearchedProjects(projectList);
        } else {
            setSearchedProjects(projects);
        }
    };

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul id="list" className="flex flex-wrap justify-start gap-2">
                    {searchedProjects?.length &&
                        searchedProjects.map((project, index) => (
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
