class CookieHelper {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
  }

  async acceptCookies() {
    this.logger.logAction('Accepting cookie banners if they are visible');

    const ikeaCookieButton = this.page.locator('#onetrust-accept-btn-handler');
    if (await ikeaCookieButton.count()) {
      this.logger.logAction('Clicking IKEA home page cookie accept button by CSS id');
      await ikeaCookieButton.click();
      await this.page.waitForTimeout(500);
    }

    const jobsCookieBanner = this.page.locator('#system-ialert');
    if (await jobsCookieBanner.count()) {
      this.logger.logAction('Closing jobs portal cookie overlay by CSS id');
      const acceptButton = jobsCookieBanner.locator('button:has-text("Accept")');
      if (await acceptButton.count()) {
        await acceptButton.click();
        await this.page.waitForTimeout(500);
      }
    }

    const jobsConsentDialog = this.page.locator('dialog, [role="dialog"], #system-ialert');
    await jobsConsentDialog.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => null);
    const acceptButton = this.page.getByRole('button', { name: /^Accept$/i }).first();
    if (await acceptButton.count() && await acceptButton.isVisible()) {
      this.logger.logAction('Closing jobs portal cookie consent dialog');
      await acceptButton.click();
      await this.page.waitForTimeout(500);
    }
  }
}

module.exports = CookieHelper;
