import { Request, Response } from "express";

import { Comment } from "../../models/Comment";
import { User } from "../../models/User";

const getComments = async (req: Request, res: Response) => {
    const projectId: number = parseInt(req.params.projectId);

    if (!projectId) {
        return res.status(400).json({ message: "Invalid projectId" });
    }

    try {
        const comments = await Comment.findAll({
            where: { projectId },
            include: { model: User, attributes: ["id", "firstName", "lastName"] },
        });

        res.status(200).json({ data: comments, error: false });
    } catch (e: any) {
        console.log("Failed to fetch comments", e);
        res.status(500).json({
            message: "An error has occured while fetching comments",
            error: true,
        });
    }
};

export default getComments;
