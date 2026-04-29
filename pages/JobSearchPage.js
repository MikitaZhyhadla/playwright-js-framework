class JobSearchPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.searchForm = page.locator('form.search-form--home');
    this.keywordInput = this.searchForm.locator('input[name="k"]');
    this.locationInput = this.searchForm.locator('input[name="l"]');
    this.searchButton = this.searchForm.locator('button:has-text("Search jobs"):visible').first();
    this.noResultsText = page.getByText(/No jobs found|0 jobs/i, { exact: false });
    this.jobListLinks = page.locator('a.job-list__anchor');
    this.genericJobLinks = page.locator('a[href*="/job/"]');
    this.firstCategoryLink = page.locator('a.vertical-tab-to-accordion__tile-link-arrow').first();
  }

  async searchJobs(keyword) {
    this.logger.logAction(`Searching jobs with keyword: ${keyword}`);
    await this.keywordInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.locationInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.keywordInput.fill(keyword);
    await this.locationInput.fill('');
    await this.page.waitForTimeout(500);
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.searchButton.click(),
    ]);
    await this.waitForResults();
  }

  async waitForResults() {
    this.logger.logAction(`Waiting for job search results to load at ${this.page.url()}`);
    await Promise.race([
      this.page.waitForSelector('a.job-list__anchor', { timeout: 20000 }).catch(() => null),
      this.page.waitForSelector('a[href*="/job/"]', { timeout: 20000 }).catch(() => null),
      this.page.waitForSelector('a.vertical-tab-to-accordion__tile-link-arrow', { timeout: 20000 }).catch(() => null),
      this.page.waitForSelector('text=/No jobs found|0 jobs/i', { timeout: 20000 }).catch(() => null),
    ]);
    await this.page.waitForTimeout(1500);
  }

  async hasNoResults() {
    this.logger.logAction('Checking whether search returned no results');
    return (await this.noResultsText.count()) > 0;
  }

  async clickFirstJob() {
    this.logger.logAction('Clicking the first available job in search results');
    const visibleJobLink = this.page.locator('a.job-list__anchor:visible').first();
    const visibleGenericJobLink = this.page.locator('a[href*="/job/"]:visible').first();
    const visibleCategoryLink = this.page.locator('a.vertical-tab-to-accordion__tile-link-arrow:visible').first();
    const jobCount = await this.page.locator('a.job-list__anchor:visible').count();
    const genericCount = await this.page.locator('a[href*="/job/"]:visible').count();
    const categoryCount = await this.page.locator('a.vertical-tab-to-accordion__tile-link-arrow:visible').count();
    this.logger.logAction(`Search results page has ${jobCount} visible job links, ${genericCount} visible generic links, and ${categoryCount} visible category cards`);

    if (jobCount > 0) {
      await visibleJobLink.click();
      return;
    }

    if (genericCount > 0) {
      await visibleGenericJobLink.click();
      return;
    }

    if (categoryCount > 0) {
      await visibleCategoryLink.scrollIntoViewIfNeeded();
      await visibleCategoryLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(3000);
      const nextJobCount = await this.page.locator('a.job-list__anchor:visible').count();
      if (nextJobCount > 0) {
        await this.page.locator('a.job-list__anchor:visible').first().click();
        return;
      }
    }

    const currentUrl = this.page.url();
    this.logger.logAction(`No clickable job elements found at ${currentUrl}`);
    throw new Error('Unable to find a first job or category to click');
  }
}

module.exports = JobSearchPage;
