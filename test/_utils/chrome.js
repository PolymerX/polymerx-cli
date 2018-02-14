const puppeteer = require('puppeteer');

const startChrome = async () => {
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
};

const loadPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url);
  return page;
};

const getContent = page => page.content();

module.exports = {startChrome, loadPage, getContent};
