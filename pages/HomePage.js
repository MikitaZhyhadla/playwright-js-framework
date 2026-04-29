const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    this.jobsTab = page.getByRole('link', { name: /Jobs/i }); // use accessible role for the Jobs navigation tab
  }

  async open(url) {
    this.logger.logStep('Open IKEA home page');
    await this.navigate(url);
  }

  async clickJobsTab() {
    this.logger.logAction('Click Jobs navigation tab');
    await this.clickElement(this.jobsTab, 'Jobs tab');
  }
}

module.exports = HomePage;
