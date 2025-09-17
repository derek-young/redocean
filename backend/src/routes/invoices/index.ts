import { Router } from "express";

import { createInvoice } from "./createInvoice";

const router = Router();

router.post("/", createInvoice);

export default router;
