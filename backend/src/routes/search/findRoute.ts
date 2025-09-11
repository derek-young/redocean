import { cosineSimilarity } from "@/utils/cosineSimilarity";
import routeEmbeddingsData from "@/data/routes-embeddings.json";

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

export function findRoutesByQuickAction(quickAction: string) {
  const routeEmbeddings = getRouteEmbeddings();
  const searchTerm = quickAction.toLowerCase().trim();

  const routes = routeEmbeddings.reduce(
    (
      acc: (RouteEmbedding & { matchedAction: string })[],
      route: RouteEmbedding
    ) => {
      const matchedAction = route.quickActions.find((action) =>
        action.toLowerCase().includes(searchTerm)
      );

      if (matchedAction !== undefined) {
        acc.push({
          ...route,
          matchedAction,
        });
      }

      return acc;
    },
    []
  );

  return routes;
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
