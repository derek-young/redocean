import { prisma } from "../../lib/db";
import { cosineSimilarity } from "./utils";

async function getRouteEmbeddings() {
  return await prisma.routeEmbedding.findMany();
}

export async function findRouteByQuickAction(quickAction: string) {
  const routeEmbeddings = await getRouteEmbeddings();
  const route = routeEmbeddings.find(
    (route: any) => route.pathQuickAction === quickAction.toLowerCase().trim()
  );

  if (route) {
    console.log(`Found route by quick action: ${route.path}`);
  }

  return route;
}

export async function findRouteByEmbedding(queryEmbedding: number[]) {
  const routeEmbeddings = await getRouteEmbeddings();

  if (routeEmbeddings.length === 0) {
    throw new Error("No route embeddings found in database");
  }

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
