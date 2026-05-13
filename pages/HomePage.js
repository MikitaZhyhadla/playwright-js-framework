import BasePage from './BasePage.js';

export default class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.jobsTab = page.getByRole('link', { name: /Jobs/i });
  }

  async open(url) {
    await this.navigate(url);
  }

  async clickJobsTab() {
    await this.clickElement(this.jobsTab);
  }
}
