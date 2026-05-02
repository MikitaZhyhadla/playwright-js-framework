const BasePage = require('./BasePage');

class JobsLandingPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    // CSS :has-text pseudo-class — link to the jobs portal
    this.exploreJobsLink = page.locator('a:has-text("Explore available jobs")').first();
  }

  async clickExploreJobs() {
    this.logger.logAction('Clicking Explore available jobs link');
    await Promise.all([
      this.page.waitForURL(/jobs\.ikea\.com\/en/),
      this.exploreJobsLink.click(),
    ]);
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = JobsLandingPage;
