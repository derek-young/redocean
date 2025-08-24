import fs from "fs";

import { client } from "./openai";

const routeEmbeddings = JSON.parse(
  fs.readFileSync("src/app/routes-embeddings.json", "utf8")
) as {
  path: string;
  description: string;
  embedding: number[];
}[];

// Simple cosine similarity
function cosineSim(a: number[], b: number[]) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function findRoute(userQuery: string) {
  const resp = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: userQuery,
  });
  const queryEmbedding = resp.data[0].embedding;

  let bestMatch = routeEmbeddings[0];
  let bestScore = -Infinity;

  for (const route of routeEmbeddings) {
    const score = cosineSim(queryEmbedding, route.embedding);

    console.log(`${route.path}: ${score.toFixed(4)}`);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = route;
    }
  }

  console.log(`User query: "${userQuery}"`);
  console.log(`Best match: ${bestMatch.path} (${bestMatch.description})`);
  console.log(`Similarity: ${bestScore.toFixed(4)}`);

  return { path: bestMatch.path, confidence: bestScore };
}

export default findRoute;
