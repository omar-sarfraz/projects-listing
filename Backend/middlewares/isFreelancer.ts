import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../lib/types";
import { USER_ROLES } from "../lib/utils";

const isFreelancer = (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    if (customRequest.user?.role !== USER_ROLES.freelancer)
        return res
            .status(403)
            .json({ message: "Only freelancers can perform this action", error: true });
    else next();
};

export default isFreelancer;
