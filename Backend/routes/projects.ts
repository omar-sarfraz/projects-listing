import { Router } from "express";
import { addProject } from "../controllers/projects/addProject";
import passport from "passport";
import getProjects from "../controllers/projects/getProjects";
import getProjectById from "../controllers/projects/getProjectById";

const router = Router();

router.post("/", passport.authenticate("jwt", { session: false }), addProject);
router.get("/", passport.authenticate("jwt", { session: false }), getProjects);
router.get("/:id", passport.authenticate("jwt", { session: false }), getProjectById);

export default router;
