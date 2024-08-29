import { Router } from "express";
import getUserProjects from "./getUserProjects";
import isClient from "../../middlewares/isClient";
import isFreelancer from "../../middlewares/isFreelancer";
import getUserBids from "./getUserBids";

const usersRouter = Router();

usersRouter.get("/projects", isClient, getUserProjects);
usersRouter.get("/bids", isFreelancer, getUserBids);

export default usersRouter;
