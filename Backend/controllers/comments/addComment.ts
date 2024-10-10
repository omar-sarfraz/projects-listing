import { Request, Response } from "express";

import { createJoiError } from "../../lib/utils";
import { CustomRequest } from "../../lib/types";

import { User } from "../../models/User";
import { Comment } from "../../models/Comment";

import commentSchema from "./validationSchema";

type CommentType = {
    text: string;
};

const addComment = async (req: Request, res: Response) => {
    const customRequest = req as CustomRequest;
    const userId: number | undefined = customRequest.user.id;
    const projectId: number = parseInt(req.params.projectId);
    const comment: CommentType = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Invalid user Id" });
    }

    if (!projectId) {
        return res.status(400).json({ message: "Invalid projectId" });
    }

    try {
        const validatedComment = await commentSchema.validateAsync(comment);

        const createdComment = await Comment.create({
            ...validatedComment,
            projectId,
            userId,
        });

        const commentWithUser = await Comment.findOne({
            where: { id: createdComment.dataValues.id },
            include: {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
        });

        res.status(200).json({ comment: commentWithUser, error: false });
    } catch (e: any) {
        console.log("Failed to add comment", e);
        res.status(500).json({
            message: createJoiError(e) || "An error has occured while adding comment",
            error: true,
        });
    }
};

export default addComment;
