import { Router } from "express";

import naturalLanguageSearch from "./naturalLanguageSearch";
import quickSearch from "./quickSearch";

const router = Router();

router.use("/quick", quickSearch);
router.use("/natural", naturalLanguageSearch);

export default router;
