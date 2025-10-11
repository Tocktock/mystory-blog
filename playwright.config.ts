import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 60_000,
	expect: {
		timeout: 5_000,
	},
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'line' : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4321',
		trace: 'on-first-retry',
	},
	webServer: {
		command: 'npm run preview -- --host 127.0.0.1 --port 4321',
		url: 'http://127.0.0.1:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
