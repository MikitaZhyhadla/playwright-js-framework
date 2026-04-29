const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://jobs.ikea.com/en');
  await page.waitForLoadState('networkidle');
  console.log('jobs home', page.url());
  const url = page.url();
  const inputs = await page.$$eval('input', els => els.map(i => ({name: i.name, id: i.id, type: i.type, visible: i.offsetParent !== null})).slice(0,50));
  console.log('inputs', JSON.stringify(inputs, null, 2));
  const searchBtn = await page.$('button:has-text("Search")');
  console.log('searchBtn', !!searchBtn, 'searchBtnText', searchBtn ? await searchBtn.textContent() : null);
  const searchContainer = await page.$('form[action*="search-jobs"]');
  console.log('form action found', !!searchContainer, searchContainer ? await searchContainer.getAttribute('action') : null);
  await browser.close();
})();
