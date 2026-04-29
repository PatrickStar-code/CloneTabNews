import { Client } from "pg";
import { ServiceError } from "infra/errors";

async function query(queryObject) {
  let cliente;

  try {
    cliente = await getNewCliente();
    const result = await cliente.query(queryObject);
    return result;
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
  try {
    await cliente.connect();
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o banco de dados",
      cause: error,
    });
    throw serviceErrorObject;
  }
  return cliente;
}

export default {
  query,
  getNewCliente,
};
