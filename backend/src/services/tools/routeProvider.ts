import routes from "@/data/routes.json";

import { ToolResult } from "./types";

const routesWithoutQuickActions = routes.map((route: any) => {
  const { quickActions, ...routeWithoutQuickActions } = route;
  return routeWithoutQuickActions;
});

export function getRoutes(): ToolResult {
  return {
    type: "text",
    text: JSON.stringify(routesWithoutQuickActions),
  };
}
