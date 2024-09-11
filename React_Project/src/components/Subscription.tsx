import React from "react";
import { useMyBidSubscription, useMyProjectSubscription } from "../hooks/useSubscription";

export function Subscription({ children }: { children: React.ReactNode }) {
    useMyBidSubscription();
    useMyProjectSubscription();

    return <div>{children}</div>;
}
