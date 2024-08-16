import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../lib/types";
import { Project } from "../models/Project";
import { Op } from "sequelize";
import { Bid } from "../models/Bid";

const isBidOwner = async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const projectId: number = parseInt(customRequest.params.projectId);
    const bidId: number = parseInt(customRequest.params.bidId);
    const freelancerId: number | undefined = customRequest.user.id;

    // const existingProject = Project.findOne({
    //     where: {
    //         [Op.and]: [{ id: projectId }],
    //     },
    // });

    const existingBid = await Bid.findOne({
        where: {
            [Op.and]: [{ id: bidId }, { userId: freelancerId }],
        },
    });

    if (!existingBid)
        return res.status(404).json({ message: "Bid not found for this freelancer", error: true });
    else next();
};

export default isBidOwner;
