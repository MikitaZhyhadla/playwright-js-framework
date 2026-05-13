import BasePage from './BasePage.js';

export default class JobSubscribePage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator('input[type="email"]').first();
    this.categorySelect = page.getByRole('combobox', { name: 'Category' });
    this.locationInput = page.getByRole('combobox', { name: /location/i });
    this.addAlertButton = page.getByRole('button', { name: /Add Job Alert/i });
    this.signUpButton = page.locator('button').filter({ hasText: /^Sign Up$/ });
    this.confirmationText = page.locator('//p[contains(., "submitted successfully")]').first();
  }

  async scrollToSubscriptionBlock() {
    await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.emailInput.scrollIntoViewIfNeeded();
  }

  async fillEmail(email) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailInput.fill(email);
  }

  async selectCategory(category) {
    await this.categorySelect.waitFor({ state: 'visible', timeout: 15000 });
    await this.categorySelect.selectOption({ label: category });
  }

  async fillLocationAndSelect(location) {
    await this.locationInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.locationInput.click();
    await this.locationInput.pressSequentially(location, { delay: 100 });

    const suggestion = this.page
      .getByRole('option', { name: new RegExp(location, 'i') })
      .first();
    await suggestion.waitFor({ state: 'visible', timeout: 10000 });
    await suggestion.click();
  }

  async clickAddAlert() {
    await this.addAlertButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addAlertButton.click();
  }

  async clickSignUp() {
    await this.signUpButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.signUpButton.click();
  }

  async getConfirmationText() {
    await this.confirmationText.waitFor({ state: 'visible', timeout: 15000 });
    const text = await this.confirmationText.textContent();
    return text.trim();
  }
}
