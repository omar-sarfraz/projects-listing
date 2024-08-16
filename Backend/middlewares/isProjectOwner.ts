import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../lib/types";
import { Project } from "../models/Project";
import { Op } from "sequelize";

const isProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;

    const projectId: number = parseInt(customRequest.params.projectId);
    const clientId: number | undefined = customRequest.user.id;

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
