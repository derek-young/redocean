import { Router } from "express";

import createInvoice from "./createInvoice";
import { getInvoiceSequenceNumber } from "./invoiceSequenceNumber";

const invoicesRouter = Router({ mergeParams: true });

invoicesRouter.post("/", createInvoice);
invoicesRouter.get("/sequence-number", getInvoiceSequenceNumber);

export default invoicesRouter;
