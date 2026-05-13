import BasePage from './BasePage.js';

export default class JobSearchPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchForm = page.locator('form.search-form--home');
    this.keywordInput = this.searchForm.locator('input[name="k"]');
    this.locationInput = this.searchForm.locator('input[name="l"]');
    this.searchButton = this.searchForm.locator('button:has-text("Search jobs")').first();
    this.noResultsText = page.getByText(/No jobs found|0 jobs/i, { exact: false });
    this.jobListLinks = page.locator('ul.job-list a.job-list__anchor');
  }

  async fillKeyword(keyword) {
    await this.keywordInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.keywordInput.fill(keyword);
  }

  async clickSearch() {
    await this.searchButton.waitFor({ state: 'visible', timeout: 15000 });
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.searchButton.click(),
    ]);
    await this.waitForResults();
  }

  async waitForResults() {
    await this.page
      .waitForSelector('ul.job-list a.job-list__anchor', { timeout: 20000 })
      .catch(() => null);
    await this.page.waitForTimeout(500);
  }

  async hasNoResults() {
    return (await this.noResultsText.count()) > 0;
  }

  async searchWithFallback(primary, fallback) {
    await this.fillKeyword(primary);
    await this.clickSearch();

    if (!await this.hasNoResults()) {
      return primary;
    }

    await this.page.goBack();
    await this.page.waitForLoadState('domcontentloaded');
    await this.fillKeyword(fallback);
    await this.clickSearch();
    return fallback;
  }

  async clickFirstJob() {
    const jobLink = this.jobListLinks.first();

    if (!await jobLink.isVisible()) {
      await this.page.waitForTimeout(1500);
    }

    await jobLink.waitFor({ state: 'visible', timeout: 10000 });
    await jobLink.click();
  }
}
