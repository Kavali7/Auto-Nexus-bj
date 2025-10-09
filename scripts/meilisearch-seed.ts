import "dotenv/config";

import { getMeilisearchClient, VEHICLES_INDEX } from "@/lib/meilisearch/client";
import { vehicles } from "@/data";

async function main() {
  const client = getMeilisearchClient();

  if (!client) {
    throw new Error(
      "Impossible de créer le client Meilisearch. Vérifiez MEILISEARCH_HOST dans .env.",
    );
  }

  const index = client.index(VEHICLES_INDEX);

  await index.updateFilterableAttributes([
    "brand",
    "model",
    "city",
    "fuel",
    "condition",
    "dealerId",
  ]);

  await index.updateSearchableAttributes([
    "brand",
    "model",
    "trim",
    "city",
    "dealerName",
    "highlights",
  ]);

  const records = vehicles.map((vehicle) => ({
    id: vehicle.id,
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim,
    city: vehicle.city,
    condition: vehicle.condition,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    year: vehicle.year,
    price: vehicle.price,
    dealerId: vehicle.dealerId,
    dealerName: vehicle.dealerId,
    highlights: vehicle.highlights,
    heroImage: vehicle.heroImage,
  }));

  const task = await index.addDocuments(records);

  console.log(`Task ${task.taskUid} envoyée (documents: ${records.length}).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
