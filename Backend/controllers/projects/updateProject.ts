import { Request, Response } from "express";
import { ProjectType } from "../../lib/types";
import { Project } from "../../models/Project";
import projectSchema from "./validationSchema";
import { createJoiError } from "../../lib/utils";
import { NodeHtmlMarkdown } from "node-html-markdown";

export const updateProject = async (req: Request, res: Response) => {
    const project: ProjectType = req.body;
    const projectId: number = parseInt(req.params.projectId);

    if (!projectId) return res.status(400).json({ message: "Invalid project Id", error: true });

    console.log(project, req.files);

    try {
        let validatedProject = await projectSchema.validateAsync(project);

        if (req.files) {
            const existingProject = await Project.findByPk(projectId);
            const existingFiles: string[] = existingProject?.dataValues.files;
            const files = req.files as Express.Multer.File[];

            validatedProject.files = [
                ...existingFiles,
                ...files.map((file) => {
                    let path = file.path;
                    let firstSlash = path.indexOf("/");
                    return path.slice(firstSlash + 1);
                }),
            ];
        }

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
