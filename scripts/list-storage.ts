import "dotenv/config";

import { getSupabaseAdmin } from "@/lib/supabase/server";

async function list(prefix = "", indent = ""): Promise<void> {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "Auto-Nexus-bj";
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw new Error(`Erreur lors du listing du prefixe "${prefix}": ${error.message}`);
  }

  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    const display = entry.name.endsWith("/") ? `${entry.name} (folder)` : entry.name;

    console.log(`${indent}${display}`);

    if (entry.name.endsWith("/")) {
      await list(path, `${indent}  `);
    }
  }
}

async function main(): Promise<void> {
  await list();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
