import { useState, useEffect } from "react";
import { useSubscription, gql } from "@apollo/client";

import useAxios from "./useAxios";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { USER_ROLES } from "../lib/utils";

const PROJECT_UPDATES_SUBSCRIPTION = gql`
    subscription ($projectIds: [Int!]!) {
        projectUpdate(projectIds: $projectIds) {
            message
            type
        }
    }
`;

export const useMyProjectSubscription = () => {
    const [projectIds, setProjectIds] = useState([]);
    const [skipSubscription, setSkipSubscription] = useState(true);

    const axiosInstance = useAxios();
    const { toast } = useToast();
    const { user } = useAuth();

    if (user?.role === USER_ROLES.freelancer) return;

    useEffect(() => {
        const fetchProjectIds = async () => {
            try {
                const response = await axiosInstance.get("/users/projects");
                const ids = response.data.data.map((obj: { id: number }) => obj.id);
                setProjectIds(ids);
                setSkipSubscription(false);
            } catch (error) {
                console.error("Error fetching project IDs:", error);
                setSkipSubscription(true);
            }
        };

        fetchProjectIds();
    }, []);

    const { data, loading } = useSubscription(PROJECT_UPDATES_SUBSCRIPTION, {
        variables: { projectIds: projectIds },
        skip: skipSubscription,
    });

    useEffect(() => {
        if (!loading && data) {
            toast(data.projectUpdate.message, "success");
        }
    }, [data, loading]);
};
