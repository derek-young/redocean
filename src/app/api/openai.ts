import OpenAI from "openai";

import { cosineSimilarity } from "./utils";

const client = new OpenAI();

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
