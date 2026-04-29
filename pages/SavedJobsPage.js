class SavedJobsPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.firstSavedJobTitle = page.locator('//a[contains(@class, "saved-jobs-dropdown__jobtitle")][1]'); // use XPath for the first saved job title in the saved jobs panel
  }

  async getFirstSavedJobTitle() {
    this.logger.logAction('Retrieving first saved job title');
    await this.firstSavedJobTitle.waitFor({ state: 'visible', timeout: 10000 });
    return this.firstSavedJobTitle.textContent();
  }
}

module.exports = SavedJobsPage;
