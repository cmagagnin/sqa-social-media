import { expect, test } from "@playwright/test";

const strongPassword = "Aa1!aaaaa";

function uniqueEmail(prefix: string): string {
  const suffix = `${Date.now()}-${process.pid}-${Math.floor(Math.random() * 1_000_000)}`;
  return `${prefix}-${suffix}@example.com`;
}

test("API-01 — cadastro válido", async ({ request }) => {
  const email = uniqueEmail("api01");

  const response = await request.post("/auth/signup", {
    data: { email, password: strongPassword },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.id).toEqual(expect.any(Number));
  expect(body.email).toBe(email);
});

test("API-02 — cadastro com e-mail duplicado", async ({ request }) => {
  const email = uniqueEmail("api02");
  const data = { email, password: strongPassword };

  const initialResponse = await request.post("/auth/signup", { data });
  expect(initialResponse.status()).toBe(200);

  const duplicateResponse = await request.post("/auth/signup", { data });

  expect(duplicateResponse.status()).toBe(409);
  const body = await duplicateResponse.json();
  expect(body.message).toBe("E-mail já cadastrado");
});

test("API-03 — login válido", async ({ request }) => {
  const email = uniqueEmail("api03");
  const data = { email, password: strongPassword };

  const signupResponse = await request.post("/auth/signup", { data });
  expect(signupResponse.status()).toBe(200);

  const signinResponse = await request.post("/auth/signin", { data });

  expect(signinResponse.status()).toBe(200);
  const body = await signinResponse.json();
  expect(body.id).toEqual(expect.any(Number));
  expect(body.email).toBe(email);
});

test("API-04 — login com credenciais inválidas", async ({ request }) => {
  const response = await request.post("/auth/signin", {
    data: {
      email: uniqueEmail("api04"),
      password: strongPassword,
    },
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toBe("Credenciais inválidas");
});

test("API-05 — redefinição para usuário inexistente", async ({ request }) => {
  const response = await request.post("/auth/reset-password", {
    data: { email: uniqueEmail("api05") },
  });

  expect(response.status()).toBe(404);
  const body = await response.json();
  expect(body.message).toBe("Usuário não encontrado");
});
