import orchestrator from "infra/scripts/orchestrator";
import user from "models/user";
import password from "models/password";

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
    await orchestrator.createUser({
      username: "user1",
    });

    await orchestrator.createUser({
      username: "user2",
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/user1`,
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
    await orchestrator.createUser({
      email: "email_duplicado1@gmail.com",
    });

    const user2 = await orchestrator.createUser({
      email: "email_duplicado2@gmail.com",
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/${user2.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user2.email,
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

  test("Witch unique username", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user_unique",
        email: "user_unique@gmail.com",
        password: "password",
      }),
    });

    const user1ResponseBody = await user1Response.json();

    expect([200, 201]).toContain(user1Response.status);
    expect(user1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "user_unique",
      email: "user_unique@gmail.com",
      password: user1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: user1ResponseBody.updated_at,
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/${user1ResponseBody.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "new_username",
        }),
      },
    );

    expect(updateUser1.status).toBe(200);

    const updateUser1ResponseBody = await updateUser1.json();

    expect(updateUser1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "new_username",
      email: "user_unique@gmail.com",
      password: updateUser1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: updateUser1ResponseBody.updated_at,
    });
    expect(
      updateUser1ResponseBody.updated_at > user1ResponseBody.created_at,
    ).toBe(true);
  });

  test("Witch unique email", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user_unique2",
        email: "user_unique2@gmail.com",
        password: "password",
      }),
    });

    const user1ResponseBody = await user1Response.json();

    expect([200, 201]).toContain(user1Response.status);
    expect(user1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "user_unique2",
      email: "user_unique2@gmail.com",
      password: user1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: user1ResponseBody.updated_at,
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/${user1ResponseBody.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "new_email@gmail.com",
        }),
      },
    );

    expect(updateUser1.status).toBe(200);

    const updateUser1ResponseBody = await updateUser1.json();

    expect(updateUser1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "user_unique2",
      email: "new_email@gmail.com",
      password: updateUser1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: updateUser1ResponseBody.updated_at,
    });
    expect(
      updateUser1ResponseBody.updated_at > user1ResponseBody.created_at,
    ).toBe(true);
  });

  test("Witch new password", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user_unique3",
        email: "user_unique3@gmail.com",
        password: "password",
      }),
    });

    const user1ResponseBody = await user1Response.json();

    expect([200, 201]).toContain(user1Response.status);
    expect(user1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "user_unique3",
      email: "user_unique3@gmail.com",
      password: user1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: user1ResponseBody.updated_at,
    });

    const updateUser1 = await fetch(
      `http://localhost:3000/api/v1/users/${user1ResponseBody.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "new_password",
        }),
      },
    );

    expect(updateUser1.status).toBe(200);

    const updateUser1ResponseBody = await updateUser1.json();

    expect(updateUser1ResponseBody).toEqual({
      id: user1ResponseBody.id,
      username: "user_unique3",
      email: "user_unique3@gmail.com",
      password: updateUser1ResponseBody.password,
      created_at: user1ResponseBody.created_at,
      updated_at: updateUser1ResponseBody.updated_at,
    });
    expect(
      updateUser1ResponseBody.updated_at > user1ResponseBody.created_at,
    ).toBe(true);

    const userInDatabase = await user.findOneByUsername("user_unique3");
    const correctPasswordMatch = await password.compare(
      "new_password",
      userInDatabase.password,
    );

    const incorrectPasswordMatch = await password.compare(
      "password",
      userInDatabase.password,
    );

    expect(correctPasswordMatch).toBe(true);
    expect(incorrectPasswordMatch).toBe(false);
  });
});
