import OpenAI from "openai";

// Lazy initialization of OpenAI client to ensure environment variables are loaded
let client: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI();
  }
  return client;
}

type ChatCreateParamsNonStreaming = Omit<
  OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  "model"
> & {
  model?: string;
};

export async function createChat({
  model = "gpt-4o-mini",
  ...restOptions
}: ChatCreateParamsNonStreaming) {
  const response = await getOpenAIClient().chat.completions.create({
    model,
    ...restOptions,
  });

  console.log(
    `createChat: model: ${response.model}; totalTokens: ${response.usage?.total_tokens}`
  );

  return response;
}

type ResponseCreateParamsNonStreaming = Omit<
  OpenAI.Responses.ResponseCreateParamsNonStreaming,
  "model"
> & {
  model?: string;
};

export async function createResponse({
  model = "gpt-4o-mini",
  ...restOptions
}: ResponseCreateParamsNonStreaming) {
  const response = await getOpenAIClient().responses.create({
    model,
    ...restOptions,
  });

  console.log(
    `createResponse: model: ${response.model}; totalTokens: ${response.usage?.total_tokens}`
  );

  return response;
}

export async function createEmbeddings(input: string | string[]) {
  const response = await getOpenAIClient().embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  console.log(
    `createEmbeddings: model: ${response.model}; totalTokens: ${response.usage?.total_tokens}`
  );

  return response;
}

export async function compareStrings(string1: string, string2: string) {
  const res = await getOpenAIClient().embeddings.create({
    model: "text-embedding-3-small",
    input: [string1, string2],
  });

  const { cosineSimilarity } = await import("../utils/cosineSimilarity");
  const similarity = cosineSimilarity(
    res.data[0].embedding,
    res.data[1].embedding
  );

  console.log(
    `compareStrings: model: ${res.model}; totalTokens: ${res.usage["total_tokens"]}`
  );
  console.log(`Similarity between ${string1} and ${string2}: ${similarity}`);
}
