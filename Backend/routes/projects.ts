import { Router } from "express";
import { addProject } from "../controllers/projects/addProject";
import getProjects from "../controllers/projects/getProjects";

import getProjectById from "../controllers/projects/getProjectById";
import isClient from "../middlewares/isClient";

const projectsRouter = Router();

projectsRouter.post("/", isClient, addProject);
projectsRouter.get("/", getProjects);
projectsRouter.get("/:id", getProjectById);

export default projectsRouter;
