import BasePage from './BasePage.js';

export default class JobDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.jobTitle = page.getByRole('heading', { level: 1 });
    this.saveButton = page.locator('button.js-save-job-btn').first();
    this.savedCounter = page.locator('button.saved-jobs-dropdown__button');
    this.savedJobsButton = page.getByRole('button', { name: /Saved jobs/i });
  }

  async getJobTitle() {
    await this.jobTitle.waitFor({ state: 'visible', timeout: 10000 });
    return this.jobTitle.textContent();
  }

  async clickSave() {
    await this.saveButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async getSavedJobsCount() {
    await this.savedCounter.waitFor({ state: 'visible', timeout: 10000 });
    const text = await this.savedCounter.textContent();
    const match = text && text.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  async clickSavedJobsButton() {
    await this.savedJobsButton.click();
    await this.page.waitForTimeout(2000);
  }
}
