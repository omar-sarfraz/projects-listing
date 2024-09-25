import "./configs/instrument";

import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";

import passport from "passport";
import "./configs/passport";
import { sequelize } from "./lib/sequelize";
import morgan from "morgan";

import bidsRouter from "./controllers/bids";
import authRouter from "./controllers/auth";
import projectsRouter from "./controllers/projects";
import usersRouter from "./controllers/users";

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
