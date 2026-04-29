const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://jobs.ikea.com/en/search-jobs/Manager/22908/1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  const count = await page.locator('a.job-list__anchor').count();
  const anchors = await page.$$eval('a.job-list__anchor', els => els.map(a => ({text: a.textContent.trim().replace(/\s+/g,' '), href: a.href})).slice(0,20));
  console.log('count', count);
  console.log(JSON.stringify(anchors, null, 2));
  const altCount = await page.locator('main a').count();
  console.log('main a count', altCount);
  await browser.close();
})();
