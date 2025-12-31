import database from "../../../../infra/databese.js";
export default async function status(req, res) {
  const result = await database.query("SELECT 1 + 1 as SUM;");
  console.log(result.rows);
  res.status(200).json({ message: "API is running" });
}
