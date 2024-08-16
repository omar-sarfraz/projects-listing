import express, { Express, Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import "./configs/passport";
import { sequelize } from "./lib/sequelize";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/", authRoutes);
app.use("/projects", projectRoutes);

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
