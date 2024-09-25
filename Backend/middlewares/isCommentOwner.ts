import { Request, Response, NextFunction } from "express";

import { Op } from "sequelize";

import { Comment } from "../models/Comment";
import { CustomRequest } from "../lib/types";

const isCommentOwner = async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const commentId: number = parseInt(customRequest.params.commentId);
    const userId: number | undefined = customRequest.user.id;

    if (!commentId || !userId) {
        return res.status(400).json({ message: "Invalid commentId or userId" });
    }

    const existingBid = await Comment.findOne({
        where: {
            [Op.and]: [{ id: commentId }, { userId }],
        },
    });

    if (!existingBid)
        return res.status(404).json({ message: "Comment not found for this user", error: true });
    else next();
};

export default isCommentOwner;
