import { Router } from "express";
import { addProject } from "./addProject";
import getProjects from "./getProjects";

import getProjectById from "./getProjectById";
import isClient from "../../middlewares/isClient";

const projectsRouter = Router();

projectsRouter.post("/", isClient, addProject);
projectsRouter.get("/", getProjects);
projectsRouter.get("/:projectId", getProjectById);

export default projectsRouter;
