import { isAbsolute, resolve } from 'path';
import { promises } from 'fs';
import { Config, config } from './config';
import { JSDOM } from 'jsdom';
import { readPkgFile } from './lib/readPkgFile';

const { writeFile } = promises;

/**
 * Add prefix to css and js bundle.
 */
 async function prependAssetsUrl(fileName: string): Promise<string> {
  const dom = await JSDOM.fromFile(fileName);

  const document = dom.window.document;

  document.querySelectorAll('link')
    .forEach(link => {
      const rel = link.getAttribute('rel');
      if (rel !== 'stylesheet') {
        return;
      }

      const href = link.getAttribute('href');

      if (href && !href.startsWith('http') && !isAbsolute(href)) {
        link.setAttribute('href', `${config.staticPrefix}${href}`);
      }
    });

  document.querySelectorAll('script')
    .forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        script.setAttribute('src', `${config.staticPrefix}${src}`);
      }
    });

  return dom.serialize();
}

async function build(config: Config): Promise<void> {

  const homeContent = await prependAssetsUrl(resolve(process.cwd(), 'dist/index.html'));

  // Output html to current directory.
  // It will be copied by shelljs together with js and css.
  await writeFile(
    config.goTemplateFile,
    homeContent,
    { encoding: 'utf8' });

  const pkg = await readPkgFile();
  await writeFile(
    config.versionFile,
    pkg.version,
    { encoding: 'utf8' },
  );
}

build(config)
  .then(() => {
    console.log('Finished');
  })
  .catch(err => console.log(err));


