import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import "dotenv/config";

export default async function migrations(req, res) {
  const dbClient = await database.getNewCliente();

  const defaultMigrationOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    dryRun: false,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "GET") {
    try {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: true,
      });

      await dbClient.end();
      return res.status(200).json(pendingMigrations);
    } catch (error) {
      await dbClient.end();

      if (error.message?.includes("Another migration is already running")) {
        return res.status(200).json([]);
      }

      throw error;
    }
  }

  if (req.method === "POST") {
    try {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      await dbClient.end();

      return res
        .status(migratedMigrations.length > 0 ? 201 : 200)
        .json(migratedMigrations);
    } catch (error) {
      await dbClient.end();

      if (error.message?.includes("Another migration is already running")) {
        return res.status(200).json([]);
      }

      throw error;
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
