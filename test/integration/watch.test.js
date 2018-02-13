
import {resolve} from 'path';
import {readFile, writeFile} from 'fs';
import promisify from 'pify';
import test from 'ava';
import {create, watch} from './../_utils/cli';
import {startChrome, loadPage, waitText} from './../_utils/chrome';

const pRead = promisify(readFile);
const pWrite = promisify(writeFile);

let chrome;

test.before(() => {
  chrome = startChrome();
});

test.after.always(() => chrome.close());

test('should create development server with hot reloading.', async t => {
  const app = await create('polymer-skeleton');
  const templateAppFile = resolve(app, './src/components/containers/sk-app/template.html');

  await watch(app, '127.0.0.1', 8083);
  const page = await loadPage(chrome, 'http://localhost:8083/');

  const templateAppSource = await pRead(templateAppFile, 'utf8');
  const newTemplateSource = templateAppSource
                              .replace('<h1 class="Title">Web Components — Now.</h1>', '<h1>Test App</h1>');
  await pWrite(templateAppFile, newTemplateSource);

  const text = await waitText(page, '.Title');

  t.is(text, 'Test App');
});
