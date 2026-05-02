const { test, expect } = require('@playwright/test');
const Logger = require('../utils/logger');
const CookieHelper = require('../helpers/cookieHelper');
const MailHelper = require('../helpers/mailHelper');
const subscribeData = require('../test-data/jobSubscribe');
const HomePage = require('../pages/HomePage');
const JobsLandingPage = require('../pages/JobsLandingPage');
const JobSubscribePage = require('../pages/JobSubscribePage');

test('Scenario 2: Subscribe for a job alert on IKEA careers portal', async ({ page }) => {
  const logger = new Logger();
  const cookieHelper = new CookieHelper(page, logger);
  const homePage = new HomePage(page, logger);
  const jobsLandingPage = new JobsLandingPage(page, logger);
  const jobSubscribePage = new JobSubscribePage(page, logger);

  logger.logStep('Generate unique test email for this run');
  const email = MailHelper.generateUniqueEmail(subscribeData.emailPrefix);
  logger.logAction(`Generated email: ${email}`);

  logger.logStep('Open IKEA home page');
  await homePage.open(subscribeData.homeUrl);
  await cookieHelper.acceptCookies();

  logger.logStep('Click the Jobs navigation tab');
  await homePage.clickJobsTab();
  await cookieHelper.acceptCookies();

  logger.logStep('Click Explore available jobs');
  await jobsLandingPage.clickExploreJobs();
  await cookieHelper.acceptCookies();

  logger.logStep('Scroll to subscription block and fill email');
  await jobSubscribePage.scrollToSubscriptionBlock();
  await jobSubscribePage.fillEmail(email);

  try {
    const filledValue = await jobSubscribePage.emailInput.inputValue();
    logger.logAssertion('Assert email field contains the generated email');
    expect(filledValue).toBe(email);
  } catch (error) {
    logger.error(`Email input assertion failed: ${error.message}`);
    throw error;
  }

  logger.logStep(`Select category: ${subscribeData.category}`);
  await jobSubscribePage.selectCategory(subscribeData.category);

  logger.logStep(`Fill location and pick from suggestions: ${subscribeData.location}`);
  await jobSubscribePage.fillLocationAndSelect(subscribeData.location);

  logger.logStep('Click Add Job Alert to confirm category and location selection');
  await jobSubscribePage.clickAddAlert();

  logger.logStep('Click Sign Up button');
  await jobSubscribePage.clickSignUp();

  logger.logStep('Assert confirmation message is displayed');
  try {
    const confirmationText = await jobSubscribePage.getConfirmationText();
    logger.logAssertion('Assert confirmation message contains "submitted successfully"');
    expect(confirmationText).toContain('submitted successfully');
    logger.logAction(`Confirmation message: "${confirmationText}"`);
  } catch (error) {
    logger.error(`Confirmation message assertion failed: ${error.message}`);
    throw error;
  }
});
