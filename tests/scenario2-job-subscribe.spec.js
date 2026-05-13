import { test, expect } from '@playwright/test';
import CookieHelper from '../helpers/cookieHelper.js';
import subscribeData from '../test-data/jobSubscribe.js';
import HomePage from '../pages/HomePage.js';
import JobsLandingPage from '../pages/JobsLandingPage.js';
import JobSubscribePage from '../pages/JobSubscribePage.js';

test('Scenario 2: Subscribe for a job alert on IKEA careers portal', async ({ page }) => {
  const cookieHelper = new CookieHelper(page);
  const homePage = new HomePage(page);
  const jobsLandingPage = new JobsLandingPage(page);
  const jobSubscribePage = new JobSubscribePage(page);

  const email = subscribeData.generateEmail(subscribeData.emailPrefix);

  await test.step('Open IKEA home page', async () => {
    await homePage.open(subscribeData.homeUrl);
    await cookieHelper.acceptCookies();
  });

  await test.step('Navigate to job search page via Jobs tab and Explore jobs', async () => {
    await homePage.clickJobsTab();
    await cookieHelper.acceptCookies();
    await jobsLandingPage.clickExploreJobs();
    await cookieHelper.acceptCookies();
  });

  await test.step('Fill in email and verify it was entered correctly', async () => {
    await jobSubscribePage.scrollToSubscriptionBlock();
    await jobSubscribePage.fillEmail(email);
    expect(await jobSubscribePage.emailInput.inputValue()).toBe(email);
  });

  await test.step(`Select category "${subscribeData.category}", fill in location "${subscribeData.location}" and add alert`, async () => {
    await jobSubscribePage.selectCategory(subscribeData.category);
    await jobSubscribePage.fillLocationAndSelect(subscribeData.location);
    await jobSubscribePage.clickAddAlert();
  });

  await test.step('Sign up and verify confirmation message is shown', async () => {
    await jobSubscribePage.clickSignUp();
    const confirmationText = await jobSubscribePage.getConfirmationText();
    expect(confirmationText).toContain('submitted successfully');
  });
});
