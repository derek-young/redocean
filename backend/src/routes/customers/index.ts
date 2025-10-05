import { Router } from "express";

import createCustomer from "./createCustomer";
import getCustomer from "./getCustomer";
import getCustomers from "./getCustomers";
import updateCustomer from "./updateCustomer";

const router = Router({ mergeParams: true });

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);

export default router;
