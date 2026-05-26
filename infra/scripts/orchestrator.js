import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database";
import user from "models/user";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error(
          `Status page is not ready yet. Status code: ${response.status}`,
        );
      }
      const responseBody = await response.json();
      return responseBody;
    }
  }
}

async function createUser(userObject) {
  return await user.createUser({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validPassword",
  });
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations() {
  const migrator = await import("models/migrator");
  await migrator.default.runPendingMigrations();
}
export default {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};
