import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // the lead sink is a single append-only file
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  projects: [
    // Distinct x-forwarded-for per project: both share one webServer process, so without
    // this every lead-form submission across both projects counted against the same
    // rate-limit bucket (keyed by client IP) and the harness would start failing its own
    // later tests once the shared budget ran out.
    { name: 'desktop', use: { ...devices['Desktop Chrome'], extraHTTPHeaders: { 'x-forwarded-for': '10.0.0.1' } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], extraHTTPHeaders: { 'x-forwarded-for': '10.0.0.2' } } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start --port 3100',
    url: 'http://localhost:3100/en',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
