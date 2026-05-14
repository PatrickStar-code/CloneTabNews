import orchestrator from "infra/scripts/orchestrator";
import { version as uuidversion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "patrick",
          email: "[EMAIL_ADDRESS]",
          password: "password",
        }),
      });

      const responseBody = await response.json();

      expect([200, 201]).toContain(response.status);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "patrick",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidversion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("Duplicated email", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email_duplicado1",
          email: "duplicado@gmail.com",
          password: "password",
        }),
      });

      const responseBody = await response.json();

      expect([200, 201]).toContain(response.status);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "email_duplicado1",
        email: "duplicado@gmail.com",
        password: "password",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email_duplicado2",
          email: "Duplicado@gmail.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email já cadastrado",
        action: "Utilize outro email para o cadastro",
        statusCode: 400,
      });
    });

    test("Duplicated username", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "username_duplicado1",
          email: "username_duplicado@gmail.com",
          password: "password",
        }),
      });

      const responseBody = await response.json();

      expect([200, 201]).toContain(response.status);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "username_duplicado1",
        email: "username_duplicado@gmail.com",
        password: "password",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "username_duplicado1",
          email: "username_duplicado2@gmail.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Nome de usuário já cadastrado",
        action: "Utilize outro nome de usuário para o cadastro",
        statusCode: 400,
      });
    });
  });
});
