import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Project } from "../../lib/types";
import axiosInstance from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";

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
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl italic">Budget </h2>
                    <p className="border-cyan-500 text-cyan-500 border-[1px] rounded-xl text-xl px-4 font-semibold">
                        {project.budget} $
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl italic">Deadline </h2>
                    <p className="border-cyan-500 text-cyan-500 border-[1px] rounded-xl text-xl px-4 font-semibold">
                        {new Date(project.deadline).toDateString()}
                    </p>
                </div>
            </div>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Project Name</h2>
            <p className="text-2xl mt-4">{project.name}</p>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Description </h2>
            <p className="text-xl mt-4">{project.description}</p>
        </>
    );
}
