import { Router } from "express";
import passport from "passport";
import signup from "./signup";
import login from "./login";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);

export default authRouter;
