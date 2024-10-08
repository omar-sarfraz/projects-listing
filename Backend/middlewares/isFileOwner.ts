import { Request, Response, NextFunction } from "express";

import { CustomRequest } from "../lib/types";

const isFileOwner = async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const userId: number | undefined = customRequest.user.id;

    if (!userId) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    const path: string = customRequest.body.path;
    if (!path) return res.status(404).json({ message: "No path path was given", error: true });

    const id = parseInt(path.split("/")[0]);
    const isOwner = id === userId;

    if (!isOwner)
        return res
            .status(403)
            .json({ message: "You cannot delete files of other users", error: true });

    next();
};

export default isFileOwner;
