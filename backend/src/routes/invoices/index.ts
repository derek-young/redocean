import { Router } from "express";

import createInvoice from "./createInvoice";
import { getInvoiceSequenceValue } from "./invoiceSequenceNumber";

const invoicesRouter = Router({ mergeParams: true });

invoicesRouter.post("/", createInvoice);
invoicesRouter.get("/sequence-number", getInvoiceSequenceValue);

export default invoicesRouter;
