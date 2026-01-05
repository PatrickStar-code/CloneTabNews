import database from "infra/database.js";
export default async function status(req, res) {
  const updateAt = new Date().toISOString();

  const version = await database.query({
    text: "SHOW server_version;",
  });
  const max_conections = await database.query({
    text: "SHOW max_connections;",
  });
  const databaseName = process.env.POSTGRES_DB;
  const using_conections = await database.query({
    text: `SELECT COUNT(*)::INT FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const databaseOpenedConnections = parseInt(using_conections.rows[0].count);
  res.status(200).json({
    update_At: updateAt,
    dependencies: {
      database: {
        version: version.rows[0].server_version,
        max_Connections: parseInt(max_conections.rows[0].max_connections),
        opened_connections: databaseOpenedConnections,
      },
    },
  });
}
