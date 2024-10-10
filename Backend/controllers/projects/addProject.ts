import { Request, Response } from "express";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { ProjectType } from "../../lib/types";
import { createJoiError } from "../../lib/utils";

import { Project } from "../../models/Project";
import projectSchema from "./validationSchema";

export const addProject = async (req: Request, res: Response) => {
    const project: ProjectType = req.body;

    try {
        let validatedProject = await projectSchema.validateAsync(project);

        const nhm = new NodeHtmlMarkdown();
        validatedProject.description = nhm.translate(validatedProject.description);

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
