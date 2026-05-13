import BasePage from './BasePage.js';

export default class JobsLandingPage extends BasePage {
  constructor(page) {
    super(page);
    this.exploreJobsLink = page.locator('a:has-text("Explore available jobs")').first();
  }

  async clickExploreJobs() {
    await Promise.all([
      this.page.waitForURL(/jobs\.ikea\.com\/en/),
      this.exploreJobsLink.click(),
    ]);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
