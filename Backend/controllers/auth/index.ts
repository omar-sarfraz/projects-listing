import { Router } from "express";
import passport from "passport";
import signup from "./signup";
import login from "./login";
import verifyUser from "./verifyUser";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/users/verify", verifyUser);

export default authRouter;
