import { Browser } from "playwright";
import { waitSeconds, waitMiliSeconds, randomDelayMs } from "./random_utils";

import { chromium } from "playwright-extra";

export const jobs = async function jobs() {
  let browser: Browser | null = null;
  console.log("jobs start");

  try {
    browser = await chromium.launch({
      headless: false,
      args: ["--disable-blink-features=AutomationControlled"],
    });
    const context = await browser.newContext({
      storageState: "./src/json/linkedin-jobs.json",
    });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("https://www.linkedin.com/jobs/");

    await page.waitForSelector("a.global-nav__primary-link--active", {
      timeout: 10000,
    });

    await page.waitForTimeout(waitMiliSeconds());
    await page
      .getByRole("combobox", { name: "Search by title, skill, or" })
      .click();
    await page.waitForTimeout(waitSeconds());

    const search = await page.getByRole("combobox", {
      name: "Search by title, skill, or",
    });
    search.fill("Java Developer", {
      timeout: 100000,
    });
    await page.waitForTimeout(waitMiliSeconds());
    search.press("Enter");

    await page.waitForSelector("a.global-nav__primary-link--active", {
      timeout: 10000,
    });

    await page.waitForTimeout(waitMiliSeconds());

    const datePostPath = '//*[@id="searchFilter_timePostedRange"]';
    const datePost = await page.locator(datePostPath);
    await page.waitForSelector(datePostPath);
    await datePost.click();
    await page.waitForTimeout(waitMiliSeconds());

    const dateSelectLi = await page.$$(
       `//label[contains(@class,"search-reusables__value-label")][contains(@for,"timePostedRange-")]`
    );
    if (dateSelectLi) {
      console.log(`Number of job listed on page ${dateSelectLi.length}`);
    }

    // Focus and click on the third option if it exists
    if (dateSelectLi[3]) {
      await dateSelectLi[3].focus();
      await page.waitForTimeout(waitMiliSeconds());
      await dateSelectLi[3].click();
    } else {
      console.error("The third date posted option is not available.");
    }

    // await page.click("//button[@aria-label='Easy Apply filter.']");
    await page.waitForTimeout(waitMiliSeconds());

    // const dateSelectPath = '#timePostedRange-r86400';
    // const dateSelect = await page.locator(dateSelectPath);
    // await page.waitForSelector(dateSelectPath);

    // await dateSelect.evaluate((el) => {
    //   el.setAttribute('data-artdeco-is-focused', 'true');
    // });
    // // await dateSelect.focus();
    // await dateSelect.click();
    // await page.waitForTimeout(waitMiliSeconds());
    // await dateSelect.hover();
    // await page.waitForTimeout(waitMiliSeconds());
    // await dateSelect.click();
    // await page.waitForTimeout(waitSeconds());

    await context.storageState({ path: "./src/json/linkedin-jobsearch.json" });
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    if (browser) {
      // await browser.close();
    }
  }
  console.log("jobs end");
};
