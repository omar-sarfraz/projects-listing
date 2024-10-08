import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";

import { CustomRequest } from "../lib/types";
import { Project } from "../models/Project";

const isProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const projectId: number = parseInt(customRequest.params.projectId);
    const clientId: number | undefined = customRequest.user.id;

    if (!clientId || !projectId) {
        return res.status(400).json({ message: "Invalid clientId or projectId" });
    }

    const existingProject = await Project.findOne({
        where: {
            [Op.and]: [{ id: projectId }, { userId: clientId }],
        },
    });

    if (!existingProject)
        return res.status(404).json({ message: "Project not found for this client", error: true });
    else next();
};

export default isProjectOwner;
