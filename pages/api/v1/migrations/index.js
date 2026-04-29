import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import "dotenv/config";
import { createRouter } from "next-connect";
import controller from "infra/controller";
export const router = createRouter();

router.get(getMigrations);
router.post(postMigrations);

export default router.handler(controller.errorHandlers);

async function getMigrations(req, res) {
  const dbClient = await database.getNewCliente();

  const defaultMigrationOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    dryRun: false,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const pendingMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: true,
  });

  await dbClient.end();
  return res.status(200).json(pendingMigrations);
}

async function postMigrations(req, res) {
  const dbClient = await database.getNewCliente();

  const defaultMigrationOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    dryRun: false,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
  });

  await dbClient.end();

  return res
    .status(migratedMigrations.length > 0 ? 201 : 200)
    .json(migratedMigrations);
}
