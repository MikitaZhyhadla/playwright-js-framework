export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickElement(locator) {
    await locator.click();
  }
}
