/* eslint-disable */

const glob = require("glob");
const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

// NOTE: This is just for a POC, this won't work in production as it doesn't scan imported components

// Path to your routes.json
const routesFile = path.join(process.cwd(), "src/app/routes.json");

// 1️⃣ Crawl all page files
const files = glob.sync("src/app/**/page.tsx");

// 2️⃣ Load existing routes.json (if exists)
let existingRoutes = [];
if (fs.existsSync(routesFile)) {
  existingRoutes = JSON.parse(fs.readFileSync(routesFile, "utf8"));
}

// Map existing routes for quick lookup
const routeMap = new Map(existingRoutes.map((r) => [r.path, r]));

// 3️⃣ Helper: Extract fields from JSX
function extractFieldsFromCode(code) {
  const fields = [];

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  traverse(ast, {
    JSXOpeningElement(path) {
      const name =
        path.node.name.type === "JSXIdentifier" ? path.node.name.name : "";
      if (["input", "textarea", "select"].includes(name)) {
        let label = "";
        path.node.attributes.forEach((attr) => {
          if (attr.type === "JSXAttribute") {
            if (attr.name.name === "aria-label") {
              if (attr.value && attr.value.type === "StringLiteral")
                label = attr.value.value;
            }
            if (attr.name.name === "aria-labelledby") {
              if (attr.value && attr.value.type === "StringLiteral")
                label = attr.value.value;
            }
          }
        });
        if (label) fields.push(label);
      }
    },
  });

  return fields;
}

// 4️⃣ Process each page file
const crawledRoutes = files.map((file) => {
  const routePath =
    file
      .replace("src/app", "")
      .replace("/page.tsx", "")
      .replace(/\[([^\]]+)\]/g, ":$1") || "/";

  // Read page content
  const code = fs.readFileSync(file, "utf8");
  const fields = extractFieldsFromCode(code);

  if (routeMap.has(routePath)) {
    const existing = routeMap.get(routePath);
    // Preserve description and merge fields
    return {
      path: routePath,
      description: existing.description,
      fields: fields.length ? fields : existing.fields || [],
    };
  }

  // New route
  return {
    path: routePath,
    description: "no commit",
    fields,
  };
});

// 5️⃣ Write updated routes.json
fs.writeFileSync(routesFile, JSON.stringify(crawledRoutes, null, 2));
console.log(
  `✅ Updated ${routesFile} with ${crawledRoutes.length} routes and fields`
);
