import { Router } from "express";

import { addProject } from "./addProject";
import getProjects from "./getProjects";
import getProjectById from "./getProjectById";
import { updateProject } from "./updateProject";
import { deleteProject } from "./deleteProject";

import isClient from "../../middlewares/isClient";
import { uploadFile } from "../../middlewares/uploadFiles";
import isProjectOwner from "../../middlewares/isProjectOwner";

const projectsRouter = Router();

projectsRouter.post("/", isClient, addProject);
projectsRouter.get("/", getProjects);

projectsRouter.put("/:projectId", isClient, updateProject);
projectsRouter.get("/:projectId", getProjectById);

projectsRouter.delete("/:projectId", isClient, isProjectOwner, deleteProject);

export default projectsRouter;
