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
  return new Promise(async resolve => {
    await page.goto(url, {waitUntil: 'networkidle0'});
    resolve(page);
  });
};

const getWelcomeText = page => page.evaluate(() => {
  const el = document.querySelector('sk-app'); // eslint-disable-line no-undef
  const welcome = el.shadowRoot.querySelector('.Welcome');
  return Promise.resolve(welcome.textContent);
});

module.exports = {startChrome, loadPage, getWelcomeText};
