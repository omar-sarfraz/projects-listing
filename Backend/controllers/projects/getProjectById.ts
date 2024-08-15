import { Request, Response } from "express";
import { Project } from "../../models/Project";
import { error } from "console";
import { CustomRequest } from "../../lib/types";
import { Bid } from "../../models/Bid";

const getProjectById = async (expressReq: Request, res: Response) => {
    const req = expressReq as CustomRequest;
    const projectId = req.params.projectId;

    try {
        let project = await Project.findOne({ where: { id: projectId } });

        if (!project)
            return res
                .status(404)
                .json({ message: "Project with the given Id not found!", error: true });

        if (req.user.id === project.dataValues.userId) {
            project = await Project.findOne({ where: { id: projectId }, include: Bid });
        }

        res.status(200).json({ data: project, error: false });
    } catch (e: any) {
        console.log("Failed to get projects", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getProjectById;
