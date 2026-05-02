const BasePage = require('./BasePage');

class SavedJobsPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    // XPath — first anchor with the saved job title class inside the dropdown panel
    this.firstSavedJobTitle = page.locator('//a[contains(@class, "saved-jobs-dropdown__jobtitle")][1]');
  }

  async getFirstSavedJobTitle() {
    this.logger.logAction('Retrieving first saved job title from panel');
    await this.firstSavedJobTitle.waitFor({ state: 'visible', timeout: 10000 });
    return this.firstSavedJobTitle.textContent();
  }
}

module.exports = SavedJobsPage;
