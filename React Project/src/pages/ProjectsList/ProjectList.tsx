import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Project } from "../../lib/types";
import { USER_ROLES } from "../../lib/utils";
import Markdown from "react-markdown";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMyProjectSubscription, useMyBidSubscription } from "../../hooks/useSubscription";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataRequest, selectProjects } from "../../redux/projects/slice";

export default function ProjectsList() {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector(selectProjects);

    const [searchedProjects, setSearchedProjects] = useState<Project[] | undefined>(projects);
    const [searchTerm, setSearchTerm] = useState("");

    const { user } = useAuth();

    useMyProjectSubscription();
    useMyBidSubscription();

    useEffect(() => {
        dispatch(fetchDataRequest());
    }, []);

    useEffect(() => {
        if (projects.length) setSearchedProjects(projects);
    }, [projects]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        if (searchTerm) {
            if (!projects) return;

            const projectList: Project[] | [] = projects.filter((project: Project) => {
                let name = project.name.toLowerCase();
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
            {user?.role === USER_ROLES.client && (
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl">All Project Listings</h1>
                    <Link
                        to="/projects/submit"
                        className="bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md cursor-pointer"
                    >
                        Add Project
                    </Link>
                </div>
            )}
            <form
                id="search_form"
                className="flex items-center border-2 border-gray-300 rounded-full my-4 px-4"
                onSubmit={handleSearch}
            >
                <input
                    placeholder="Search"
                    id="search_input"
                    className="py-2 w-full focus:outline-none"
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Icon icon="material-symbols:search" fontSize={30} onClick={handleSearch} />
            </form>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul id="list" className="flex flex-wrap justify-start gap-2">
                    {searchedProjects?.length ? (
                        searchedProjects.map(
                            ({ id, name, description, budget, deadline }, index) => (
                                <li
                                    className="relative bg-gray-100 flex flex-col grow justify-between rounded-md p-4 sm:w-full lg:w-1/4 group"
                                    key={index}
                                >
                                    <div>
                                        <h3 className="text-2xl font-medium">
                                            {id}: {name}
                                        </h3>
                                        <div className="my-4">
                                            <div className="font-bold">Description:</div>
                                            <Markdown>
                                                {description.slice(
                                                    0,
                                                    description.indexOf("\n") !== -1
                                                        ? description.indexOf("\n")
                                                        : description.length
                                                )}
                                            </Markdown>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex w-full justify-between group-hover:opacity-0 transition duration-500">
                                            <div>
                                                <h3 className="font-bold">Budget</h3>
                                                <div className="bg-cyan-500 rounded-full px-3 mt-1 text-white">
                                                    {budget} $
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Deadline</h3>
                                                <div className="bg-emerald-500 rounded-full px-3 mt-1 text-white">
                                                    {new Date(deadline).toDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/projects/${id}`}
                                            className="absolute left-0 w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-md text-center py-2 mt-4 opacity-0 group-hover:-translate-y-full group-hover:opacity-100 transition duration-500 ease-in-out"
                                        >
                                            View More
                                        </Link>
                                    </div>
                                </li>
                            )
                        )
                    ) : (
                        <div>No projects</div>
                    )}
                </ul>
            )}
        </div>
    );
}
