import { Router } from "express";
import passport from "passport";
import { addBid } from "../controllers/bids/addBid";

const bidsRouter = Router();

bidsRouter.post("/", passport.authenticate("jwt", { session: false }), addBid);

export default bidsRouter;
