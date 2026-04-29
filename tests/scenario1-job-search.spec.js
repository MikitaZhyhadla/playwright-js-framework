const { test, expect } = require('@playwright/test');
const Logger = require('../utils/logger');
const CookieHelper = require('../helpers/cookieHelper');
const jobData = require('../test-data/jobSearch');
const HomePage = require('../pages/HomePage');
const JobsLandingPage = require('../pages/JobsLandingPage');
const JobSearchPage = require('../pages/JobSearchPage');
const JobDetailsPage = require('../pages/JobDetailsPage');
const SavedJobsPage = require('../pages/SavedJobsPage');

test('Scenario 1: IKEA job search and save workflow', async ({ page }) => {
  const logger = new Logger();
  const cookieHelper = new CookieHelper(page, logger);
  const homePage = new HomePage(page, logger);
  const jobsLandingPage = new JobsLandingPage(page, logger);
  const jobSearchPage = new JobSearchPage(page, logger);
  const jobDetailsPage = new JobDetailsPage(page, logger);
  const savedJobsPage = new SavedJobsPage(page, logger);

  let activeKeyword = jobData.primaryKeyword;

  logger.logStep('Open IKEA home page');
  await homePage.open(jobData.homeUrl);
  await cookieHelper.acceptCookies();

  logger.logStep('Click the Jobs navigation tab');
  await homePage.clickJobsTab();

  logger.logStep('Click Explore available jobs');
  await jobsLandingPage.clickExploreJobs();
  await cookieHelper.acceptCookies();

  logger.logStep(`Search for jobs using primary keyword: ${activeKeyword}`);
  await jobSearchPage.searchJobs(activeKeyword);
  await cookieHelper.acceptCookies();

  if (await jobSearchPage.hasNoResults()) {
    logger.logAction(`No results for ${activeKeyword}, navigating back and searching fallback keyword`);
    activeKeyword = jobData.fallbackKeyword;
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await cookieHelper.acceptCookies();
    await jobSearchPage.searchJobs(activeKeyword);
    await cookieHelper.acceptCookies();
  }

  logger.logStep('Click the first job in the search results');
  await jobSearchPage.clickFirstJob();

  try {
    const title = (await jobDetailsPage.getJobTitle()).trim();
    logger.logAssertion(`Assert job title contains ${activeKeyword}`);
    expect(title).toContain(activeKeyword);
  } catch (error) {
    logger.error(`Job title assertion failed: ${error.message}`);
    throw error;
  }

  logger.logStep('Save the job');
  await jobDetailsPage.clickSave();

  try {
    const savedCount = await jobDetailsPage.getSavedJobsCount();
    logger.logAssertion(`Assert saved jobs counter displays ${jobData.expectedCount}`);
    expect(savedCount).toBe(jobData.expectedCount);
  } catch (error) {
    logger.error(`Saved jobs counter assertion failed: ${error.message}`);
    throw error;
  }

  logger.logStep('Open saved jobs panel');
  await jobDetailsPage.clickSavedJobsLink();

  try {
    const savedJobTitle = (await savedJobsPage.getFirstSavedJobTitle()).trim();
    logger.logAssertion(`Assert saved job title contains ${activeKeyword}`);
    expect(savedJobTitle).toContain(activeKeyword);
  } catch (error) {
    logger.error(`Saved job title assertion failed: ${error.message}`);
    throw error;
  }
});
