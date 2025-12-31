import { Client } from "pg";

async function query(queryObject) {
  const cliente = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
  await cliente.connect();
  const result = await cliente.query(queryObject);
  await cliente.end();
  return result;
}

export default {
  query: query,
};
