import { normalize, resolve } from 'path';
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

      const href = link.getAttribute('href');

      console.log(`Processing href ${href}`);

      if (href && !href.startsWith('http')) {
        const prefixed = normalize(`${config.staticPrefix}${href}`);

        console.log(`Path prefixed ${prefixed}`);

        link.setAttribute('href', prefixed);
      }
    });

  document.querySelectorAll('script')
    .forEach(script => {
      const src = script.getAttribute('src');

      if (src && !src.startsWith('http')) {

        const prefixed = normalize(`${config.staticPrefix}${src}`);

        console.log(`Path prefixed ${prefixed}`);

        script.setAttribute('src', prefixed);
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


