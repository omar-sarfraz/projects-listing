import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";

import { useAuth } from "../../contexts/AuthContext";

import { Project } from "../../lib/types";
import { USER_ROLES } from "../../lib/utils";

import useAxios from "../../hooks/useAxios";
import { useMyProjectSubscription, useMyBidSubscription } from "../../hooks/useSubscription";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { selectProjects, setProjects } from "../../redux/projects/slice";
import ProjectCard from "../../components/ProjectCard";

export default function ProjectsList() {
    const projects = useAppSelector(selectProjects);
    const [loading, setLoading] = useState(true);

    const [searchedProjects, setSearchedProjects] = useState<Project[] | undefined>(projects);
    const [searchTerm, setSearchTerm] = useState("");

    const { user } = useAuth();
    const axiosInstance = useAxios();
    const dispatch = useAppDispatch();

    useMyProjectSubscription();
    useMyBidSubscription();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response: AxiosResponse = await axiosInstance.get("/projects");

            const projects: Project[] = await response.data.data;

            dispatch(setProjects(projects));
            setSearchedProjects(projects);
        } catch (e) {
            console.log("Error while fetching projects", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        if (searchTerm) {
            if (!projects) return;

            const projectList: Project[] | [] = projects.filter((project) => {
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
                        searchedProjects.map((project) => (
                            <ProjectCard key={project.id} {...project} />
                        ))
                    ) : (
                        <div>No projects</div>
                    )}
                </ul>
            )}
        </div>
    );
}
