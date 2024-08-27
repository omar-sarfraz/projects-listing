import { Router } from "express";
import { addProject } from "./addProject";
import getProjects from "./getProjects";

import getProjectById from "./getProjectById";
import isClient from "../../middlewares/isClient";
import { uploadFile } from "../../middlewares/uploadFiles";
import { updateProject } from "./updateProject";
import isProjectOwner from "../../middlewares/isProjectOwner";
import { deleteProject } from "./deleteProject";

const projectsRouter = Router();

projectsRouter.post("/", isClient, uploadFile("projectFiles", 5), addProject);
projectsRouter.put("/:projectId", isClient, uploadFile("projectFiles", 5), updateProject);
projectsRouter.delete("/:projectId", isClient, isProjectOwner, deleteProject);
projectsRouter.get("/", getProjects);
projectsRouter.get("/:projectId", getProjectById);

export default projectsRouter;
