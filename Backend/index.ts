import "./configs/instrument";

import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import * as Sentry from "@sentry/node";
import passport from "passport";

import "./configs/passport";

import { sequelize } from "./lib/sequelize";

import bidsRouter from "./controllers/bids";
import authRouter from "./controllers/auth";
import projectsRouter from "./controllers/projects";
import usersRouter from "./controllers/users";
import aiRouter from "./controllers/ai";
import commentsRouter from "./controllers/comments";
import filesRouter from "./controllers/files";

const app: Express = express();
const PORT = process.env.PORT || 3000;

if (process.env.ENVIRONMENT === "development") app.use(morgan("tiny"));

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/", authRouter);

app.use(passport.authenticate("jwt", { session: false }));

app.use("/projects", projectsRouter);
app.use("/projects/:projectId/bids", bidsRouter);
app.use("/users", usersRouter);
app.use("/ai", aiRouter);
app.use("/files", filesRouter);
app.use("/projects/:projectId/comments", commentsRouter);

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        await sequelize.sync({ alter: true });
        console.log("Models have been synchronized!");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
