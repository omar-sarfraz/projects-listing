import { withFilter } from "graphql-subscriptions";
import { Op, QueryTypes } from "sequelize";

import { channels, events, pubsub } from "../lib/utils.js";
import { ContextType, MessageType, ProjectType } from "../lib/types.js";
import { sequelize } from "../lib/sequelize.js";

import { Message } from "../models/Message.js";
import { dateScalar } from "../typeDefs/scalarTypes.js";

const validateUserAccessToProject = async (
    projectId: number,
    userId: number,
    bidIds?: number[]
) => {
    const projectQuery = `
        SELECT * 
        FROM projects 
        WHERE id = :projectId
    `;

    const projectResult: ProjectType[] = await sequelize.query(projectQuery, {
        replacements: { projectId },
        type: QueryTypes.SELECT,
    });

    if (projectResult.length === 0) {
        throw new Error("Project not found.");
    }

    let validBidForProject = bidIds?.filter(
        (id: number) => id === projectResult[0].acceptedBid
    )?.length;

    if (projectResult[0].userId !== userId && !validBidForProject) {
        throw new Error("Unauthorized access to this project.");
    }
};

const resolvers = {
    Date: dateScalar,
    Query: {
        messages: async (
            _: any,
            {
                projectId,
                limit = 20,
                cursor,
            }: { projectId: number; limit: number; cursor?: number },
            { user }: ContextType
        ) => {
            await validateUserAccessToProject(projectId, user.data.id, user.data?.bidIds);

            const whereClause = {
                projectId,
            };

            const whereClauseCursor = {
                projectId,
                id: { [Op.lt]: cursor },
            };

            const messages = await Message.findAll({
                where: cursor ? whereClauseCursor : whereClause,
                limit,
                order: [["createdAt", "DESC"]],
            });

            return messages;
        },
    },
    Mutation: {
        postMessage: async (_: any, { message }: { message: MessageType }, ctx: ContextType) => {
            await validateUserAccessToProject(
                message.projectId,
                ctx.user.data.id,
                ctx.user.data?.bidIds
            );

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
