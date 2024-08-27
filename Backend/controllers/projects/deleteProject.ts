import { Request, Response } from "express";
import { Project } from "../../models/Project";
import { createJoiError } from "../../lib/utils";

export const deleteProject = async (req: Request, res: Response) => {
    const projectId: number = parseInt(req.params.projectId);

    if (!projectId) return res.status(400).json({ message: "Invalid project Id", error: true });

    try {
        await Project.destroy({ where: { id: projectId } });
        return res.status(200).json({ message: "Project Deleted", error: false });
    } catch (e: any) {
        console.log("Error while deleting project", e);

        return res.status(500).json({
            message: createJoiError(e) || "An error has occured while deleting project",
            error: true,
        });
    }
};
