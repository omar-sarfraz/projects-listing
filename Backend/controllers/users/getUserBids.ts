import { Request, Response } from "express";
import { Project } from "../../models/Project";
import { CustomRequest } from "../../lib/types";
import { Bid } from "../../models/Bid";

const getUserBids = async (req: Request, res: Response) => {
    const customRequest = req as CustomRequest;
    const freelancerId: number | undefined = customRequest.user.id;

    if (!freelancerId)
        return res.status(400).json({ message: "Invalid freelancer Id", error: true });

    try {
        const bids = await Bid.findAll({ where: { userId: freelancerId }, attributes: ["id"] });
        res.status(200).json({ data: bids, error: false });
    } catch (e: any) {
        console.log("Failed to get bids", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getUserBids;
