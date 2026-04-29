const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://jobs.ikea.com/en');
  await page.waitForLoadState('networkidle');
  const forms = await page.$$eval('form[action*="search-jobs"]', forms => forms.map(f => ({id: f.id, action: f.action, className: f.className, inputNames: Array.from(f.querySelectorAll('input')).map(i => ({name:i.name, id:i.id, type:i.type, hidden:i.hidden, visible:i.offsetParent!==null})), buttonTexts: Array.from(f.querySelectorAll('button')).map(b=>({text:b.textContent.trim(), id:b.id, className:b.className}))})));
  console.log(JSON.stringify(forms, null, 2));
  await browser.close();
})();
