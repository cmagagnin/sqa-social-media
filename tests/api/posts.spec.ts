import { expect, test } from "@playwright/test";

test("API-06 — posts preserva contadores de reações", async ({ request }) => {
  const response = await request.get("/posts", {
    params: { limit: 1, skip: 0 },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.posts).toEqual(expect.any(Array));
  expect(body.posts.length).toBeGreaterThan(0);

  const post = body.posts[0];
  expect(post).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
      liked: expect.any(Boolean),
      reactions: {
        likes: expect.any(Number),
        dislikes: expect.any(Number),
      },
    })
  );
});
