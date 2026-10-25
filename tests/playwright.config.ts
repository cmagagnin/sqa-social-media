import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "api",
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL ?? "http://127.0.0.1:8080",
      },
    },
    {
      name: "e2e",
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        browserName: "chromium",
        baseURL: process.env.FRONTEND_BASE_URL ?? "http://127.0.0.1:3000",
        headless: process.env.HEADED !== "1",
      },
    },
  ],
});
