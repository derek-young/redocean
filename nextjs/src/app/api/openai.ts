import fs from "fs";
import OpenAI from "openai";

import { cosineSimilarity } from "./utils";

const client = new OpenAI();
const routes = JSON.parse(
  fs.readFileSync("./src/app/api/routes.json", "utf-8")
);
const routesWithoutQuickActions = routes.map((route: any) => {
  const { quickActions, ...routeWithoutQuickActions } = route;
  return routeWithoutQuickActions;
});

export async function clarifyUserIntent(input: string) {
  const prompt = `
    You are a smart assistant for an accounting web app. Users can search for actions they want to take. 
    You are given a list of all possible routes, each with name, description, and fields:

    ${JSON.stringify(routesWithoutQuickActions)}

    User Query: "${input}"

    Your task:
    1. Determine the route the user most likely wants to go to.
    2. Identify any fields you can pre-fill from the query.
    3. Respond in JSON only (no extra text):

    {
      "route": "<Name of route>",
      "params": {
        "<Field Name>": "<Value>"
      },
      "message": "<Message to user>"
    }

    If no route can be determined confidently, return null for route and an empty object for params and ask the user for clarification with the message.
    `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for routing accounting app searches.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1, // deterministic
  });

  const textResponse = completion.choices[0].message.content;

  if (!textResponse) {
    return {
      route: null,
      params: {},
      message:
        "I'm not sure what you're looking for. You searched for: " + input,
    };
  }

  try {
    return JSON.parse(textResponse);
  } catch (err) {
    console.error("Failed to parse LLM response:", textResponse);
    return {
      route: null,
      params: {},
      message:
        "I'm not sure what you're looking for. You searched for: " + input,
    };
  }
}

async function getTextEmbedding(input: string | string[]) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  console.log(
    `getTextEmbedding: model: ${res.model}; totalTokens: ${res.usage["total_tokens"]}`
  );

  return res.data;
}

async function compareStrings(string1: string, string2: string) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: [string1, string2],
  });

  const similarity = cosineSimilarity(
    res.data[0].embedding,
    res.data[1].embedding
  );

  console.log(
    `compareStrings: model: ${res.model}; totalTokens: ${res.usage["total_tokens"]}`
  );
  console.log(`Similarity between ${string1} and ${string2}: ${similarity}`);
}

export { client, getTextEmbedding, compareStrings };
