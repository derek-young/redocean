import { Router } from "express";

import createVendor from "./createVendor";
import getVendor from "./getVendor";
import getVendors from "./getVendors";
import updateVendor from "./updateVendor";

const router = Router({ mergeParams: true });

router.get("/", getVendors);
router.get("/:id", getVendor);
router.post("/", createVendor);
router.put("/:id", updateVendor);

export default router;
