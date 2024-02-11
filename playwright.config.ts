import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./utils/globalSetup'),
    use: {
        baseURL: process.env.baseURL,
        testIdAttribute: process.env.testIdAttribute,
        headless: true,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        navigationTimeout: 30_000,
    },

    /* Configure projects for major browsers */
    projects: [
        /* Test against desktop browsers */
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], acceptDownloads: true },
        },
        /* Test against branded browsers. */
        {
            name: 'Google Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome', acceptDownloads: true },
        },
    ],

    // eslint-disable-next-line no-magic-numbers
    timeout: 60_000,
    reporter: [
        ['junit', { outputFile: './test-JUNIT/results.xml' }],
        ['list'],
        ['html', { open: 'never' }],
    ],
    // Run all tests in parallel.
    fullyParallel: true,
    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!process.env.CI,
    // Retry on CI only.
    // eslint-disable-next-line no-magic-numbers
    retries: process.env.CI ? 1 : 1,
    // Opt out of parallel tests on CI.
    // eslint-disable-next-line no-magic-numbers
    workers: process.env.CI ? 2 : 2,
};

export default config;