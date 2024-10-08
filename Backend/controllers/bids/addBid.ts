import { Request, Response } from "express";
import { Op } from "sequelize";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { BidType } from "../../lib/types";
import { createJoiError } from "../../lib/utils";

import bidSchema from "./validationSchema";
import { Bid } from "../../models/Bid";

export const addBid = async (req: Request, res: Response) => {
    const bid: BidType = req.body;
    const projectId: number = parseInt(req.params.projectId);

    if (!projectId) {
        return res.status(400).json({ message: "Invalid projectId" });
    }

    try {
        const validatedBid = await bidSchema.validateAsync(bid);

        const existingBid = await Bid.findOne({
            where: { [Op.and]: [{ userId: bid.userId }, { projectId: projectId }] },
        });

        if (existingBid)
            return res
                .status(400)
                .json({ message: "You have already applied to this project", error: true });

        const nhm = new NodeHtmlMarkdown();
        validatedBid.description = nhm.translate(validatedBid.description);

        const createdBid = await Bid.create({ ...validatedBid, projectId });
        return res.status(200).json({ data: createdBid, error: false });
    } catch (e) {
        console.log("Error while adding bid", e);

        return res.status(500).json({
            message: createJoiError(e) || "An error has occured while adding bid",
            error: true,
        });
    }
};
