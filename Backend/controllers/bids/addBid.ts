import { Request, Response } from "express";
import { Op } from "sequelize";

import { BidType } from "../../lib/types";
import bidSchema from "../../validation/Bid";
import { Bid } from "../../models/Bid";
import { createJoiError } from "../../lib/utils";

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
