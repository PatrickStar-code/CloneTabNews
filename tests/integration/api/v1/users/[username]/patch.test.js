import orchestrator from "infra/scripts/orchestrator";
import { version as uuidversion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("if dont exist username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/naoexiste",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "novo nome",
          }),
        },
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

  test("Duplicated username", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user1",
        email: "username_duplicado@gmail.com",
        password: "password",
      }),
    });

    const user1ResponseBody = await user1Response.json();

    expect([200, 201]).toContain(user1Response.status);
    expect(user1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "user1",
      email: "username_duplicado@gmail.com",
      password: user1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: user1ResponseBody.updated_at,
    });

    const user2Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user2",
        email: "username_duplicado2@gmail.com",
        password: "password",
      }),
    });

    expect(user2Response.status).toBe(201);

    const user2ResponseBody = await user2Response.json();

    expect(user2ResponseBody).toEqual({
      id: user2ResponseBody.id,
      username: "user2",
      email: "username_duplicado2@gmail.com",
      password: user2ResponseBody.password,
      created_at: user2ResponseBody.created_at,
      updated_at: user2ResponseBody.updated_at,
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/${user1ResponseBody.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "user2",
        }),
      },
    );

    expect(updateUser1.status).toBe(400);

    const updateUser1ResponseBody = await updateUser1.json();

    expect(updateUser1ResponseBody).toEqual({
      name: "ValidationError",
      message: "Nome de usuário já cadastrado",
      action: "Utilize outro nome de usuário para realizar esta operação",
      statusCode: 400,
    });
  });

  test("Duplicated email", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "email1",
        email: "email_duplicado1@gmail.com",
        password: "password",
      }),
    });

    const user1ResponseBody = await user1Response.json();

    expect([200, 201]).toContain(user1Response.status);
    expect(user1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "email1",
      email: "email_duplicado1@gmail.com",
      password: user1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: user1ResponseBody.updated_at,
    });

    const user2Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "email2",
        email: "email_duplicado2@gmail.com",
        password: "password",
      }),
    });

    expect(user2Response.status).toBe(201);

    const user2ResponseBody = await user2Response.json();

    expect(user2ResponseBody).toEqual({
      id: user2ResponseBody.id,
      username: "email2",
      email: "email_duplicado2@gmail.com",
      password: user2ResponseBody.password,
      created_at: user2ResponseBody.created_at,
      updated_at: user2ResponseBody.updated_at,
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/${user1ResponseBody.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email_duplicado2@gmail.com",
        }),
      },
    );

    expect(updateUser1.status).toBe(400);

    const updateUser1ResponseBody = await updateUser1.json();

    expect(updateUser1ResponseBody).toEqual({
      name: "ValidationError",
      message: "Email já cadastrado",
      action: "Utilize outro email para realizar esta operação",
      statusCode: 400,
    });
  });
});
