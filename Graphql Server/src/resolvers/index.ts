import { withFilter } from "graphql-subscriptions";
import { channels, events, pubsub } from "../lib/utils.js";

const resolvers = {
    Subscription: {
        projectUpdate: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([channels.PROJECT_UPDATE]),
                (payload, variables, { user }) => {
                    if (
                        user.data.role === "CLIENT" &&
                        payload.projectUpdate.type === events.BID_CREATE
                    ) {
                        // Only send event to clients who have subscribed to this project
                        let validProject = variables.projectIds.filter(
                            (id: number) => id === payload.projectUpdate.data.projectId
                        ).length;

                        return validProject ? true : false;
                    }

                    return false;
                }
            ),
        },
        bidUpdate: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([channels.BID_UPDATE]),
                (payload, variables, { user }) => {
                    if (
                        user.data.role === "FREELANCER" &&
                        payload.bidUpdate.type === events.BID_UPDATE
                    ) {
                        // Only send event to freelancers who have subscribed to their bids
                        let validBid = variables.bidIds.filter(
                            (id: number) => id === payload.bidUpdate.data.acceptedBid
                        ).length;

                        return validBid ? true : false;
                    }

                    return false;
                }
            ),
        },
    },
};

export default resolvers;
