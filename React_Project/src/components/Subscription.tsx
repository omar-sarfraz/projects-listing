import React from "react";
import { useMyBidSubscription, useMyProjectSubscription } from "../hooks/useSubscription";

export function Subscription({
    children,
}: {
    children: (resubscribe: () => void) => React.ReactNode;
}) {
    const { resubscribe: resubscribeBid } = useMyBidSubscription();
    const { resubscribe: resubscribeProject } = useMyProjectSubscription();

    const resubscribe = () => {
        resubscribeProject();
        resubscribeBid();
    };

    return <div>{children(resubscribe)}</div>;
}
