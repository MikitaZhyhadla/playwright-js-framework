const BasePage = require('./BasePage');

class JobDetailsPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    // ARIA role — h1 heading on the job detail page
    this.jobTitle = page.getByRole('heading', { level: 1 });
    // CSS class selector — save button specific to job detail pages
    this.saveButton = page.locator('button.js-save-job-btn').first();
    // CSS class selector — saved jobs counter in the navigation
    this.savedCounter = page.locator('button.saved-jobs-dropdown__button');
    // ARIA role + accessible name — saved jobs panel trigger
    this.savedJobsButton = page.getByRole('button', { name: /Saved jobs/i });
  }

  async getJobTitle() {
    this.logger.logAction('Retrieving job title from details page');
    await this.jobTitle.waitFor({ state: 'visible', timeout: 10000 });
    return this.jobTitle.textContent();
  }

  async clickSave() {
    this.logger.logAction('Clicking Save button on job detail page');
    await this.saveButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async getSavedJobsCount() {
    this.logger.logAction('Reading saved jobs counter');
    await this.savedCounter.waitFor({ state: 'visible', timeout: 10000 });
    const text = await this.savedCounter.textContent();
    const match = text && text.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  async clickSavedJobsButton() {
    this.logger.logAction('Opening saved jobs panel');
    await this.savedJobsButton.click();
    await this.page.waitForTimeout(2000);
  }
}

module.exports = JobDetailsPage;
