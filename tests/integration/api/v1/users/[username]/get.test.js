import orchestrator from "infra/scripts/orchestrator";
import { version as uuidversion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact  case match", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "procurado",
          email: "procurado@gmail.com",
          password: "password",
        }),
      });

      expect([200, 201]).toContain(response.status);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/procurado",
      );

      expect([200, 201]).toContain(response2.status);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "procurado",
        email: "procurado@gmail.com",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidversion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("Case  missmatch", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "case.diferente@gmail.com",
          password: "password",
        }),
      });

      expect([200, 201]).toContain(response.status);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect([200, 201]).toContain(response2.status);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "CaseDiferente",
        email: "case.diferente@gmail.com",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidversion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("if dont exist username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/naoexiste",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Usuário não encontrado no sistema",
        action: "Verifique se o Username está digitado corretamente",
        statusCode: 404,
      });
    });
  });
});
