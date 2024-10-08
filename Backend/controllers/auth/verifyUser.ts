import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { UserType } from "../../lib/types";

import getUserProjects from "../users/getUserProjects";
import getUserBids from "../users/getUserBids";

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, async (err: any, user: UserType) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Unauthorized", error: true });

        const projectIds = await getUserProjects(user.id);
        const bidIds = await getUserBids(user.id);

        const userData = {
            role: user.role,
            id: user.id,
            projectIds,
            bidIds,
        };

        return res.status(200).json({ message: "Token is valid", error: false, data: userData });
    })(req, res, next);
};

export default verifyUser;
