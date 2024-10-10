import { useState, useEffect, useCallback } from "react";
import { Bid, Project } from "../lib/types";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { USER_ROLES } from "../lib/utils";
import { useToast } from "../contexts/ToastContext";
import { AxiosResponse } from "axios";
import useAxios from "./useAxios";

export default function useProject() {
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(false);
    const [canBid, setCanBid] = useState(false);

    const params = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/projects/${params.id}`);
            const project: Project = response.data.data;
            setProject(project);

            // Check to see if the current user can bid or not
            if (user?.role === USER_ROLES.client || project.acceptedBid) return;

            const bids: Bid[] | undefined = project.bids;
            if (!bids) return;

            const currentUserBids = bids.filter((bid) => bid.user?.id === user?.id);
            if (currentUserBids.length) return;

            setCanBid(true);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = useCallback(
        async (id: number) => {
            try {
                const response: AxiosResponse = await axiosInstance.post(
                    `/projects/${project?.id}/bids/${id}/accept`
                );

                const updatedProject: Project = response.data.data;
                setProject((project) => {
                    if (project) {
                        return { ...project, acceptedBid: updatedProject.acceptedBid };
                    }
                });
                toast("Bid accepted successfully", "success");
            } catch (e: any) {
                console.log("Accept Bid response", e);
            }
        },
        [project]
    );

    const handleDeleteBid = useCallback(
        async (id: number) => {
            try {
                const response: AxiosResponse = await axiosInstance.delete(
                    `/projects/${project?.id}/bids/${id}`
                );
                toast(response.data.message, "success");
                setProject((project) => {
                    if (project && project.bids?.length) {
                        const newBids = project.bids.filter((bid) => bid.id !== id);
                        return { ...project, bids: newBids };
                    }
                });
                navigate(`/projects/${project?.id}`);
            } catch (e: any) {
                console.log("Delete bid response", e);
            }
        },
        [project]
    );

    const handleDeleteProject = async () => {
        try {
            const response: AxiosResponse = await axiosInstance.delete(`/projects/${project?.id}`);
            toast(response.data.message, "success");
            navigate("/");
        } catch (e: any) {
            console.log("Delete project response", e);
        }
    };

    return { project, loading, canBid, handleAcceptBid, handleDeleteBid, handleDeleteProject };
}
