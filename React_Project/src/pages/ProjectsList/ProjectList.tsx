import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AxiosResponse } from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDocumentTitle } from "@mantine/hooks";
import { Pagination } from "@mantine/core";

import { useAuth } from "../../contexts/AuthContext";

import { PaginationType, Project } from "../../lib/types";
import { USER_ROLES } from "../../lib/utils";

import useAxios from "../../hooks/useAxios";
import { useMyProjectSubscription, useMyBidSubscription } from "../../hooks/useSubscription";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { selectProjects, setProjects } from "../../redux/projects/slice";

import ProjectCard from "../../components/ProjectCard";

const PROJECTS_LIMIT = 10;

export default function ProjectsList() {
    const projects = useAppSelector(selectProjects);
    const [pagination, setPagination] = useState<PaginationType | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const { user } = useAuth();
    const axiosInstance = useAxios();
    const dispatch = useAppDispatch();

    useDocumentTitle("View Projects");

    useMyProjectSubscription();
    useMyBidSubscription();

    useEffect(() => {
        fetchProjects();
    }, [page]);

    const fetchProjects = async () => {
        try {
            const response: AxiosResponse = await axiosInstance.get(
                `/projects?page=${page}&limit=${PROJECTS_LIMIT}&search=${searchTerm}`
            );

            const projects: Project[] = await response.data.data;

            dispatch(setProjects(projects));
            setPagination(response.data.pagination);
        } catch (e) {
            console.log("Error while fetching projects", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        fetchProjects();
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
                <>
                    <ul id="list" className="flex flex-wrap justify-start gap-2">
                        {projects?.length ? (
                            projects.map((project) => <ProjectCard key={project.id} {...project} />)
                        ) : (
                            <div>No projects</div>
                        )}
                    </ul>
                    {pagination ? (
                        <div className="my-8 flex justify-end w-full">
                            <Pagination
                                color="teal"
                                total={pagination.totalPages}
                                value={page}
                                onChange={setPage}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </div>
    );
}
