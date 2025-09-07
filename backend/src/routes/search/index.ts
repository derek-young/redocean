import { Router } from "express";

import naturalLanguage from "./naturalLanguage";
import quick from "./quick";

const router = Router();

router.use("/quick", quick);
router.use("/natural", naturalLanguage);

export default router;
