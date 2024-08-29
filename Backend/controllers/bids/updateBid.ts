import { Request, Response } from "express";
import { Op } from "sequelize";

import { BidType } from "../../lib/types";
import bidSchema from "./validationSchema";
import { Bid } from "../../models/Bid";
import { createJoiError } from "../../lib/utils";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { Project } from "../../models/Project";

export const updateBid = async (req: Request, res: Response) => {
    const bid: BidType = req.body;
    const bidId: number = parseInt(req.params.bidId);
    const projectId: number = parseInt(req.params.projectId);

    if (!bidId || !projectId) {
        return res.status(400).json({ message: "Invalid bidId or projectId" });
    }

    try {
        const existingProject = await Project.findByPk(projectId);
        if (existingProject?.dataValues.acceptedBid)
            return res
                .status(403)
                .json({ message: "A bid has already been accepted for this project." });

        const validatedBid = await bidSchema.validateAsync(bid);

        const nhm = new NodeHtmlMarkdown();
        validatedBid.description = nhm.translate(validatedBid.description);

        await Bid.update({ ...validatedBid }, { where: { id: bidId } });
        return res.status(200).json({ message: "Bid updated successfully", error: false });
    } catch (e) {
        console.log("Error while updating bid", e);

        return res.status(500).json({
            message: createJoiError(e) || "An error has occured while updating bid",
            error: true,
        });
    }
};
