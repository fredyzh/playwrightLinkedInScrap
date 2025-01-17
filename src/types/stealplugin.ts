import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'


export const stealth = async function stealth(){
    puppeteer
  .use(StealthPlugin())
  .launch({ headless: true })
  .then(async browser => {
    const page = await browser.newPage()
    await page.goto('https://bot.sannysoft.com')
    //await page.waitForDevicePrompt({ timeout: 5000 })
    await page.screenshot({ path: 'stealth.png', fullPage: true })
    await browser.close()
  })
}



