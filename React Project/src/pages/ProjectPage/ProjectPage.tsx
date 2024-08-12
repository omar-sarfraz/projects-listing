import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Project } from "../../lib/types";
import axiosInstance from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";

import NextIcon from "../../assets/next-icon.svg";
import { USER_ROLES } from "../../lib/utils";

export default function ProjectPage() {
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const { user } = useAuth();

    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/projects/" + params.id, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            setProject(response.data.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading</div>;

    if (!project) return <div>Project not found!</div>;

    return (
        <>
            <div className="flex gap-4 justify-between py-4">
                <div className="flex items-center gap-2 border-[1px] border-cyan-500 rounded-xl py-2 px-4">
                    <h2 className="text-xl">Budget </h2>
                    <p className=" text-cyan-500 text-2xl font-semibold">{project.budget} $</p>
                </div>
                <div className="flex items-center gap-2 border-[1px] border-cyan-500 rounded-xl py-2 px-4">
                    <h2 className="text-xl">Deadline </h2>
                    <p className="text-cyan-500 text-2xl font-semibold">
                        {new Date(project.deadline).toDateString()}
                    </p>
                </div>
                {user?.role === USER_ROLES.freelancer && (
                    <Link
                        to={`/projects/${params.id}/bid`}
                        className="flex items-center bg-emerald-500 rounded-xl py-2 px-4"
                    >
                        <div className="text-white font-semibold text-xl py-2 px-4 rounded-full">
                            Bid on this project
                        </div>
                        <img src={NextIcon} className="w-6" />
                    </Link>
                )}
            </div>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Project Name</h2>
            <p className="text-2xl mt-4">{project.name}</p>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Description </h2>
            <p className="text-xl mt-4">{project.description}</p>
            {project.bids?.length && (
                <div>
                    <h2 className="text-xl underline underline-offset-8 mt-8">Project Bids</h2>
                    {project.bids.map((bid) => (
                        <div className="bg-gray-100 p-4 mt-4 rounded-md">
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    Amount: <div className="font-bold">{bid.budget} $</div>
                                </div>
                                <div>{new Date(bid.deadline).toDateString()}</div>
                            </div>
                            <div>{bid.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
