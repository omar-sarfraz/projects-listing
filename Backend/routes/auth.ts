import { Router } from "express";
import passport from "passport";
import signup from "../controllers/auth/signup";
import login from "../controllers/auth/login";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);

export default authRouter;
