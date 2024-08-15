import express, { Express, Request, Response } from "express";
import cors from "cors";

import passport from "passport";
import "./configs/passport";
import { sequelize } from "./lib/sequelize";

import bidsRouter from "./routes/bids";
import authRouter from "./routes/auth";
import projectsRouter from "./routes/projects";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/", authRouter);

app.use(passport.authenticate("jwt", { session: false }));

app.use("/projects", projectsRouter);
app.use("/projects/:projectId/bids", bidsRouter);

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        // await sequelize.sync({ alter: true });
        // console.log("Models have been synchronized!");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
