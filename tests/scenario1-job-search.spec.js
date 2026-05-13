import { test, expect } from '@playwright/test';
import CookieHelper from '../helpers/cookieHelper.js';
import jobData from '../test-data/jobSearch.js';
import HomePage from '../pages/HomePage.js';
import JobsLandingPage from '../pages/JobsLandingPage.js';
import JobSearchPage from '../pages/JobSearchPage.js';
import JobDetailsPage from '../pages/JobDetailsPage.js';
import SavedJobsPage from '../pages/SavedJobsPage.js';

test('Scenario 1: Search for a job', async ({ page }) => {
  const cookieHelper = new CookieHelper(page);
  const homePage = new HomePage(page);
  const jobsLandingPage = new JobsLandingPage(page);
  const jobSearchPage = new JobSearchPage(page);
  const jobDetailsPage = new JobDetailsPage(page);
  const savedJobsPage = new SavedJobsPage(page);

  let activeKeyword;

  await test.step('Open the IKEA website', async () => {
    await homePage.open(jobData.homeUrl);
    await cookieHelper.acceptCookies();
  });

  await test.step("Click 'Jobs' tab", async () => {
    await homePage.clickJobsTab();
    await cookieHelper.acceptCookies();
  });

  await test.step("Click 'Explore available jobs'", async () => {
    await jobsLandingPage.clickExploreJobs();
    await cookieHelper.acceptCookies();
  });

  await test.step(`Search for '${jobData.primaryKeyword}' with fallback to '${jobData.fallbackKeyword}' and open first result`, async () => {
    activeKeyword = await jobSearchPage.searchWithFallback(jobData.primaryKeyword, jobData.fallbackKeyword);
    await cookieHelper.acceptCookies();
    await jobSearchPage.clickFirstJob();
  });

  await test.step(`Verify job title contains '${jobData.primaryKeyword}' or '${jobData.fallbackKeyword}'`, async () => {
    const title = (await jobDetailsPage.getJobTitle()).trim();
    expect(title).toContain(activeKeyword);
  });

  await test.step("Save job and verify saved jobs counter shows 1", async () => {
    await jobDetailsPage.clickSave();
    expect(await jobDetailsPage.getSavedJobsCount()).toBe(jobData.expectedCount);
  });

  await test.step("Open 'Saved jobs' and verify saved job title", async () => {
    await jobDetailsPage.clickSavedJobsButton();
    const savedTitle = (await savedJobsPage.getFirstSavedJobTitle()).trim();
    expect(savedTitle).toContain(activeKeyword);
  });
});
