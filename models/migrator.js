import database from "infra/database";
import { join } from "node:path";
import { runner as migrationRunner } from "node-pg-migrate";

let dbClient;

const defaultMigrationOptions = {
  dir: join("infra", "migrations"),
  dryRun: true,
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  try {
    dbClient = await database.getNewCliente();

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
