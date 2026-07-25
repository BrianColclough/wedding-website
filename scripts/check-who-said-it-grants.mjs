#!/usr/bin/env node
/**
 * Prints exactly what the public `anon` role can do to the wsi_ tables.
 *
 *   node scripts/check-who-said-it-grants.mjs
 *
 * anon should hold SELECT on wsi_rooms and wsi_players and nothing at all on
 * wsi_quotes, wsi_rounds, wsi_guesses or wsi_room_secrets. Anything else means a
 * player could read the answers with the public key that ships in the browser
 * bundle.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!match) continue;
  let value = match[2].trim();
  const quoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));
  env[match[1]] = quoted ? value.slice(1, -1) : value;
}

const url = new URL(env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL);
url.searchParams.delete("sslmode");

const READABLE = new Set(["wsi_rooms", "wsi_players"]);

const client = new pg.Client({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const { rows } = await client.query(
    `select c.relname as table_name,
            c.relrowsecurity as rls,
            coalesce(
              (select string_agg(g.privilege_type, ', ' order by g.privilege_type)
                 from information_schema.role_table_grants g
                where g.grantee = 'anon'
                  and g.table_schema = 'public'
                  and g.table_name = c.relname),
              '(none)'
            ) as anon_grants
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'wsi\\_%'
      order by 1`
  );

  let bad = 0;
  const report = rows.map((row) => {
    const shouldRead = READABLE.has(row.table_name);
    const expected = shouldRead ? "SELECT" : "(none)";
    const ok = row.rls && row.anon_grants === expected;
    if (!ok) bad++;
    return { ...row, expected, verdict: ok ? "ok" : "REVIEW" };
  });

  console.table(report);

  const { rows: fns } = await client.query(
    `select p.proname as function_name,
            has_function_privilege('anon', p.oid, 'execute') as anon_can_execute
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname like 'wsi\\_%'
      order by 1`
  );
  console.table(fns);
  for (const fn of fns) if (fn.anon_can_execute) bad++;

  console.log(bad === 0 ? "\nAll good — anon is locked out of everything it should be." : `\n${bad} problem(s) above.`);
  process.exitCode = bad === 0 ? 0 : 1;
} catch (err) {
  console.error("FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
