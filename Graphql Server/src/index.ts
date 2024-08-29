import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

import cors from "cors";
import express from "express";
import { createServer } from "http";

import { getUser } from "./lib/utils.js";
import { setupDatabase } from "./lib/db.js";
import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";

const PORT = 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

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
        await setupDatabase();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
