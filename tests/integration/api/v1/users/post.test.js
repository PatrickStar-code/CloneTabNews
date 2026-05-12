import orchestrator from "infra/scripts/orchestrator";
import database from "infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const result = await database.query({
        text: `
    INSERT INTO users(username, email, password)
    VALUES($1, $2, $3)
    RETURNING *
  `,
        values: ["patrick", "[EMAIL_ADDRESS]", "password"],
      });

      console.log(result.rows);

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });

      expect([200, 201]).toContain(response.status);
    });
  });
});
