import { glob } from "glob";
import path from "path";
import fs from "fs";

const routesFile = path.join(process.cwd(), "src/app/routes.json");

const files = glob.sync("src/app/**/page.tsx");

const crawledRoutes = files.map(
  (file) =>
    file
      .replace("src/app", "")
      .replace("/page.tsx", "")
      .replace(/\[([^\]]+)\]/g, ":$1") || // turn [id] into :id
    "/" // root case
);

let existingRoutes: { path: string; description: string }[] = [];
if (fs.existsSync(routesFile)) {
  existingRoutes = JSON.parse(fs.readFileSync(routesFile, "utf8"));
}

const routeMap = new Map(existingRoutes.map((r) => [r.path, r.description]));

const mergedRoutes = crawledRoutes.map((route) => {
  if (routeMap.has(route)) {
    // keep existing description
    return { path: route, description: routeMap.get(route)! };
  }
  // add placeholder for new route
  return { path: route, description: "TODO: add description" };
});

fs.writeFileSync(routesFile, JSON.stringify(mergedRoutes, null, 2));

console.log(`✅ Updated ${routesFile} with ${mergedRoutes.length} routes`);
