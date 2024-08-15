import { Request, Response } from "express";
import { Op } from "sequelize";

import { Bid } from "../../models/Bid";
import { createJoiError } from "../../lib/utils";
import { Project } from "../../models/Project";

export const acceptBid = async (req: Request, res: Response) => {
    const bidId: number = parseInt(req.params.bidId);
    const projectId: number = parseInt(req.params.projectId);

    try {
        const existingBid = await Bid.findOne({
            where: { id: bidId },
        });

        if (!existingBid) return res.status(404).json({ message: "Bid not found!", error: true });

        const updateResponse = await Project.update(
            { acceptedBid: bidId },
            { where: { id: projectId }, returning: true }
        );

        const updatedProject = updateResponse[1][0];

        return res.status(200).json({ data: updatedProject, error: false });
    } catch (e) {
        console.log("Error while accepting bid", e);

        return res.status(500).json({
            message: createJoiError(e) || "An error has occured while accepting bid",
            error: true,
        });
    }
};
