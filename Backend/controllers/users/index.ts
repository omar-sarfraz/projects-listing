import { Router } from "express";

import getUserProjects from "./getUserProjects";
import getUserBids from "./getUserBids";

import isClient from "../../middlewares/isClient";
import isFreelancer from "../../middlewares/isFreelancer";

const usersRouter = Router();

usersRouter.get("/projects", isClient, getUserProjects);
usersRouter.get("/bids", isFreelancer, getUserBids);

export default usersRouter;
