import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const routes = JSON.parse(
  fs.readFileSync("src/app/api/routes.json", "utf8")
) as {
  path: string;
  pathQuickAction: string;
  description: string;
  fields: string[];
}[];

const client = new OpenAI();

async function generateEmbeddings() {
  const embeddings = [];

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
    "src/app/api/routes-embeddings.json",
    JSON.stringify(embeddings, null, 2)
  );
  console.log(
    "✅ Saved route embeddings to src/app/api/routes-embeddings.json"
  );
}

generateEmbeddings();
