import { Pool, Client } from "pg";
import { ServiceError } from "infra/errors";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function query(queryObject) {
  try {
    const result = await pool.query(queryObject);
    return result;
  } catch (error) {
    if (error.code) throw error; // DB errors (e.g. unique violation)
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o banco de dados",
      cause: error,
    });
    throw serviceErrorObject;
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
