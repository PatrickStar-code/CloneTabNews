import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});
describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("for the first time", () => {
      test("Running pending migrations", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect([200, 201]).toContain(response.status);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
      });
    });
    test("for the second time", async () => {
      const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });

      expect([200, 201]).toContain(response2.status);

      const responseBody2 = await response2.json();
      expect(Array.isArray(responseBody2)).toBe(true);
    });
  });
});
