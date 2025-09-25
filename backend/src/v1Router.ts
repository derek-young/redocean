import { Router } from "express";

import customerRoutes from "./routes/customers";
import vendorRoutes from "./routes/vendors";
import searchRoutes from "./routes/search";
import invoiceRoutes from "./routes/invoices";

const v1Router = Router();

v1Router.use("/customers", customerRoutes);
v1Router.use("/vendors", vendorRoutes);
v1Router.use("/search", searchRoutes);
v1Router.use("/invoices", invoiceRoutes);

export default v1Router;
