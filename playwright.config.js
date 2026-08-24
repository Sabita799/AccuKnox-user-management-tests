const { defineConfig, devices } = require('@playwright/test');

// In playwright.config.js
module.exports = defineConfig({
  timeout: 60000, // global test timeout extended
  use: {
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  fullyParallel: false, // Run sequentially for serial dependent flow
  workers: 1,
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false, // Set to true if you don't want to visually see the browser
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});