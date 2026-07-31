import { defineConfig, devices } from "@playwright/test";

const viewports = [
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "wide-1440", width: 1440, height: 900 }
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"]
  },
  projects: viewports.map((viewport) => ({
    name: viewport.name,
    use: {
      viewport,
      deviceScaleFactor: 1,
      isMobile: viewport.width < 768,
      hasTouch: viewport.width < 768
    }
  })),
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
