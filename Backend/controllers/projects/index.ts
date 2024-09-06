import { Router } from "express";
import { addProject } from "./addProject";
import getProjects from "./getProjects";

import getProjectById from "./getProjectById";
import isClient from "../../middlewares/isClient";
import { uploadFile } from "../../middlewares/uploadFiles";
import { updateProject } from "./updateProject";
import isProjectOwner from "../../middlewares/isProjectOwner";
import { deleteProject } from "./deleteProject";
import { deleteFiles } from "./deleteFiles";

const projectsRouter = Router();

projectsRouter.post("/", isClient, uploadFile("projectFiles", 5), addProject);
projectsRouter.get("/", getProjects);

projectsRouter.put("/:projectId", isClient, uploadFile("projectFiles", 5), updateProject);
projectsRouter.get("/:projectId", getProjectById);
projectsRouter.delete("/:projectId/files", isClient, isProjectOwner, deleteFiles);
projectsRouter.delete("/:projectId", isClient, isProjectOwner, deleteProject);

export default projectsRouter;
