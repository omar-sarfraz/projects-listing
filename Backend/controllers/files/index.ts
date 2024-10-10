import { Router } from "express";

import isClient from "../../middlewares/isClient";
import { uploadFile } from "../../middlewares/uploadFiles";
import isFileOwner from "../../middlewares/isFileOwner";

import { deleteFiles } from "./deleteFile";
import { addFiles } from "./addFiles";

const filesRouter = Router();

filesRouter.post("/", isClient, uploadFile("projectFiles", 5), addFiles);
filesRouter.delete("/", isClient, isFileOwner, deleteFiles);

export default filesRouter;
