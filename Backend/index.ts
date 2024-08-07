import express, { Express, Request, Response } from "express";
const dotenv = require("dotenv");

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
