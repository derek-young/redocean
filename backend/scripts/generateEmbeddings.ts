import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

type RouteEmbedding = {
  path: string;
  pathQuickAction: string;
  description: string;
  fields: string[];
};

dotenv.config();

const routes = JSON.parse(
  fs.readFileSync("src/data/routes.json", "utf8")
) as RouteEmbedding[];

const client = new OpenAI();

async function generateEmbeddings() {
  const embeddings: (RouteEmbedding & { embedding: number[] })[] = [];

  for (const route of routes) {
    const resp = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: route.description.toLowerCase(),
    });

    embeddings.push({
      ...route,
      embedding: resp.data[0].embedding,
    });
  }

  fs.writeFileSync(
    "src/data/routes-embeddings.json",
    JSON.stringify(embeddings, null, 2)
  );
  console.log("✅ Saved route embeddings to src/data/routes-embeddings.json");
}

generateEmbeddings();
