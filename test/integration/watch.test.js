
import {resolve} from 'path';
import {readFile, writeFile} from 'fs';
import promisify from 'pify';
import test from 'ava';
import {create, watch} from './../_utils/cli';
import {startChrome, loadPage, getContent} from './../_utils/chrome';

const pRead = promisify(readFile);
const pWrite = promisify(writeFile);
const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));

let chrome;

test.after.always(() => chrome.close());

test('should create development server with hot reloading.', async t => {
  const app = await create('polymer-skeleton', undefined, true);
  const templateAppFile = resolve(app, './src/components/containers/sk-app/template.html');
  const indexAppFile = resolve(app, './src/index.html');

  chrome = await startChrome();
  await watch(app, '127.0.0.1', 8083);
  await wait(15000);
  const page = await loadPage(chrome, 'http://127.0.0.1:8083/');
  const oldContent = await getContent(page);
  await wait(2000);

  // Change files
  const templateAppSource = await pRead(templateAppFile, 'utf8');
  const indexAppSource = await pRead(indexAppFile, 'utf8');
  const newTemplateSource = templateAppSource
    .replace('<h1 class="Title">Web Components — Now.</h1>', '<h1 class="Title">Test App</h1>');
  const newIndexSource = indexAppSource
    .replace(
    '<script src="./vendor/webcomponents-loader.js" async></script>',
    '<script src="./vendor/webcomponents-lite.js" async shadydom></script>'
  );
  await pWrite(templateAppFile, newTemplateSource);
  await pWrite(indexAppFile, newIndexSource);

  await wait(5000);
  const content = await getContent(page);

  t.false(oldContent.includes('Test App'));
  t.true(content.includes('Test App'));
});
