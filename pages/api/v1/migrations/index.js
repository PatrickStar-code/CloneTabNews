import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import { error } from "node:console";

export default async function migrations(req, res) {
  const alowedMethods = ["GET", "POST"];
  let dbClient;

  if (!alowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }
  dbClient = await database.getNewCliente();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    dryRun: false,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  try {
    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: true,
      });

      return res.status(200).json(pendingMigrations);
    }
    if (req.method === "POST") {
      try {
        const migratedMigrations = await migrationRunner({
          ...defaultMigrationOptions,
          dryRun: false,
        });

        return res
          .status(migratedMigrations.length > 0 ? 201 : 200)
          .json(migratedMigrations);
      } catch (error) {
        if (error.message?.includes("Another migration is already running")) {
          return res.status(200).json([]);
        }
        throw error;
      }
    }
  } catch (error) {
    throw error;
  } finally {
    await dbClient.end();
  }
}
