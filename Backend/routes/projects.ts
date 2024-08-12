import { Router } from "express";
import { addProject } from "../controllers/projects/addProject";
import passport from "passport";
import getProjects from "../controllers/projects/getProjects";
import isClient from "../middlewares/isClient";

const router = Router();

router.post("/", passport.authenticate("jwt", { session: false }), isClient, addProject);
router.get("/", passport.authenticate("jwt", { session: false }), getProjects);

export default router;
