const puppeteer = require('puppeteer');

export async function startChrome() {
  console.log('Launching Chrome');
  const browser = await puppeteer.launch({args: [
    '--window-size=1024,768',
    '--disable-gpu',
    '--enable-logging',
    '--no-sandbox'
  ]});

  const endpoint = browser.wsEndpoint();
  console.log(endpoint);

  return browser;
}

export async function loadPage(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  return new Promise(resolve => page.once('load', () => resolve(page)));
}

export async function waitText(page, selector) {
  await page.waitForSelector(selector);
  return page.$eval(selector, el => el.textContent);
}

// export const getElementHtml = async (Runtime, selector) => {
//   let {
//     result
//   } = await Runtime.evaluate({
//     expression: `document.querySelector("${selector}").outerHTML`
//   });
//   return result.value;
// };
