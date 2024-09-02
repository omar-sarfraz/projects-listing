import { Request, Response } from "express";
import { ProjectType } from "../../lib/types";
import { Project } from "../../models/Project";
import projectSchema from "./validationSchema";
import { createJoiError } from "../../lib/utils";
import { NodeHtmlMarkdown } from "node-html-markdown";

export const addProject = async (req: Request, res: Response) => {
    const project: ProjectType = req.body;

    console.log(project, req.files);

    try {
        let validatedProject = await projectSchema.validateAsync(project);

        if (req.files) {
            const files = req.files as Express.Multer.File[];
            validatedProject.files = files.map((file) => {
                let path = file.path;
                let firstSlash = path.indexOf("/");
                return path.slice(firstSlash + 1);
            });
        }

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
