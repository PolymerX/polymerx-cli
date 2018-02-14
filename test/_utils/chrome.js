const puppeteer = require('puppeteer');

const startChrome = () => {
  console.log('Launching Chrome');
  return puppeteer.launch({args: [
    '--window-size=1024,768',
    '--disable-gpu',
    '--enable-logging',
    '--no-sandbox'
  ]})
  .then(browser => {
    const endpoint = browser.wsEndpoint();
    console.log(endpoint);
    return browser;
  });
};

const loadPage = (browser, url) => {
  return browser.newPage()
    .then(page =>
      new Promise(resolve =>
        page.goto(url).then(() => resolve(page))
      )
    );
};

const getContent = page => page.content();

module.exports = {startChrome, loadPage, getContent};
