const { test, expect } = require('@playwright/test');
const Logger = require('../utils/logger');
const CookieHelper = require('../helpers/cookieHelper');
const jobData = require('../test-data/jobSearch');
const HomePage = require('../pages/HomePage');
const JobsLandingPage = require('../pages/JobsLandingPage');
const JobSearchPage = require('../pages/JobSearchPage');
const JobDetailsPage = require('../pages/JobDetailsPage');
const SavedJobsPage = require('../pages/SavedJobsPage');

test('Scenario 1: Search for a job', async ({ page }) => {
  const logger = new Logger();
  const cookieHelper = new CookieHelper(page, logger);
  const homePage = new HomePage(page, logger);
  const jobsLandingPage = new JobsLandingPage(page, logger);
  const jobSearchPage = new JobSearchPage(page, logger);
  const jobDetailsPage = new JobDetailsPage(page, logger);
  const savedJobsPage = new SavedJobsPage(page, logger);

  let activeKeyword = jobData.primaryKeyword;

  logger.logStep('Step 1: Open the IKEA website');
  await homePage.open(jobData.homeUrl);
  await cookieHelper.acceptCookies();

  logger.logStep("Step 2: Click on 'Jobs' tab");
  await homePage.clickJobsTab();
  await cookieHelper.acceptCookies();

  logger.logStep("Step 3: Click on 'Explore available jobs'");
  await jobsLandingPage.clickExploreJobs();
  await cookieHelper.acceptCookies();

  logger.logStep(`Step 4: Input '${activeKeyword}' in Search field and leave postcode empty`);
  await jobSearchPage.fillKeyword(activeKeyword);
  await jobSearchPage.clearLocation();

  logger.logStep("Step 5: Click on 'Search jobs' button");
  await jobSearchPage.clickSearch();
  await cookieHelper.acceptCookies();

  logger.logStep('Step 6: If search returns 0 jobs — go back and search for fallback keyword');
  if (await jobSearchPage.hasNoResults()) {
    logger.logAction(`No results for '${activeKeyword}' — going back and retrying with '${jobData.fallbackKeyword}'`);
    activeKeyword = jobData.fallbackKeyword;
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await cookieHelper.acceptCookies();
    await jobSearchPage.fillKeyword(activeKeyword);
    await jobSearchPage.clearLocation();
    await jobSearchPage.clickSearch();
    await cookieHelper.acceptCookies();
  } else {
    logger.logAction(`Search returned results for '${activeKeyword}' — no fallback needed`);
  }

  logger.logStep('Step 7: Click on the first job in the list');
  await jobSearchPage.clickFirstJob();

  logger.logStep(`Step 8: Check that partial job title contains '${activeKeyword}'`);
  try {
    const title = (await jobDetailsPage.getJobTitle()).trim();
    logger.logAssertion(`Assert job title contains '${activeKeyword}'`);
    expect(title).toContain(activeKeyword);
  } catch (error) {
    logger.error(`Job title assertion failed: ${error.message}`);
    throw error;
  }

  logger.logStep("Step 9: Click on 'Save' button");
  await jobDetailsPage.clickSave();

  logger.logStep("Step 10: Check that 'Saved jobs' element has '1' in it");
  try {
    const count = await jobDetailsPage.getSavedJobsCount();
    logger.logAssertion(`Assert saved jobs counter shows ${jobData.expectedCount}`);
    expect(count).toBe(jobData.expectedCount);
  } catch (error) {
    logger.error(`Saved jobs counter assertion failed: ${error.message}`);
    throw error;
  }

  logger.logStep("Step 11: Click on 'Saved jobs' element");
  await jobDetailsPage.clickSavedJobsButton();

  logger.logStep(`Step 12: Check that the job title in 'Saved jobs' contains '${activeKeyword}'`);
  try {
    const savedTitle = (await savedJobsPage.getFirstSavedJobTitle()).trim();
    logger.logAssertion(`Assert saved job title contains '${activeKeyword}'`);
    expect(savedTitle).toContain(activeKeyword);
  } catch (error) {
    logger.error(`Saved job title assertion failed: ${error.message}`);
    throw error;
  }
});
