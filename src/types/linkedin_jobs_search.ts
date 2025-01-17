import { Browser } from "playwright";
import { waitSeconds, waitMiliSeconds, randomDelayMs } from "./random_utils";

import { chromium } from "playwright-extra";

export const jobsSearch = async function jobsSearch() {
  let browser: Browser | null = null;
  console.log("jobs search start");

  try {
    browser = await chromium.launch({
      headless: false,
      args: ["--disable-blink-features=AutomationControlled"],
    });
    const context = await browser.newContext({
      storageState: "./src/json/linkedin-jobsearch.json",
    });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto(
      "https://www.linkedin.com/jobs/search/?currentJobId=4062600801&distance=25&f_E=4&f_JT=F%2CC&f_SB2=4&f_TPR=r86400&f_VJ=true&f_WT=1%2C2%2C3&geoId=103644278&keywords=Java&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true&sortBy=R"
    );

    await page.waitForTimeout(waitMiliSeconds());




    let currentPage = 1;
    // let jobCounter = 0;

    const jobListings = await page.$$('//div[contains(@class,"display-flex job-card-container")]');
    console.log(`Number of job listed on page ${currentPage}: ${jobListings.length}`);



    // const jobListingsUl = await page.$(
    //   '//*[@id="main"]/div/div[2]/div[1]/div/ul'
    // );

    // await page.waitForSelector('//*[@id="main"]/div/div[2]/div[1]/div/ul', {
    //   timeout: 10000,
    // });


      let jobCounter = 0;
      for (let job of jobListings) {
        // console.log(`Job link: ${jobCounter}`);
        // const jobLink = await job.$('a');
        // if (jobLink) {
          // const href = await job.getAttribute('href');
          // console.log(`Job link: ${href}`);
          // jobCounter++;
          await page.waitForTimeout(waitMiliSeconds());
          jobCounter++;
          await job.click();
          await page.waitForTimeout(waitMiliSeconds());
        // }
      }
      console.log(`job: ${jobCounter}`);


    

    // if (jobListings.length === 0) {
    //   console.log(`No jobs found on page ${currentPage}. Exiting.`);
    // }

    await context.storageState({ path: "./src/json/linkedin-jobsearch-result.json" });
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    if (browser) {
      // await browser.close();
    }
  }

  console.log("jobs search end");
};
