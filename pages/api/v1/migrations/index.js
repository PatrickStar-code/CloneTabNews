import "dotenv/config";
import { createRouter } from "next-connect";
import controller from "infra/controller";
export const router = createRouter();
import migrator from "models/migrator";

router.get(getMigrations);
router.post(postMigrations);

export default router.handler(controller.errorHandlers);

async function getMigrations(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pendingMigrations);
}

async function postMigrations(req, res) {
  const migratedMigrations = await migrator.runPendingMigrations();
  return res
    .status(migratedMigrations.length > 0 ? 201 : 200)
    .json(migratedMigrations);
}
