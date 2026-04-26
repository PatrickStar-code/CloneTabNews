import { Client } from "pg";

async function query(queryObject) {
  let cliente;

  try {
    cliente = await getNewCliente();
    const result = await cliente.query(queryObject);
    return result;
  } catch (error) {
    console.log("\n Erro dentro do catch do database:", error);
    throw error;
  } finally {
    await cliente?.end();
  }
}

async function getNewCliente() {
  const cliente = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await cliente.connect();
  return cliente;
}

export default {
  query,
  getNewCliente,
};
