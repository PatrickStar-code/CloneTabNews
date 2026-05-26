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
      const user = await orchestrator.createUser({});

      expect(user).toEqual({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });

      expect(uuidversion(user.id)).toBe(4);
      expect(Date.parse(user.created_at)).not.toBeNaN();
      expect(Date.parse(user.updated_at)).not.toBeNaN();
    });

    test("Case  missmatch", async () => {
      const user = await orchestrator.createUser({});

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${user.username.toLowerCase()}`,
      );

      expect(response2.status).toBe(200);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: user.username,
        email: user.email,
        password: user.password,
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
