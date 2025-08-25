import fs from "fs";
import { cosineSimilarity } from "./utils";

const routeEmbeddings = JSON.parse(
  fs.readFileSync("src/app/routes-embeddings.json", "utf8")
) as {
  path: string;
  quickActions: string[];
  description: string;
  embedding: number[];
}[];

export async function findRouteByQuickAction(quickAction: string) {
  const route = routeEmbeddings.find((route) =>
    route.quickActions.includes(quickAction.toLowerCase().trim())
  );

  if (route) {
    console.log(`Found route by quick action: ${route.path}`);
  }

  return route;
}

export async function findRouteByEmbedding(queryEmbedding: number[]) {
  let bestMatch = routeEmbeddings[0];
  let bestScore = -Infinity;

  for (const route of routeEmbeddings) {
    const score = cosineSimilarity(queryEmbedding, route.embedding);

    console.log(`${route.path}: ${score.toFixed(4)}`);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = route;
    }
  }

  console.log(`Best match: ${bestMatch.path} (${bestMatch.description})`);
  console.log(`Similarity: ${bestScore.toFixed(4)}`);

  return { path: bestMatch.path, confidence: bestScore };
}
