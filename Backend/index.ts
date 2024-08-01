import express, { Express, Request, Response } from "express";

import authRoutes from "./routes/auth/auth";
import "./configs/passport";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", authRoutes);

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
