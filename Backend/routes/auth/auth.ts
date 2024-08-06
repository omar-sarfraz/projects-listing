import { Router, Request, Response } from "express";
import passport from "passport";
import signup from "../../controllers/auth/signup";
import login from "../../controllers/auth/login";

export type UserType = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

// Demo protected route to test passport js functionality
router.get(
    "/secret",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
        return res.status(200).json({ message: "Protected route", error: false });
    }
);

export default router;
