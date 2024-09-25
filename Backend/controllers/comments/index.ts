import { Router } from "express";

import addComment from "./addComment";
import getComments from "./getComments";
import deleteComment from "./deleteComment";

import isCommentOwner from "../../middlewares/isCommentOwner";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.post("/", addComment);
commentsRouter.get("/", getComments);
commentsRouter.delete("/:commentId", isCommentOwner, deleteComment);

export default commentsRouter;
