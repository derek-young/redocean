const fs = require("fs");
const path = require("path");

function generateSchemaSummary() {
  const parentDir = path.dirname(process.cwd());
  const schemaPath = path.join(parentDir, "backend", "prisma", "schema.prisma");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  const dataDir = path.join(parentDir, "backend", "src", "data");
  const outputPath = path.join(dataDir, "schema.json");
  const schemaJson = JSON.stringify(schema, null, 2);

  fs.writeFileSync(outputPath, schemaJson, "utf-8");
}

generateSchemaSummary();
