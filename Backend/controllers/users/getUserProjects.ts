import { Project } from "../../models/Project";

const getUserProjects = async (clientId: number | undefined) => {
    if (!clientId) return [];

    try {
        const projects = await Project.findAll({ where: { userId: clientId }, attributes: ["id"] });
        const ids = projects.map((project) => project.dataValues.id);
        return ids;
    } catch (e: any) {
        console.log("Failed to get project ids", e);
        return [];
    }
};

export default getUserProjects;
