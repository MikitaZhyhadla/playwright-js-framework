class JobsLandingPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.exploreJobsLink = page.locator('a:has-text("Explore available jobs")').first();
  }

  async clickExploreJobs() {
    this.logger.logAction('Click Explore available jobs link');
    await Promise.all([
      this.page.waitForURL(/jobs\.ikea\.com\/en/),
      this.exploreJobsLink.click(),
    ]);
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = JobsLandingPage;
