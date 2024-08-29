import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../../lib/types";

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: UserType) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Unauthorized", error: true });

        const userData = { role: user.role, id: user.id };

        return res.status(200).json({ message: "Token is valid", error: false, data: userData });
    })(req, res, next);
};

export default verifyUser;
