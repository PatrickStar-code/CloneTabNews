test("POST /api/v1/migrations executes safely", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  // Pode ser 200 (nenhuma migração) ou 201 (migrações aplicadas)
  expect([200, 201]).toContain(response.status);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect([200, 201]).toContain(response2.status);

  const responseBody2 = await response2.json();
  expect(Array.isArray(responseBody2)).toBe(true);
});
