const BasePage = require('./BasePage');

class JobSubscribePage extends BasePage {
  constructor(page, logger) {
    super(page, logger);

    // 1. CSS attribute selector — email input
    this.emailInput = page.locator('input[type="email"]').first();

    // 2. ARIA role + accessible name — native <select> for category
    this.categorySelect = page.getByRole('combobox', { name: 'Category' });

    // 3. ARIA role + accessible name — location typeahead combobox
    this.locationInput = page.getByRole('combobox', { name: /location/i });

    // 4. ARIA role + exact button name — "Add Job Alert" (enabled after category + location filled)
    this.addAlertButton = page.getByRole('button', { name: /Add Job Alert/i });

    // 5. ARIA role + button name — final submit
    this.signUpButton = page.getByRole('button', { name: /Sign Up for Job Alerts/i });

    // 6. XPath — paragraph element wrapping the confirmation message
    this.confirmationText = page.locator('//p[contains(., "submitted successfully")]').first();
  }

  async scrollToSubscriptionBlock() {
    this.logger.logAction('Scrolling email input into view to reach subscription block');
    await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.emailInput.scrollIntoViewIfNeeded();
  }

  async fillEmail(email) {
    this.logger.logAction(`Filling email input with: ${email}`);
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailInput.fill(email);
    const value = await this.emailInput.inputValue();
    this.logger.logAction(`Email field confirmed value: ${value}`);
  }

  async selectCategory(category) {
    this.logger.logAction(`Selecting category via native select: ${category}`);
    await this.categorySelect.waitFor({ state: 'visible', timeout: 15000 });
    await this.categorySelect.selectOption({ label: category });
    const selected = await this.categorySelect.inputValue();
    this.logger.logAction(`Category select confirmed value: ${selected}`);
  }

  async fillLocationAndSelect(location) {
    this.logger.logAction(`Typing location character-by-character to trigger autocomplete: ${location}`);
    await this.locationInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.locationInput.click();
    await this.locationInput.pressSequentially(location, { delay: 100 });

    this.logger.logAction('Waiting for autocomplete suggestions to appear');
    const suggestion = this.page
      .getByRole('option', { name: new RegExp(location, 'i') })
      .first();
    await suggestion.waitFor({ state: 'visible', timeout: 10000 });
    this.logger.logAction(`Clicking location suggestion for: ${location}`);
    await suggestion.click();
  }

  async clickAddAlert() {
    this.logger.logAction('Clicking Add Job Alert button');
    await this.addAlertButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addAlertButton.click();
    this.logger.logAction('Job alert configuration added to the list');
  }

  async clickSignUp() {
    this.logger.logAction('Clicking Sign Up for Job Alerts button');
    await this.signUpButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.signUpButton.click();
  }

  async getConfirmationText() {
    this.logger.logAction('Waiting for confirmation message after sign-up');
    await this.confirmationText.waitFor({ state: 'visible', timeout: 15000 });
    const text = await this.confirmationText.textContent();
    this.logger.logAction(`Confirmation message: "${text.trim()}"`);
    return text.trim();
  }
}

module.exports = JobSubscribePage;
