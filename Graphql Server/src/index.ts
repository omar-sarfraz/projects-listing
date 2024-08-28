import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import cors from "cors";
import express from "express";
import { createServer } from "http";

import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub, withFilter } from "graphql-subscriptions";

import { verifyUser, channels, events, getUser } from "./lib/utils.js";
import { db } from "./lib/db.js";

const PORT = 4000;
const pubsub = new PubSub();

const typeDefs = `
  type Query {
    _empty: Int
  }

  type Subscription {
    projectUpdate(projectIds: [Int!]!): Notification
  }

  type Notification {
    message: String
    type: String
  }
`;

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
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
});
const serverCleanup = useServer(
    {
        schema,
        context: async (ctx) => {
            const user = await getUser(ctx);
            return { user };
        },
        onConnect: async (ctx) => {
            const user = await getUser(ctx);
            if (!user) return false;
            console.log("Connected WebSocket");
        },
        onDisconnect(ctx, code, reason) {
            console.log("Disconnected WebSocket");
        },
    },
    wsServer
);

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

await server.start();
app.use("/", cors(), express.json(), expressMiddleware(server));

httpServer.listen(PORT, async () => {
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/`);
    try {
        await db.connect();
        console.log("Database connection has been established successfully.");

        // Listen to the specified channel
        await db.query(`LISTEN ${events.BID_UPDATE}`);
        await db.query(`LISTEN ${events.BID_CREATE}`);

        // Listen for notifications
        db.on("notification", (msg) => {
            let payload = msg.payload ? JSON.parse(msg.payload) : null;

            // if (msg.channel === events.BID_UPDATE && payload.acceptedBid) {
            //     pubsub.publish(channels.PROJECT_UPDATE, {
            //         projectUpdate: {
            //             message: "Your bid has been accepted",
            //             type: events.BID_UPDATE,
            //             data: payload,
            //         },
            //     });
            // }

            if (msg.channel === events.BID_CREATE) {
                pubsub.publish(channels.PROJECT_UPDATE, {
                    projectUpdate: {
                        message: "A new bid has been added",
                        type: events.BID_CREATE,
                        data: payload,
                    },
                });
            }
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
