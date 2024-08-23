import { Router } from "express";

import { addBid } from "./addBid";
import { acceptBid } from "./acceptBid";
import { deleteBid } from "./deleteBid";

import isClient from "../../middlewares/isClient";
import isBidOwner from "../../middlewares/isBidOwner";
import isFreelancer from "../../middlewares/isFreelancer";
import isProjectOwner from "../../middlewares/isProjectOwner";
import { updateBid } from "./updateBid";

const bidsRouter = Router({ mergeParams: true });

bidsRouter.post("/", isFreelancer, addBid);
bidsRouter.post("/:bidId/accept", isClient, isProjectOwner, acceptBid);
bidsRouter.delete("/:bidId", isFreelancer, isBidOwner, deleteBid);
bidsRouter.put("/:bidId", isFreelancer, isBidOwner, updateBid);

export default bidsRouter;
