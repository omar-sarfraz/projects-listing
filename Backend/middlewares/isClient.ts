import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../lib/types";
import { USER_ROLES } from "../lib/utils";

const isClient = (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    if (customRequest.user?.role !== USER_ROLES.client)
        return res.status(403).json({ message: "Only clients can post a project", error: true });
    else next();
};

export default isClient;
