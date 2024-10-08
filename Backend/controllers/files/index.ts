import { Router } from "express";

import isClient from "../../middlewares/isClient";
import { uploadFile } from "../../middlewares/uploadFiles";

import { deleteFiles } from "./deleteFile";
import { addFiles } from "./addFiles";
import isFileOwner from "../../middlewares/isFileOwner";

const filesRouter = Router();

filesRouter.post("/", isClient, uploadFile("projectFiles", 5), addFiles);
filesRouter.delete("/", isClient, isFileOwner, deleteFiles);

export default filesRouter;
