import { Router } from "express";

import customerRoutes from "@/routes/customers";
import vendorRoutes from "@/routes/vendors";
import searchRoutes from "@/routes/search";
import invoiceRoutes from "@/routes/invoices";

import validateTenantId from "./validateTenantId";

const tenantScopedRouter = Router({ mergeParams: true });

tenantScopedRouter.use(validateTenantId);
tenantScopedRouter.use("/customers", customerRoutes);
tenantScopedRouter.use("/vendors", vendorRoutes);
tenantScopedRouter.use("/search", searchRoutes);
tenantScopedRouter.use("/invoices", invoiceRoutes);

export default tenantScopedRouter;
