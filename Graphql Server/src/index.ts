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
            console.log(ctx.connectionParams);

            // if (tokenIsNotValid(ctx.connectionParams)) {
            //     throw new Error("Auth token missing!");
            // }
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
