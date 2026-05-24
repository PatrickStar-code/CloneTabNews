import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";
import password from "./password";
async function createUser(userInputValues) {
  await validateUserName(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
    INSERT INTO users(username, email, password)
    VALUES($1, $2, $3)
    RETURNING *
  `,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if (userInputValues.name) {
    await validateUserName(userInputValues.name);
  }

  if (userInputValues.email) {
    await validateUniqueEmail(userInputValues.email);
  }
}

async function validateUniqueEmail(email) {
  const result = await database.query({
    text: `
    SELECT * FROM users WHERE LOWER(email) = LOWER($1)
  `,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "Email já cadastrado",
      action: "Utilize outro email para realizar esta operação",
    });
  }
}

async function validateUserName(username) {
  const result = await database.query({
    text: `
    SELECT * FROM users WHERE LOWER(username) = LOWER($1)
  `,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "Nome de usuário já cadastrado",
      action: "Utilize outro nome de usuário para realizar esta operação",
    });
  }
}

async function hashPasswordInObject(object) {
  const hashPassword = await password.hash(object.password);
  object.password = hashPassword;
}

async function findOneByUsername(username) {
  const result = await runSelectQuery(username);

  return result.rows[0];

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
    SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1
  `,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "Usuário não encontrado no sistema",
        action: "Verifique se o Username está digitado corretamente",
      });
    }

    return result;
  }
}

const user = {
  createUser,
  findOneByUsername,
  update,
};

export default user;
