import { Router } from "express";

import tenantsRouter from "./routes/tenants";
import tenantScopedRouter from "./routes/tenants/:tenantId";
import searchRoutes from "./routes/search";

const v1Router = Router();

v1Router.use("/search", searchRoutes);
v1Router.use("/tenants", tenantsRouter);
v1Router.use("/tenants/:tenantId", tenantScopedRouter);

export default v1Router;
