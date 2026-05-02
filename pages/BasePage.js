class BasePage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
  }

  async navigate(url) {
    this.logger.logAction(`Navigating to ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForLoad() {
    this.logger.logAction('Waiting for page load to complete');
    await this.page.waitForLoadState('networkidle');
  }

  async clickElement(locator) {
    await locator.click();
  }
}

module.exports = BasePage;
