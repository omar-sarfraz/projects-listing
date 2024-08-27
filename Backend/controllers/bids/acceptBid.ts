import { Request, Response } from "express";

import { Bid } from "../../models/Bid";
import { Project } from "../../models/Project";

export const acceptBid = async (req: Request, res: Response) => {
    const bidId: number = parseInt(req.params.bidId);
    const projectId: number = parseInt(req.params.projectId);

    if (!bidId || !projectId) {
        return res.status(400).json({ message: "Invalid bidId or projectId" });
    }

    try {
        const existingBid = await Bid.findOne({
            where: { id: bidId },
        });

        if (!existingBid) return res.status(404).json({ message: "Bid not found!", error: true });

        const existingProject = await Project.findByPk(projectId);
        if (existingProject?.dataValues.acceptedBid)
            return res
                .status(403)
                .json({ message: "You have already accepted a bid for this project", error: true });

        const updateResponse = await Project.update(
            { acceptedBid: bidId },
            { where: { id: projectId }, returning: true }
        );

        const updatedProject = updateResponse[1][0];

        return res.status(200).json({ data: updatedProject, error: false });
    } catch (e: any) {
        console.log("Error while accepting bid", e);

        return res.status(500).json({
            message: e?.message || "An error has occured while accepting bid",
            error: true,
        });
    }
};
