class JobDetailsPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.jobTitle = page.locator('h1'); // use heading locator for the job title on the detail page
    this.saveButton = page.locator('button.js-save-job-btn').first(); // use CSS class to select the actual save button on the job page
    this.savedCounter = page.locator('button.saved-jobs-dropdown__button'); // use CSS selector for the saved jobs counter element
    this.savedJobsLink = page.getByRole('button', { name: /Saved jobs/i }); // use accessible role for the Saved jobs action
  }

  async getJobTitle() {
    this.logger.logAction('Retrieving job title from details page');
    return this.jobTitle.textContent();
  }

  async clickSave() {
    this.logger.logAction('Clicking Save button on job detail page');
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async getSavedJobsCount() {
    this.logger.logAction('Reading saved jobs counter');
    const text = await this.savedCounter.textContent();
    const match = text && text.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  async clickSavedJobsLink() {
    this.logger.logAction('Opening saved jobs panel');
    await this.savedJobsLink.click();
    await this.page.waitForTimeout(2000);
  }
}

module.exports = JobDetailsPage;
