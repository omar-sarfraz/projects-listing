import { Request, Response } from "express";
import { ProjectType } from "../../lib/types";
import { Project } from "../../models/Project";

export const addProject = async (req: Request, res: Response) => {
    const project: ProjectType = req.body;

    if (!project.name || !project.budget || !project.deadline || !project.description) {
        return res.status(400).json({
            message: "Project name, budget, deadline and description is required!",
            error: true,
        });
    }

    // TO DO
    // Add validation joi

    try {
        let createdProject = await Project.create({ ...project });
        return res.status(200).json({ data: createdProject, error: false });
    } catch (e: any) {
        console.log("Error while adding project", e);
        return res
            .status(500)
            .json({ message: "An error has occured while creating project", error: true });
    }
};
