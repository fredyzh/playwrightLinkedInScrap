import { Browser } from "playwright";
import {
  randomDelayMs,
  waitSeconds,
  waitMini,
  waitMiliSeconds,
  randomTrue,
} from "./random_utils";

import { chromium } from "playwright-extra";
// const stealth = require('playwright-extra-plugin-stealth');
// // import stealth from 'playwright-extra-plugin-stealth';

// chromium.use(stealth());

export const login = async function login() {
  console.log("login start");
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: false,
      args: ["--disable-blink-features=AutomationControlled"],
    });
    const context = await browser.newContext({
      storageState: "./src/json/linkedin-login.json",
    });
    const page = await context.newPage();
    console.log("1");
    await page.setViewportSize({ width: 1280, height: 720 });


    const localurl =
      "C://project2024/playwright/linkedin/my-typescript-project/src/files/signin_linkedIn.htm";
    const url = "https://www.linkedin.com/login";
  //  const url1 = "https://bot.sannysoft.com";

    await page.goto(url);

    await page.type('input[name="session_key"]', "fredyzh@gmail.com", {
      delay: randomDelayMs(2, 4, 0, 9),
      timeout: 100000,
    });

    await page.waitForTimeout(waitMiliSeconds());
    await page.type('input[name="session_password"]', "Jz102702", {
      delay: randomDelayMs(2, 4, 0, 9),
      timeout: 100000,
    });

    await page.waitForTimeout(waitMiliSeconds());

    if (randomTrue()) {
      await page.keyboard.press("Enter");
    } else {
      await page.hover('button[type="submit"]');
      await page.waitForTimeout(waitMiliSeconds());
      await page.click('button[type="submit"]', {
        delay: randomDelayMs(3, 5, 0, 9),
      });
    }
    // await page.waitForTimeout(waitSeconds()*1.5);
    await page.waitForSelector("a.global-nav__primary-link--active", {
      timeout: 0,
    });

    //Wait until the login is complete AND reaches Home Page
    console.log("Login was Sucessfull");

    // await page.waitForTimeout(waitMiliSeconds());

    // await page.goto('https://www.linkedin.com/jobs/');

    // const jobslink = await page.locator(
    //   '//div[contains(@class,"t-12 global-nav__primary-link-text")]'
    // );
    // console.log("Jobs link found");

    // if (!jobslink) {
    //   throw new Error("Jobs link not found");
    // }
    // jobslink.click();

    // await page.getByRole('combobox', { name: 'Search by title, skill, or' }).click();

    // let currentPage = 1;
    // let jobCounter = 0;

    // const jobListings = await page.$$(
    //   '//div[contains(@class,"display-flex job-card-container")]'
    // );
    // console.log(
    //   `Number of job listed on page ${currentPage}: ${jobListings.length}`
    // );

    // for (let job of jobListings) {
    // }

    // await page
    //   .getByRole("combobox", { name: "Search by title, skill, or" })
    //   .click();
    // await page.waitForTimeout(3000);

    // await page.getByRole('combobox', { name: 'Search by title, skill, or' }).fill('Data Engineer');
    // await page.getByRole('combobox', { name: 'Search by title, skill, or' }).press('Enter');
    // await page.waitForTimeout(5000)

    await context.storageState({ path: "./src/json/linkedin-login.json" });
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  console.log("login end");
};
