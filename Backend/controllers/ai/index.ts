import { Router } from "express";

import isClient from "../../middlewares/isClient";
import getAiSuggestions from "./getAiSuggestions";

const aiRouter = Router();

aiRouter.get("/suggestions", isClient, getAiSuggestions);

export default aiRouter;
