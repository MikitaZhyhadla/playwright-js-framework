# Playwright JS E2E Automation Framework

## Project Description

This project is a starter template for end-to-end test automation using Playwright with JavaScript. The framework includes a ready folder structure, Playwright configuration, environment variable support, and HTML reporting.

## Requirements

- Node.js v18+
- npm v9+

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

## Environment Variables

The project requires a `.env` file in the root directory with the following variables:

| Variable | Description | Required |
| --- | --- | --- |
| `BASE_URL` | Base URL for tests | Yes |
| `MAILSLURP_API_KEY` | MailSlurp API key for email automation | Yes |
| `TEST_USERNAME` | Test user login name | Yes |
| `TEST_PASSWORD` | Test user password | Yes |

## Running Tests

- Run all tests:
  ```bash
  npx playwright test
  ```

- Run Chromium only:
  ```bash
  npx playwright test --project=chromium
  ```

- Run a specific test file:
  ```bash
  npx playwright test tests/example.spec.js
  ```

- Run in UI mode:
  ```bash
  npx playwright test --ui
  ```

- Run in headed mode:
  ```bash
  npx playwright test --headed
  ```

## Viewing the HTML Report

After the tests complete, open the HTML report with:

```bash
npx playwright show-report
```

## Folder Structure

- `pages/` - page objects and page models for tests.
- `utils/` - utility functions and shared helpers.
- `helpers/` - support classes and helper functions for tests.
- `test-data/` - test data and fixtures.
- `tests/` - directory containing E2E tests.
- `playwright.config.js` - Playwright configuration file.
- `.env` - actual environment variable values (not committed).
- `.env.example` - sample environment file for copying.
