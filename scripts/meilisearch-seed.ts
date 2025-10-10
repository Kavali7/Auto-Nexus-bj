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

  try {
    await client.health();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "erreur inconnue (healthcheck)";

    if (/ECONNREFUSED/i.test(message)) {
      throw new Error(
        `Connexion Meilisearch impossible sur ${process.env.MEILISEARCH_HOST}. Lance d'abord le serveur (ex: './meilisearch --master-key ...' ou le conteneur Docker) puis relance le seed.`,
      );
    }

    throw new Error(
      `Echec du healthcheck Meilisearch (${message}). Verifie MEILISEARCH_HOST / API key.`,
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
