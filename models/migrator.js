import database from "infra/database";
import { join } from "node:path";

let dbClient;

const defaultMigrationOptions = {
  dir: join("infra", "migrations"),
  dryRun: true,
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function getMigrationRunner() {
  const module = await import("node-pg-migrate");
  return module.runner;
}

async function listPendingMigrations() {
  try {
    dbClient = await database.getNewCliente();

    const migrationRunner = await getMigrationRunner();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: true,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  try {
    dbClient = await database.getNewCliente();

    const migrationRunner = await getMigrationRunner();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
