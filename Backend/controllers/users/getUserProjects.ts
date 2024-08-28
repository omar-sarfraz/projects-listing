import { Request, Response } from "express";
import { Project } from "../../models/Project";
import { CustomRequest } from "../../lib/types";

const getUserProjects = async (req: Request, res: Response) => {
    const customRequest = req as CustomRequest;
    const clientId: number | undefined = customRequest.user.id;

    if (!clientId) return res.status(400).json({ message: "Invalid client Id", error: true });

    try {
        const projects = await Project.findAll({ where: { userId: clientId }, attributes: ["id"] });
        res.status(200).json({ data: projects, error: false });
    } catch (e: any) {
        console.log("Failed to get projects", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getUserProjects;
