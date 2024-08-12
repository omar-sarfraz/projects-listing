import { Router } from "express";
import passport from "passport";
import { addBid } from "../controllers/bids/addBid";
import isFreelancer from "../middlewares/isFreelancer";

const bidsRouter = Router();

bidsRouter.post("/", isFreelancer, addBid);

export default bidsRouter;
