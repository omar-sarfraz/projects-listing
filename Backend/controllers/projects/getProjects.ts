import { Request, Response } from "express";
import { Project } from "../../models/Project";

const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json({ data: projects, error: false });
    } catch (e: any) {
        console.log("Failed to get projects", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getProjects;
