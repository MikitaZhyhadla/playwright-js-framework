import BasePage from './BasePage.js';

export default class SavedJobsPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstSavedJobTitle = page.locator('//a[contains(@class, "saved-jobs-dropdown__jobtitle")][1]');
  }

  async getFirstSavedJobTitle() {
    await this.firstSavedJobTitle.waitFor({ state: 'visible', timeout: 10000 });
    return this.firstSavedJobTitle.textContent();
  }
}
