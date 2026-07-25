#!/usr/bin/env node
/**
 * Applies db/who-said-it.sql to the Supabase Postgres database and prints what
 * landed, including the security-relevant bits (RLS on, no anon grants on the
 * answer tables, host functions not executable by anon).
 *
 *   node scripts/apply-who-said-it.mjs
 *
 * Reads POSTGRES_URL_NON_POOLING from .env.local. That's the port-5432 session
 * mode connection, which supports DDL, functions and ALTER PUBLICATION — the
 * port-6543 transaction pooler does not.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const env = {};
  let raw;
  try {
    raw = readFileSync(join(root, ".env.local"), "utf8");
  } catch {
    return env;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
  return env;
}

const env = { ...loadEnvLocal(), ...process.env };
const connectionString = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL;

if (!connectionString) {
  console.error("No POSTGRES_URL_NON_POOLING in .env.local — cannot connect.");
  process.exit(1);
}

const sql = readFileSync(join(root, "db", "who-said-it.sql"), "utf8");

// pg >=8.16 promotes a connection string's `sslmode=require` to `verify-full`,
// and that takes precedence over the ssl option below. Supabase's pooler
// presents a cert chain that isn't in Node's default trust store, so strip the
// parameter and configure TLS explicitly instead. The connection is still
// encrypted; only chain verification is relaxed.
function withoutSslMode(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    return parsed.toString();
  } catch {
    return url;
  }
}

const client = new pg.Client({
  connectionString: withoutSslMode(connectionString),
  ssl: { rejectUnauthorized: false },
});

const QUERIES = [
  [
    "tables",
    `select tablename from pg_tables
      where schemaname = 'public' and tablename like 'wsi\\_%' order by 1`,
  ],
  [
    "RLS enabled",
    `select relname as table, relrowsecurity as rls
       from pg_class
      where relkind = 'r' and relname like 'wsi\\_%'
      order by 1`,
  ],
  [
    "policies",
    `select tablename as table, policyname, cmd, roles::text
       from pg_policies
      where tablename like 'wsi\\_%' order by 1, 2`,
  ],
  [
    "functions",
    `select proname as function,
            has_function_privilege('anon', p.oid, 'execute') as anon_can_execute
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and proname like 'wsi\\_%'
      order by 1`,
  ],
  [
    "anon table privileges (want false on the answer tables)",
    `select c.relname as table,
            has_table_privilege('anon', c.oid, 'select') as anon_can_select
       from pg_class c
      where c.relkind = 'r' and c.relname like 'wsi\\_%'
      order by 1`,
  ],
  [
    "realtime publication",
    `select tablename from pg_publication_tables
      where pubname = 'supabase_realtime' and tablename like 'wsi\\_%' order by 1`,
  ],
  [
    "quotes by speaker",
    `select said_by, count(*)::int as quotes
       from wsi_quotes group by said_by order by 2 desc, 1 limit 10`,
  ],
  [
    "seed checks",
    `select (select count(*)::int from wsi_quotes) as total,
            (select count(*)::int from wsi_quotes where said_by = 'Monica') as monica,
            (select count(*)::int from wsi_quotes where said_by = 'Kevin')  as kevin,
            (select count(*)::int from wsi_quotes where said_by in ('Mom', 'Dad')) as leftover_mom_dad`,
  ],
];

try {
  await client.connect();
  console.log("connected\n");

  await client.query(sql);
  console.log("db/who-said-it.sql applied\n");

  for (const [label, query] of QUERIES) {
    const { rows } = await client.query(query);
    console.log(`--- ${label} ---`);
    if (!rows.length) console.log("(none)");
    else console.table(rows);
    console.log();
  }
} catch (err) {
  console.error("\nFAILED:", err.message);
  if (/Tenant or user not found|ENOTFOUND|ETIMEDOUT|terminating connection/i.test(err.message)) {
    console.error(
      "\nThis usually means the Supabase project is paused. Restore it in the\n" +
        "dashboard, wait for it to come up, then re-run this script."
    );
  }
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
