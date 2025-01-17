import { Browser, Page } from "playwright";
import {
  waitSeconds,
  waitMiliSeconds,
  randomDelayMs,
  randomTrue,
} from "./random_utils";
import {
  exclusiveKeyWorkds,
  JobFilteredList,
  linkedinUrl,
  currentDate,
} from "./constant_utils";
import * as fs from "fs";

import { chromium } from "playwright-extra";

export const jobsFilters = async function jobsFilters() {
  let browser: Browser | null = null;
  let filterArray: JobFilteredList[] = [];
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
    await page.goto(linkedinUrl + "jobs/");

    await page.waitForSelector("a.global-nav__primary-link--active", {
      timeout: 10000,
    });

    await page.waitForTimeout(waitMiliSeconds());
    await page
      .getByRole("combobox", { name: "Search by title, skill, or" })
      .click();
    await page.waitForTimeout(waitMiliSeconds());

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

    await page.waitForTimeout(waitMiliSeconds() * 2);

    const allFilterPath = `//button[contains(@class,"artdeco-pill")][contains(@aria-label,"Show all filters.")]`;
    const allFilter = await page.locator(allFilterPath);
    await page.waitForSelector(allFilterPath);
    await page.waitForTimeout(waitMiliSeconds());
    await allFilter.click();
    await page.waitForTimeout(waitMiliSeconds());

    const allFilterLi = await page.$$(
      `//li[contains(@class,"search-reusables__secondary-filters-filter")]`
    );
    if (allFilterLi) {
      console.log(`Number of filter listed on page ${allFilterLi.length}`);
    }

    let filterCounter = 0;
    for (let filter of allFilterLi) {
      const filterLi = await filter.$$(
        `//label[contains(@class,"search-reusables__value-label")]`
      );

      if (filterLi.length != 0) {
        // console.log(`filterCounter: ${filterCounter}`);
        switch (filterCounter) {
          case 0:
            await filterLi[0].click();
            await page.waitForTimeout(waitMiliSeconds() * 3);
            break;
          case 1:
            await page.waitForTimeout(waitMiliSeconds() * 3);
            // await page.mouse.click(1130, 300);
            await filterLi[3].click();
            await page.waitForTimeout(waitMiliSeconds() * 3);
            break;
          case 2:
            await page.mouse.click(1130, 300);
            await page.waitForTimeout(waitMiliSeconds() * 3);
            await filterLi[3].click();
            await page.waitForTimeout(waitMiliSeconds() * 2);
            break;
          case 3:
            break;
          case 4:
            await page.mouse.click(1130, 200);
            await page.waitForTimeout(waitMiliSeconds() * 3);
            await filterLi[0].click();
            await page.waitForTimeout(waitMiliSeconds() * 3);
            await filterLi[2].click();
            break;

          default:
            break;
        }
      } else {
        await page.mouse.click(1130, 200);
        await page.waitForTimeout(waitMiliSeconds() * 3);
        if (filterCounter == 8) {
          const switchbox = await filter.$(
            `//div[contains(@class,"search-reusables__advanced-filters-binary-toggle")]`
          );
          if (switchbox) {
            switchbox.focus();
            await page.waitForTimeout(waitMiliSeconds() * 3);
            switchbox.click();
            await page.waitForTimeout(waitMiliSeconds() * 3);
          } else {
            console.log(`switchbox not found ${filterCounter}`);
          }
        }
      }

      filterCounter++;
    }

    const searchButton = await page.$(
      `//button[contains(@class,"reusable-search-filters-buttons search-reusables__secondary-filters-show-results-button")]`
    );

    if (searchButton) {
      await searchButton.click();
    } else {
      console.log(`searchButton not found`);
    }

    await page.waitForTimeout(waitMiliSeconds() * 4);

    let currentPage = 1;
    let jobCounter = 0;

    while (true) {
      console.log(`Navigating to page ${currentPage}`);

      await page.mouse.move(150, 300);

      await page.mouse.click(150, 300);
      await page.waitForTimeout(waitMiliSeconds() * 2);
      await page.mouse.wheel(150, 1000);
      await page.waitForTimeout(waitMiliSeconds() * 2);
      await page.mouse.wheel(150, 1000);
      await page.waitForTimeout(waitMiliSeconds() * 2);
      await page.mouse.wheel(150, 800);
      await page.waitForTimeout(waitMiliSeconds() * 2);
      await page.mouse.wheel(150, 800);
      await page.waitForTimeout(waitMiliSeconds());

      const jobListings = await page.$$(
        '//div[contains(@class,"display-flex job-card-container")]'
      );
      console.log(
        `Number of job listed on page ${currentPage}: ${jobListings.length}`
      );

      if (jobListings.length === 0) {
        console.log(`No jobs found on page ${currentPage}. Exiting.`);
        break;
      }

      // Start applying jobs in Current Page
      for (let i = 0; i < jobListings.length; i++) {
        jobCounter++;
        let ignore=false;

        let jobName: string = "";
        const jobNameElement = await jobListings[i].$(
          `//div[contains(@class,"full-width artdeco-entity-lockup__title ember-view")]`
        );
        if (jobNameElement) {
          jobName = (await jobNameElement.textContent()) || "";
          jobName = jobName.replace(" ", "");
          const words = jobName.split(`\n`);

          for (let i = 0; i < words.length; i++) {
            const word = words[i].trim();
            if (word.length > 0) {
              jobName = word;
              break;
            }
          }
          // console.log(`Job Name: ${jobName}`);
        }

        let containsExclusiveKeyword = false;

        for (const keyword of exclusiveKeyWorkds) {
          if (jobName.toUpperCase().includes(keyword)) {
            // console.log(`Job contains exclusive keyword: ${keyword}`);
            containsExclusiveKeyword = true;
            break;
          }
        }

        if (containsExclusiveKeyword) {
          continue;
        }

        const alreadyApplied = await page.$(
          'span.artdeco-inline-feedback__message:has-text("Applied")'
        );
        if (alreadyApplied) {
          continue;
        }

        if (await jobListings[i].isVisible()) {
          await jobListings[i].click();
        } else {
          continue;
        }

        if (randomTrue()) {
          await page.waitForTimeout(waitMiliSeconds() * 5);
        } else {
          await page.waitForTimeout(waitMiliSeconds() * 2);
        }

        const applyedNumberElement = await page.$(
          `//span[contains(@class,"jobs-premium-applicant-insights__list-num t-18 t-bold pr2")]`
        );

        let applyedNumber = 0;
        if (applyedNumberElement) {
          const applyedNumberText = await applyedNumberElement.textContent();
          if (applyedNumberText) {
            applyedNumber = parseInt(applyedNumberText.replace(/\D/g, ""), 10); // Remove non-digit characters and parse as integer

            if (applyedNumber > 50) {
              // console.log(`Number of applied more than 50`);
              continue;
            }
          }
        }

        const companyAtElement = await jobListings[i].$(
          `//div[contains(@class,"artdeco-entity-lockup__subtitle ember-view")]`
        );

        let companyAtText: string = "";
        if (companyAtElement) {
          companyAtText = (await companyAtElement.textContent())!.trim() || "";
          // console.log(`${companyAtText}`); // Fallback if job name is not found
        } else {
          console.log(`companyAtElement not found`);
        }

        const jobLinkElement = await page.$(
          `//div[contains(@class,"t-24 job-details-jobs-unified-top-card__job-title")]`
        );

        let jobLink: string = "";
        if (jobLinkElement) {
          const href1 = await jobLinkElement.$(`a`);
          if (href1) {
            jobLink = (await href1.getAttribute("href")) || "";
            // console.log(`joblink: ${jobLink}`);
          }
        } else {
          console.log(`jobLink not found`);
        }

        let jobRepostedDiv: string[] = [];

        const jobRepostedDivElement = await page.$$(
          `//div[contains(@class,"t-black--light mt2")]`
        );

        if (jobRepostedDivElement) {
          for (let i = 0; i < jobRepostedDivElement.length; i++) {
            const text = await jobRepostedDivElement[i].textContent();
            if (text) {
              jobRepostedDiv.push(text.trim());
            }
          }
        }

        const preferencesSkillsElement = await page.$(
          `//button[contains(@class,"job-details-preferences-and-skills")]`
        );

        let preferences: string[] = [];
        if (preferencesSkillsElement) {
          const preferencesSkills = await page.$$(
            `//div[contains(@class,"job-details-preferences-and-skills__pill")]`
          );

          for (let i = 0; i < preferencesSkills.length; i++) {
            const text = await preferencesSkills[i].textContent();
            if (text) {
              for (const keyword of exclusiveKeyWorkds) {
                if(text.trim().toUpperCase().includes(keyword)){
                  console.log(`Job contains exclusive keyword: ${keyword}`);
                  console.log(`Job preferences: ${text.trim()}`);
                  ignore=true;
                  break;
                }
              }

              if(ignore){
                break;
              }

              jobRepostedDiv.push(text.trim());
            }
          }
        }

        if(ignore){
          continue;
        }

        let jobFilteredList: JobFilteredList = {
          jobName: jobName,
          jobLink: linkedinUrl + jobLink,
          jobCompanyAt: companyAtText,
          jobRepostedDiv: jobRepostedDiv,
          jobPreferSkills: preferences,
          jobappliedtotal: applyedNumber,
        };

        filterArray.push(jobFilteredList);
      }
      currentPage++;
      const nextPageButton = await page.$(
        `button[aria-label="Page ${currentPage}"]`
      );

      if (nextPageButton) {
        await nextPageButton.click();
        await page.waitForTimeout(waitSeconds()); // Adjust wait time as needed
        console.log(`Navigated to page ${currentPage}`);
      } else {
        console.log(`No more pages found. Exiting.`);

        console.log(`total: ${filterArray.length}`);
        fs.writeFileSync(
          "./src/out/result_" + currentDate() + ".json",
          JSON.stringify(filterArray, null, 2),
          "utf8"
        );
        await context.storageState({
          path: "./src/json/linkedin-jobsearch.json",
        });
        break;
      }
    }
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  console.log("jobs end");
};

async function getJobName(page: Page): Promise<string> {
  try {
    // Use XPath to select the job name element
    const jobNameElement = await page.$(
      '//h1[contains(@class,"t-24 t-bold")]//a[1]'
    );
    if (jobNameElement) {
      const jobName = await jobNameElement.textContent();
      if (jobName) {
        return jobName.trim();
      }
    }
    return "Unknown Job"; // Fallback if job name is not found
  } catch (error) {
    console.error("Error extracting job name:", error);
    return "Unknown Job";
  }
}
