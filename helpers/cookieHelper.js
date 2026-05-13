export default class CookieHelper {
  constructor(page) {
    this.page = page;
  }

  async acceptCookies() {
    const ikeaCookieButton = this.page.locator('#onetrust-accept-btn-handler');
    if (await ikeaCookieButton.count()) {
      await ikeaCookieButton.click();
      await this.page.waitForTimeout(500);
    }

    const jobsCookieBanner = this.page.locator('#system-ialert');
    if (await jobsCookieBanner.count()) {
      const acceptButton = jobsCookieBanner.locator('button:has-text("Accept")');
      if (await acceptButton.count()) {
        await acceptButton.click();
        await this.page.waitForTimeout(500);
      }
    }

    // Check without waiting — avoids 5s timeout showing as a failed step in the report
    const acceptButton = this.page.getByRole('button', { name: /^Accept$/i }).first();
    if (await acceptButton.count() > 0 && await acceptButton.isVisible()) {
      await acceptButton.click();
      await this.page.waitForTimeout(500);
    }
  }
}
