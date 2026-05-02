# Playwright JS E2E Automation Framework

## Project Description

End-to-end test automation framework for the IKEA careers portal built with Playwright and JavaScript. Implements the Page Object Model (POM) pattern with a custom logger, cookie handling, and dynamic email generation.

## Requirements

- Node.js v18+
- npm v9+

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MikitaZhyhadla/playwright-js-framework.git
   cd playwright-js-framework
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the values (see [Environment Variables](#environment-variables)).

---

## Environment Variables

| Variable   | Description                              | Required |
|------------|------------------------------------------|----------|
| `BASE_URL` | Base URL for tests (`https://www.ikea.com/`) | Yes  |

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run on a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Run a specific scenario
```bash
npx playwright test tests/scenario1-job-search.spec.js
npx playwright test tests/scenario2-job-subscribe.spec.js
```

### Run in headed mode (watch the browser)
```bash
npx playwright test --headed
```

### Run in UI mode (interactive runner with timeline)
```bash
npx playwright test --ui
```

---

## Debugging

### Open Playwright Inspector — step through test actions one by one
```bash
npx playwright test --debug
```

### Debug a specific test file
```bash
npx playwright test tests/scenario1-job-search.spec.js --debug
```

### Pause at a specific point in code
Add `await page.pause()` anywhere inside a test. When the test reaches that line it will open the Playwright Inspector so you can inspect the page state, run locators, and continue manually.

### Open Trace Viewer after a failed test
Traces are saved automatically on the first retry (`trace: 'on-first-retry'` in config):
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## Viewing the HTML Report

After a test run, open the full HTML report:
```bash
npx playwright show-report
```

---

## Test Scenarios

| Scenario   | File                                          | Description                                              |
|------------|-----------------------------------------------|----------------------------------------------------------|
| Scenario 1 | `tests/scenario1-job-search.spec.js`          | Search for a job, save it, verify it appears in Saved jobs |
| Scenario 2 | `tests/scenario2-job-subscribe.spec.js`       | Subscribe to job alerts using a dynamically generated email |

---

## Folder Structure

```
playwright-js-framework/
├── pages/               # Page Object classes (POM)
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── JobsLandingPage.js
│   ├── JobSearchPage.js
│   ├── JobDetailsPage.js
│   ├── SavedJobsPage.js
│   └── JobSubscribePage.js
├── helpers/             # Shared helpers
│   ├── cookieHelper.js
│   └── mailHelper.js
├── utils/
│   └── logger.js        # Custom step/action/assert/error logger
├── test-data/           # Externalized test data
│   ├── jobSearch.js
│   └── jobSubscribe.js
├── tests/               # E2E test specs
│   ├── scenario1-job-search.spec.js
│   └── scenario2-job-subscribe.spec.js
├── playwright.config.js
├── .env                 # Environment variables (not committed)
└── .env.example         # Environment variable template
```
