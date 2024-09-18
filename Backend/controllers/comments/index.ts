import { Router } from "express";

import addComment from "./addComment";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.post("/", addComment);

export default commentsRouter;
