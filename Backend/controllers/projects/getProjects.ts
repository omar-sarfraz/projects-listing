import { Request, Response } from "express";
import { Op } from "sequelize";

import { Project } from "../../models/Project";

const getProjects = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const search = (req.query.search as string) || "";

        const offset = (page - 1) * limit;

        const whereClause = search ? { name: { [Op.iLike]: `%${search}%` } } : {};

        const { rows: projects, count: totalProjects } = await Project.findAndCountAll({
            order: [["createdAt", "DESC"]],
            where: whereClause,
            limit,
            offset,
        });

        res.status(200).json({
            data: projects,
            pagination: {
                totalProjects,
                totalPages: Math.ceil(totalProjects / limit),
                limit,
            },
            error: false,
        });
    } catch (e: any) {
        console.log("Failed to get projects", e);
        res.status(500).json({ message: e.message || "An error has occured.", error: true });
    }
};

export default getProjects;
