import { Router } from "express";
import getUserProjects from "./getUserProjects";
import isClient from "../../middlewares/isClient";

const usersRouter = Router();

usersRouter.get("/projects", isClient, getUserProjects);

export default usersRouter;
