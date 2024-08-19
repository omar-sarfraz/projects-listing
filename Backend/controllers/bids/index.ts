import { Router } from "express";

import { addBid } from "./addBid";
import { acceptBid } from "./acceptBid";
import { deleteBid } from "./deleteBid";

import isClient from "../../middlewares/isClient";
import isBidOwner from "../../middlewares/isBidOwner";
import isFreelancer from "../../middlewares/isFreelancer";
import isProjectOwner from "../../middlewares/isProjectOwner";

const bidsRouter = Router({ mergeParams: true });

bidsRouter.post("/", isFreelancer, addBid);
bidsRouter.post("/:bidId/accept", isClient, isProjectOwner, acceptBid);
bidsRouter.delete("/:bidId", isFreelancer, isBidOwner, deleteBid);

export default bidsRouter;
