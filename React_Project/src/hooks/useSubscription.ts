import { useEffect, useState } from "react";
import { useSubscription } from "@apollo/client";

import { useToast } from "../contexts/ToastContext";

import { MessageType } from "../lib/types";

import {
    BID_UPDATES_SUBSCRIPTION,
    MESSAGE_SUBSCRIPTION_QUERY,
    PROJECT_UPDATES_SUBSCRIPTION,
} from "../graphql/queries";

export const useMyProjectSubscription = () => {
    const { toast } = useToast();

    const [resubscribeFlag, setResubscribeFlag] = useState(true);

    const { data, loading } = useSubscription(PROJECT_UPDATES_SUBSCRIPTION, {
        skip: !resubscribeFlag,
        shouldResubscribe: true,
    });

    useEffect(() => {
        if (!loading && data) {
            toast(data.projectUpdate.message, "success");
        }
    }, [data, loading]);

    const resubscribe = () => {
        setResubscribeFlag(false);
        setTimeout(() => setResubscribeFlag(true), 0);
    };

    return { resubscribe };
};

export const useMyBidSubscription = () => {
    const { toast } = useToast();

    const [resubscribeFlag, setResubscribeFlag] = useState(true);

    const { data, loading } = useSubscription(BID_UPDATES_SUBSCRIPTION, {
        skip: !resubscribeFlag,
        shouldResubscribe: true,
    });

    useEffect(() => {
        if (!loading && data) {
            toast(data.bidUpdate.message, "success");
        }
    }, [data, loading]);

    const resubscribe = () => {
        setResubscribeFlag(false);
        setTimeout(() => setResubscribeFlag(true), 0);
    };

    return { resubscribe };
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
            setMessages((prev) => [data.messageCreated, ...prev]);
        }
    }, [data, loading]);
};
