import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Posting current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para endPoint.",
        action: "Verifique o método HTTP enviado é valido neste endPoint",
        statusCode: 405,
      });
    });
  });
});
