import database from "infra/database";
import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});

test("GET /api/v1/migrations should list pending migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");

  expect(response.status).toBe(200);

  const migrations = await response.json();
  expect(Array.isArray(migrations)).toBe(true);
});
