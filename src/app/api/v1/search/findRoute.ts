import { cosineSimilarity } from "@/app/api/utils";
import routeEmbeddingsData from "@/app/api/routes-embeddings.json";

interface RouteEmbedding {
  path: string;
  quickActions: string[];
  description: string;
  fields: string[];
  embedding: number[];
}

function getRouteEmbeddings(): RouteEmbedding[] {
  return routeEmbeddingsData as RouteEmbedding[];
}

export async function findRouteByQuickAction(quickAction: string) {
  const routeEmbeddings = getRouteEmbeddings();
  const searchTerm = quickAction.toLowerCase().trim();

  const route = routeEmbeddings.find((route: RouteEmbedding) =>
    route.quickActions.some((action) =>
      action.toLowerCase().includes(searchTerm)
    )
  );

  if (route) {
    console.log(`Found route by quick action: ${route.path}`);
  }

  return route;
}

export async function findRouteByEmbedding(queryEmbedding: number[]) {
  const routeEmbeddings = getRouteEmbeddings();

  if (routeEmbeddings.length === 0) {
    throw new Error("No route embeddings found in JSON file");
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
