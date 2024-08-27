import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import cors from "cors";
import express from "express";
import { createServer } from "http";

import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

import utils from "./lib/utils.js";

const PORT = 4000;
const pubsub = new PubSub();

const typeDefs = `
  type Query {
    _empty: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

const resolvers = {
    Subscription: {
        numberIncremented: {
            subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
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
        onConnect: async (ctx) => {
            try {
                const authHeader: string | undefined = ctx.connectionParams?.Authorization as
                    | string
                    | undefined;

                if (!authHeader) throw new Error("Auth token is required!");
                const token: string = authHeader.split(" ")[1];
                if (!token) throw new Error("Missing Token!");

                const data = await utils.verifyUser(token);
                console.log(data);
            } catch (error: any) {
                console.error("Connection error:", error.message);
                return false;
            }
        },
        onDisconnect(ctx, code, reason) {
            console.log("Disconnected!");
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

httpServer.listen(PORT, () => {
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/`);
});

let currentNumber = 0;

function incrementNumber() {
    currentNumber++;
    pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
    setTimeout(incrementNumber, 1000);
}

incrementNumber();
