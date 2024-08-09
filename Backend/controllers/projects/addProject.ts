import { Request, Response } from "express";
import { CustomRequest, ProjectType, UserType } from "../../lib/types";
import { Project } from "../../models/Project";
import projectSchema from "../../validation/Project";
import { createJoiError, USER_ROLES } from "../../lib/utils";

export const addProject = async (expressReq: Request, res: Response) => {
    const req = expressReq as CustomRequest;
    const project: ProjectType = req.body;

    if (req.user?.role !== USER_ROLES.client)
        return res.status(403).json({ message: "Only clients can post a project", error: true });
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
