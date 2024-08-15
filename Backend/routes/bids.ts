import { Router } from "express";
import passport from "passport";
import { addBid } from "../controllers/bids/addBid";
import isFreelancer from "../middlewares/isFreelancer";
import isClient from "../middlewares/isClient";
import { acceptBid } from "../controllers/bids/acceptBid";
import isProjectOwner from "../middlewares/isProjectOwner";

const bidsRouter = Router({ mergeParams: true });

bidsRouter.post("/", isFreelancer, addBid);
bidsRouter.post("/:bidId/accept", isClient, isProjectOwner, acceptBid);

export default bidsRouter;
