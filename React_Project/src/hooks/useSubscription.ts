import { useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";

import useAxios from "./useAxios";

import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";

import { USER_ROLES } from "../lib/utils";
import { MessageType } from "../lib/types";

import {
    BID_UPDATES_SUBSCRIPTION,
    MESSAGE_SUBSCRIPTION_QUERY,
    PROJECT_UPDATES_SUBSCRIPTION,
} from "../graphql/queries";

export const useMyProjectSubscription = () => {
    const [projectIds, setProjectIds] = useState([]);
    const [skipSubscription, setSkipSubscription] = useState(true);

    const axiosInstance = useAxios(false);
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (!user || user.role === USER_ROLES.freelancer) return;

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

export const useMyBidSubscription = () => {
    const [bidIds, setBidIds] = useState([]);
    const [skipSubscription, setSkipSubscription] = useState(true);

    const axiosInstance = useAxios(false);
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (!user || user.role === USER_ROLES.client) return;

        const fetchBidIds = async () => {
            try {
                const response = await axiosInstance.get("/users/bids");
                const ids = response.data.data.map((obj: { id: number }) => obj.id);
                setBidIds(ids);
                setSkipSubscription(false);
            } catch (error) {
                console.error("Error fetching bid IDs:", error);
                setSkipSubscription(true);
            }
        };

        fetchBidIds();
    }, []);

    const { data, loading } = useSubscription(BID_UPDATES_SUBSCRIPTION, {
        variables: { bidIds: bidIds },
        skip: skipSubscription,
    });

    useEffect(() => {
        if (!loading && data) {
            toast(data.bidUpdate.message, "success");
        }
    }, [data, loading]);
};

export const useMessageSubscription = (
    projectId: number,
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
    const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION_QUERY, {
        variables: { projectId },
    });

    useEffect(() => {
        if (!loading && data) {
            setMessages((prev) => [...prev, data.messageCreated]);
        }
    }, [data, loading]);
};
