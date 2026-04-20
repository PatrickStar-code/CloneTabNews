import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("should list pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");

      expect(response.status).toBe(200);

      const migrations = await response.json();
      expect(Array.isArray(migrations)).toBe(true);
    });
  });
});
