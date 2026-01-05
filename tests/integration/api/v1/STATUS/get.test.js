test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toHaveProperty("update_At");

  const parsedUpdateAt = new Date(responseBody.update_At).toISOString();
  expect(responseBody.update_At).toEqual(parsedUpdateAt);

  expect(responseBody.dependencies.database.version).toEqual("16.11");
  expect(responseBody.dependencies.database.max_Connections).toEqual(100);
  expect(
    responseBody.dependencies.database.opened_connections,
  ).toBeGreaterThanOrEqual(1);
});
