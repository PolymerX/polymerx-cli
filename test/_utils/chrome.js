const puppeteer = require('puppeteer');

const startChrome = () => {
  console.log('Launching Chrome');
  return puppeteer.launch({args: [
    '--window-size=1024,768',
    '--disable-gpu',
    '--enable-logging',
    '--no-sandbox'
  ]}).then(browser => {
    const endpoint = browser.wsEndpoint();
    console.log(endpoint);
    return browser;
  });
};

const loadPage = (browser, url) => {
  return browser.newPage()
    .then(page =>
      new Promise(resolve =>
        page.goto(url, {
          waitUntil: 'networkidle0'
        }).then(() => resolve(page))
      )
    );
};

const getWelcomeText = page => page.evaluate(() => {
  const el = document.querySelector('sk-app'); // eslint-disable-line no-undef
  const welcome = el.shadowRoot.querySelector('.Welcome');
  return Promise.resolve(welcome.textContent);
});

module.exports = {startChrome, loadPage, getWelcomeText};
