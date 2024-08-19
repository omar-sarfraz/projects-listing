import { Request, Response } from "express";
import { Project } from "../../models/Project";
import { error } from "console";
import { BidType, CustomRequest, ProjectType } from "../../lib/types";
import { Bid } from "../../models/Bid";
import { User } from "../../models/User";

const getProjectById = async (expressReq: Request, res: Response) => {
    const req = expressReq as CustomRequest;
    const projectId = parseInt(req.params.projectId);

    if (!projectId) return res.status(400).json({ message: "Invalid projectId" });

    try {
        let project = await Project.findOne({
            where: { id: projectId },
            include: {
                model: Bid,
                include: [
                    {
                        model: User,
                        attributes: ["id", "firstName", "lastName", "email", "role"],
                    },
                ],
            },
        });

        if (!project)
            return res
                .status(404)
                .json({ message: "Project with the given Id not found!", error: true });

        let rawProject: ProjectType = project?.get({ plain: true });

        if (req.user.id !== rawProject.userId && rawProject.bids?.length) {
            // Filtering bids for non-owner or the freelancer
            rawProject.bids = rawProject.bids.filter((bid: BidType) => bid.userId === req.user.id);
        }

        res.status(200).json({ data: rawProject, error: false });
    } catch (e: any) {
        console.log("Failed to get projects", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getProjectById;
