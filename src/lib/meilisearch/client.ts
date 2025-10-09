import { MeiliSearch } from "meilisearch";

const host = process.env.MEILISEARCH_HOST;
const apiKey = process.env.MEILISEARCH_API_KEY;

let client: MeiliSearch | null = null;

export function getMeilisearchClient(): MeiliSearch | null {
  if (!host) {
    return null;
  }

  if (!client) {
    client = new MeiliSearch({
      host,
      apiKey,
    });
  }

  return client;
}

export const VEHICLES_INDEX = "vehicles";
