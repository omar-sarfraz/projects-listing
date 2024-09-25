import { expressMiddleware } from "@apollo/server/express4";

import cors from "cors";
import express from "express";
import { createServer } from "http";

import { getUser } from "./lib/utils.js";
import { setupDatabase } from "./lib/db.js";
import { GraphQLError } from "graphql";
import createApolloServer from "./lib/apolloServer.js";

const PORT = 4000;

const app = express();
const httpServer = createServer(app);

const server = createApolloServer(httpServer);
await server.start();

app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => {
            const token: string = req.headers.authtoken as string;
            const user = await getUser(undefined, token);

            if (!user)
                throw new GraphQLError("User is not authenticated", {
                    extensions: {
                        code: "UNAUTHENTICATED",
                        http: { status: 401 },
                    },
                });

            return { user };
        },
    })
);

httpServer.listen(PORT, async () => {
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/`);
    try {
        await setupDatabase();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
