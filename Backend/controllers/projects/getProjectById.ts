import { Request, Response } from "express";
import { Project } from "../../models/Project";
import { error } from "console";

const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    try {
        const project = await Project.findOne({ where: { id: projectId } });

        if (!project)
            return res
                .status(404)
                .json({ message: "Project with the given Id not found!", error: true });

        res.status(200).json({ data: project, error: false });
    } catch (e: any) {
        console.log("Failed to get projects", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getProjectById;
