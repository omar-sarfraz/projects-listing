import { Request, Response } from "express";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { ProjectType } from "../../lib/types";
import { createJoiError } from "../../lib/utils";

import { Project } from "../../models/Project";
import projectSchema from "./validationSchema";

export const updateProject = async (req: Request, res: Response) => {
    const project: ProjectType = req.body;
    const projectId: number = parseInt(req.params.projectId);

    if (!projectId) return res.status(400).json({ message: "Invalid project Id", error: true });

    try {
        let validatedProject = await projectSchema.validateAsync(project);

        const nhm = new NodeHtmlMarkdown();
        validatedProject.description = nhm.translate(validatedProject.description);

        await Project.update(validatedProject, { where: { id: projectId } });
        return res.status(200).json({ message: "Project Updated", error: false });
    } catch (e: any) {
        console.log("Error while updating project", e);

        return res.status(500).json({
            message: createJoiError(e) || "An error has occured while updating project",
            error: true,
        });
    }
};
