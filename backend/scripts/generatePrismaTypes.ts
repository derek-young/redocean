import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map Prisma types to TypeScript types
const typeMapping: Record<string, string> = {
  String: "string",
  Int: "number",
  Boolean: "boolean",
  DateTime: "Date",
  Decimal: "number",
  Json: "any",
  Float: "number",
};

interface Field {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
}

interface EnumDef {
  name: string;
  values: string[];
}

interface ModelDef {
  name: string;
  fields: Field[];
}

function parseSchema(schemaContent: string): {
  enums: EnumDef[];
  models: ModelDef[];
} {
  const enums: EnumDef[] = [];
  const models: ModelDef[] = [];
  const enumNames = new Set<string>();

  // Parse enums first to know which types are enums
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = enumRegex.exec(schemaContent)) !== null) {
    const enumName = match[1];
    const enumBody = match[2];
    const values = enumBody
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("//"))
      .map((line) => line.split("//")[0].trim())
      .filter(Boolean);

    enums.push({ name: enumName, values });
    enumNames.add(enumName);
  }

  // Parse models
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;

  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];
    const fields: Field[] = [];

    // Parse each line in the model
    const lines = modelBody.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines, comments, and lines with @@
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) {
        continue;
      }

      // Skip relationship fields (lines that don't have primitive types or enums)
      // Field format: fieldName Type @attributes
      const fieldMatch = trimmed.match(
        /^(\w+)\s+(\w+)(\[\])?([\?\!])?\s*(.*)?$/
      );
      if (!fieldMatch) {
        continue;
      }

      const [, fieldName, fieldType, isArray, optionalMarker, rest] =
        fieldMatch;

      // Skip if this line contains @relation
      if (rest && rest.includes("@relation")) {
        continue;
      }

      // Only include if it's a primitive type or an enum
      if (typeMapping[fieldType] || enumNames.has(fieldType)) {
        const isOptional = optionalMarker === "?";
        fields.push({
          name: fieldName,
          type: fieldType,
          isOptional,
          isArray: !!isArray,
        });
      }
    }

    models.push({ name: modelName, fields });
  }

  return { enums, models };
}

function generateEnums(enums: EnumDef[]): string {
  let output = "// This file is auto-generated. Do not edit manually.\n";
  output +=
    "// Generated from schema.prisma by running `npm run generate:types` in the backend directory\n\n";

  for (const enumDef of enums) {
    output += `export enum ${enumDef.name} {\n`;
    for (const value of enumDef.values) {
      output += `  ${value} = "${value}",\n`;
    }
    output += "}\n\n";
  }

  return output;
}

function generateTypes(models: ModelDef[], enumNames: Set<string>): string {
  let output = "// This file is auto-generated. Do not edit manually.\n";
  output +=
    "// Generated from schema.prisma by running `npm run generate:types` in the backend directory\n\n";
  output += "import type { ";
  output += Array.from(enumNames).join(", ");
  output += ' } from "./prismaEnums";\n\n';

  for (const model of models) {
    output += `export interface ${model.name}Model {\n`;
    for (const field of model.fields) {
      const tsType = typeMapping[field.type] || field.type;
      const arrayNotation = field.isArray ? "[]" : "";
      const optionalNotation = field.isOptional ? "?" : "";
      output += `  ${field.name}${optionalNotation}: ${tsType}${arrayNotation};\n`;
    }
    output += "}\n\n";
  }

  return output;
}

function main() {
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  const outputDir = path.join(
    __dirname,
    "../../frontend/src/types/__generated__"
  );
  const enumsOutputPath = path.join(outputDir, "prismaEnums.ts");
  const typesOutputPath = path.join(outputDir, "prismaTypes.d.ts");

  // Read the schema file
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");

  // Parse the schema
  const { enums, models } = parseSchema(schemaContent);
  const enumNames = new Set(enums.map((e) => e.name));

  // Generate TypeScript
  const enumsCode = generateEnums(enums);
  const typesCode = generateTypes(models, enumNames);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the output files
  fs.writeFileSync(enumsOutputPath, enumsCode);
  fs.writeFileSync(typesOutputPath, typesCode);

  console.log(`Generated TypeScript files:`);
  console.log(`   - ${enumsOutputPath} (${enums.length} enums)`);
  console.log(`   - ${typesOutputPath} (${models.length} models)`);
}

main();
