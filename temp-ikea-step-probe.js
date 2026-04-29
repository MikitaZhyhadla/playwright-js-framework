const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.ikea.com/');
  await page.waitForLoadState('networkidle');
  console.log('home loaded', page.url());
  const jobsLink = await page.$('a:has-text("Jobs")');
  console.log('jobsLink', !!jobsLink);
  if (jobsLink) {
    await jobsLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    console.log('after jobs click', page.url());
    const exploreLink = await page.$('a:has-text("Explore available jobs")');
    const exploreBtn = await page.$('button:has-text("Explore available jobs")');
    console.log('exploreLink', !!exploreLink, 'exploreBtn', !!exploreBtn);
    if (exploreLink) {
      console.log('exploreLink href', await exploreLink.getAttribute('href'));
    }
  }
  await browser.close();
})();
