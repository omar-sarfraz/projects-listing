import { withFilter } from "graphql-subscriptions";
import { channels, events, pubsub } from "../lib/utils.js";
import { ContextType, MessageType } from "../lib/types.js";
import { Message } from "../models/Message.js";

const resolvers = {
    Query: {
        messages: async (_: any, { projectId }: { projectId: number }, ctx: ContextType) => {
            const messages = await Message.findAll({ where: { projectId: projectId } });
            return messages;
        },
    },
    Mutation: {
        postMessage: async (_: any, { message }: { message: MessageType }, ctx: ContextType) => {
            const data = { ...message, userId: ctx.user.data.id };
            const createdMessage = await Message.create(data);

            pubsub.publish(channels.MESSAGE_CREATED, {
                messageCreated: createdMessage.dataValues,
            });

            return createdMessage.dataValues;
        },
    },
    Subscription: {
        projectUpdate: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([channels.PROJECT_UPDATE]),
                (payload, _, { user }) => {
                    if (
                        user.data.role === "CLIENT" &&
                        payload.projectUpdate.type === events.BID_CREATE
                    ) {
                        // Only send event to clients for their own project
                        let validProject = user.data.projectIds.filter(
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
                (payload, _, { user }) => {
                    if (
                        user.data.role === "FREELANCER" &&
                        payload.bidUpdate.type === events.BID_UPDATE
                    ) {
                        // Only send event to freelancers for their own bids
                        let validBid = user.data.bidIds.filter(
                            (id: number) => id === payload.bidUpdate.data.acceptedBid
                        ).length;

                        return validBid ? true : false;
                    }

                    return false;
                }
            ),
        },
        messageCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([channels.MESSAGE_CREATED]),
                (payload, variables, { user }) => {
                    if (
                        payload.messageCreated.projectId === variables.projectId &&
                        user.data.id !== payload.messageCreated.userId
                    ) {
                        // Only send message to users who have subscribed to project channel
                        return true;
                    }

                    return false;
                }
            ),
        },
    },
};

export default resolvers;
