const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    // ARIA role + accessible name — Jobs link in the main navigation
    this.jobsTab = page.getByRole('link', { name: /Jobs/i });
  }

  async open(url) {
    await this.navigate(url);
  }

  async clickJobsTab() {
    this.logger.logAction('Clicking Jobs navigation tab');
    await this.clickElement(this.jobsTab);
  }
}

module.exports = HomePage;
