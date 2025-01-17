import { Browser } from "playwright";
import {
  waitSeconds,
  waitMiliSeconds,

} from "./random_utils";

import { chromium } from "playwright-extra";

export const feed = async function feed() {
  console.log("feed start");
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
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("https://www.linkedin.com/feed/");

    const linkXPath = '//*[@id="global-nav"]/div/nav/ul/li[3]/a';

    const link=await page.locator(linkXPath);

    await page.waitForSelector(linkXPath);

    await link.hover();

    await link.click();


    await page.waitForSelector("a.global-nav__primary-link--active", {
      timeout: 10000,
    });

    // page.waitForTimeout(waitSeconds());

    await context.storageState({ path: "./src/json/linkedin-jobs.json" });
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  console.log("feed end");
};
