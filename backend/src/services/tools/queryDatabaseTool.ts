import schema from "@/data/schema.json";

import { prismaReadOnly } from "@/db";

import { ToolResult } from "./types";

export function getSchemaSummary(): ToolResult {
  return {
    type: "text",
    text: schema,
  };
}

export async function queryDatabase({
  sql,
}: {
  sql: string;
}): Promise<ToolResult> {
  try {
    if (!/^\s*SELECT/i.test(sql)) {
      return {
        type: "text",
        text: "Error: only read-only (SELECT) queries are allowed.",
      };
    }

    const data = await prismaReadOnly.$queryRawUnsafe(sql);

    return {
      type: "text",
      text: JSON.stringify(data),
    };
  } catch (error) {
    console.error("queryDatabase error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      type: "text",
      text: "Database query error: " + errorMessage,
    };
  }
}
