const BasePage = require('./BasePage');

class JobSearchPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    // CSS class selector — search form container
    this.searchForm = page.locator('form.search-form--home');
    // CSS attribute selector — keyword input by name
    this.keywordInput = this.searchForm.locator('input[name="k"]');
    // CSS attribute selector — location/postcode input by name
    this.locationInput = this.searchForm.locator('input[name="l"]');
    // CSS :visible pseudo-class — search button scoped to form
    this.searchButton = this.searchForm.locator('button:has-text("Search jobs"):visible').first();
    // Text matcher — no results indicator
    this.noResultsText = page.getByText(/No jobs found|0 jobs/i, { exact: false });
    // CSS class selector — job result links
    this.jobListLinks = page.locator('a.job-list__anchor');
  }

  async fillKeyword(keyword) {
    this.logger.logAction(`Filling keyword input with: ${keyword}`);
    await this.keywordInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.keywordInput.fill(keyword);
  }

  async clearLocation() {
    this.logger.logAction('Clearing location/postcode field');
    await this.locationInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.locationInput.fill('');
  }

  async clickSearch() {
    this.logger.logAction('Clicking Search jobs button');
    await this.searchButton.waitFor({ state: 'visible', timeout: 15000 });
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.searchButton.click(),
    ]);
    await this.waitForResults();
  }

  async waitForResults() {
    this.logger.logAction(`Waiting for search results at ${this.page.url()}`);
    // Single selector covers all result states — avoids multiple race timeouts showing as failed steps
    await this.page.waitForSelector(
      'a.job-list__anchor, a[href*="/job/"], a.vertical-tab-to-accordion__tile-link-arrow',
      { timeout: 20000 }
    ).catch(() => null);
    await this.page.waitForTimeout(500);
  }

  async hasNoResults() {
    this.logger.logAction('Checking whether search returned no results');
    return (await this.noResultsText.count()) > 0;
  }

  async clickFirstJob() {
    this.logger.logAction('Clicking first job in search results');
    const jobCount = await this.page.locator('a.job-list__anchor:visible').count();
    const genericCount = await this.page.locator('a[href*="/job/"]:visible').count();
    const categoryCount = await this.page.locator('a.vertical-tab-to-accordion__tile-link-arrow:visible').count();
    this.logger.logAction(`Found ${jobCount} job links, ${genericCount} generic links, ${categoryCount} category cards`);

    if (jobCount > 0) {
      await this.page.locator('a.job-list__anchor:visible').first().click();
      return;
    }
    if (genericCount > 0) {
      await this.page.locator('a[href*="/job/"]:visible').first().click();
      return;
    }
    if (categoryCount > 0) {
      const categoryLink = this.page.locator('a.vertical-tab-to-accordion__tile-link-arrow:visible').first();
      await categoryLink.scrollIntoViewIfNeeded();
      await categoryLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(3000);
      const nextJobCount = await this.page.locator('a.job-list__anchor:visible').count();
      if (nextJobCount > 0) {
        await this.page.locator('a.job-list__anchor:visible').first().click();
        return;
      }
    }

    throw new Error(`No clickable job elements found at ${this.page.url()}`);
  }
}

module.exports = JobSearchPage;
