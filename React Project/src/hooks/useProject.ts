import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useAuth } from "../contexts/AuthContext";

import { Bid } from "../lib/types";
import { USER_ROLES } from "../lib/utils";

import { useAppDispatch } from "../redux/store";
import {
    acceptBidRequest,
    deleteBidRequest,
    deleteProjectRequest,
    fetchProjectRequest,
    resetProject,
    selectProject,
} from "../redux/project/slice";

export default function useProject() {
    const { project, loading } = useSelector(selectProject);
    const [canBid, setCanBid] = useState(false);

    const dispatch = useAppDispatch();

    const params = useParams();

    const { user } = useAuth();

    useEffect(() => {
        if (params.id) {
            const projectId = parseInt(params.id);
            dispatch(fetchProjectRequest({ projectId }));
        }

        return () => {
            dispatch(resetProject());
        };
    }, []);

    useEffect(() => {
        if (!project) return;

        // Check to see if the current user can bid or not
        if (user?.role === USER_ROLES.client || project.acceptedBid) return;

        let bids: Bid[] | undefined = project.bids;
        if (!bids) return;

        let currentUserBids = bids.filter((bid) => bid.user?.id === user?.id);
        if (currentUserBids.length) return;

        setCanBid(true);
    }, [project]);

    const handleAcceptBid = async (id: number) => {
        if (project?.id) dispatch(acceptBidRequest({ bidId: id, projectId: project.id }));
    };

    const handleDeleteBid = async (id: number) => {
        if (project?.id) dispatch(deleteBidRequest({ bidId: id, projectId: project.id }));
    };

    const handleDeleteProject = async () => {
        if (project?.id) dispatch(deleteProjectRequest({ projectId: project.id }));
    };

    return { project, loading, canBid, handleAcceptBid, handleDeleteBid, handleDeleteProject };
}
