import { Request, Response } from "express";
import { ProjectType } from "../../lib/types";
import { Project } from "../../models/Project";
import projectSchema from "./validationSchema";
import { createJoiError } from "../../lib/utils";

export const addProject = async (req: Request, res: Response) => {
    const project: ProjectType = req.body;

    try {
        const validatedProject = await projectSchema.validateAsync(project);
        const createdProject = await Project.create({ ...validatedProject });
        return res.status(200).json({ data: createdProject, error: false });
    } catch (e: any) {
        console.log("Error while adding project", e);

        return res.status(500).json({
            message: createJoiError(e) || "An error has occured while creating project",
            error: true,
        });
    }
};
