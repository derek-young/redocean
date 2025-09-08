import {
  FunctionTool,
  Response,
  ResponseInput,
} from "openai/resources/responses/responses";

import { createResponse } from "@/services/openai";

import { findEntityByName } from "@/services/tools/findEntityByName";
import {
  getSchemaSummary,
  queryDatabase,
} from "@/services/tools/queryDatabaseTool";
import { getRoutes } from "@/services/tools/routeProvider";
import { ToolResult } from "@/services/tools/types";

const tools = [
  {
    type: "function",
    name: "findEntityByName",
    description:
      "Search across Customers and Vendors for a name that matches the user query. Returns best matches with type, id, and name.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The name or partial name to search for",
        },
      },
      additionalProperties: false,
      required: ["query"],
    },
    strict: true,
  },
  {
    type: "function",
    name: "getRoutes",
    description: "Get a list of all possible routes and available fields",
    parameters: null,
    strict: null,
  },
  {
    type: "function",
    name: "getSchemaSummary",
    description: "Get a summary of the database schema",
    parameters: null,
    strict: null,
  },
  {
    type: "function",
    name: "queryDatabase",
    description: "Query the database using a stringified SQL query",
    parameters: {
      type: "object",
      properties: {
        sql: {
          type: "string",
          description: "A stringified SQL query",
        },
      },
      additionalProperties: false,
      required: ["sql"],
    },
    strict: true,
  },
] as const satisfies FunctionTool[];

type ToolName = (typeof tools)[number]["name"];

type ToolHandlers = {
  [K in ToolName]: (...args: any[]) => Promise<ToolResult> | ToolResult;
};

const toolHandlers: ToolHandlers = {
  findEntityByName,
  getRoutes,
  getSchemaSummary,
  queryDatabase,
};

function isToolHandler(name: string): name is keyof typeof toolHandlers {
  return name in toolHandlers;
}

const prompt = `
  Your name is Capt'n and you use old-timey, sailor language.
  You are a smart assistant for an accounting web app. 
  You will help users complete a task, find information, or answer a question.

  To assist them, you have access to these tools:
    - findEntityByName: Fuzzy match by name on entities in the database. Returns best matches with type, id, and name.
    - getRoutes: Get a list of all possible routes, each with name, description, and fields
    - getSchemaSummary: Get a summary of the database schema to understand what can be queried
    - queryDatabase: Query the database to find information

  When forming a SQL query with queryDatabase, you must first call getSchemaSummary to ensure column and table names are correct. 
  Never invent or assume column or table names. If you do not see something in the schema summary, it does not exist.
  Always double-quote identifiers to avoid casing mismatches.

  Your task:
    1. Determine the user's intent.
    2. For a task, route the user to the view intended for that task and prefill the appropriate fields.
    3. For a data request, route the user to the view whose purpose is to display that data and prefill the appropriate filters.
    4. For a question, answer the question in the 'message' property.
    5. Respond in this JSON format only:

    {
      "route": "<Name of route>" | null,
      "params": {
        "<Field Name>": "<Value>"
      } | {},
      "message": "<Message to user>"
    }

  If not null, the 'route' property will be displayed to the user as a link.
  The 'params' property will be used to prefill input fields or filters.
  The 'message' property will be displayed to the user.

  If the user's intent cannot be determined confidently, ask the user for clarification.

  Examples:

  Input: "create an invoice for Acme Corp"
  Output: You cannot create data directly, instead you will route the user to the create 
  invoice view and prepopulate the appropriate fields.

  Input: "find all payments to Xcel Energy this year"
  Output: Route the user to the Payments view with the appropriate filters applied

  Input: "how much did I spend on advertising last quarter?"
  Output: Use the 'message' property to answer the question. There is no routing in this example.
  `;

const MAX_RECURSION_DEPTH = 5;

async function initiateRequests(
  input: ResponseInput,
  depth: number = 0
): Promise<Response> {
  console.log(
    "initiateRequests input:",
    input.map((item) => item.type).join(" ")
  );

  return createResponse({
    input,
    tools,
    tool_choice: "auto",
    temperature: 0.2,
  }).then(async (response) => {
    console.log(`searchAgent output # ${depth}:`, response.output);

    if (depth >= MAX_RECURSION_DEPTH) {
      console.warn("Max recursion depth reached, forcing a response.");

      return {
        ...response,
        outputText: {
          route: null,
          params: {},
          message:
            "Arr, matey! My compass must be off as I can't find yer heading. Try narrowing down yer search or question.",
        },
      };
    }

    const nextInput = [...input, ...response.output];
    let hasToolCalls = false;

    for (let i = 0; i < response.output.length; i++) {
      const item = response.output[i];

      if (item.type === "function_call" && isToolHandler(item.name)) {
        hasToolCalls = true;
        console.log("Calling tool handler: ", item.name);
        const fn = toolHandlers[item.name];
        const args = item.arguments ? JSON.parse(item.arguments) : undefined;
        const toolResult = await fn(args);

        if (item.name === "queryDatabase") {
          console.log("queryDatabase result: ", toolResult);
        }

        nextInput.push({
          type: "function_call_output",
          call_id: item.call_id,
          output: toolResult.text,
        });
      }
    }

    if (hasToolCalls) {
      return initiateRequests(nextInput, depth + 1);
    }

    return response;
  });
}

export default async function searchAgent(searchTerm: string) {
  console.log("Calling searchAgent with searchTerm:", searchTerm);
  const input: ResponseInput = [
    { role: "system", content: prompt },
    { role: "user", content: searchTerm },
  ];

  return initiateRequests(input);
}
