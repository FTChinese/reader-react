import { JSDOM } from 'jsdom';
import { basename, resolve } from 'node:path';
import * as shell from 'shelljs';
import { readPkgFile } from './pkgFile';
import { writeFile } from 'node:fs/promises';
import { Config } from './config';

/**
 * Add prefix to css and js bundle.
 */
export async function prependAssetsUrl(fileName: string, urlPrefix: string): Promise<string> {
  const dom = await JSDOM.fromFile(fileName);

  const document = dom.window.document;

  //
  document.querySelectorAll('link')
    .forEach(link => {

      const href = link.getAttribute('href');

      console.log(`Processing href ${href}`);

      if (href && !href.startsWith('http')) {

        const prefixed = resolve(urlPrefix, basename(href));

        console.log(`Path prefixed ${prefixed}`);

        link.setAttribute('href', prefixed);
      }
    });

  document.querySelectorAll('script')
    .forEach(script => {
      const src = script.getAttribute('src');

      if (src && !src.startsWith('http')) {

        const prefixed = resolve(urlPrefix, basename(src));

        console.log(`Path prefixed ${prefixed}`);

        script.setAttribute('src', prefixed);
      }
    });

  return dom.serialize();
}

/**
 * Generate HTML modified from `from` file by modifying static assets url and write to `to` file.
 * @param to - the file name to write to
 * @param from - the html file name to modify static asset url.
 */
export async function generateServerHtml(props: {
  to: string,
  from: string,
  prefix: string,
}) {
  console.log(`Modify static asset url in html file ${props.from}`);
  const htmlContent = await prependAssetsUrl(
    props.from,
    props.prefix,
  );

  // Output html to current directory.
  // It will be copied by shelljs together with js and css.
  await writeFile(
    props.to,
    htmlContent,
    { encoding: 'utf8' });

  console.log(`Modified html file saved to ${props.to}`);
}

export async function generateVersionFile(to: string, version: string) {
  await writeFile(
    to,
    version,
    { encoding: 'utf8' },
  );

  console.log(`Created client version file ${to}`);
}

export async function copyFiles(config: Config) {

  console.log(`Copy frontend assets to ${config.deployAssetDir}`);

  shell.mkdir('-p', config.deployAssetDir);
  shell.cp(config.sourceJsFile, config.deployAssetDir);
  shell.cp(config.sourceCssFile, config.deployAssetDir);


  console.log(`Copy html file to ${config.deployHtmlDir}`);

  shell.mkdir('-p', config.deployHtmlDir);
  shell.cp(config.targetHtmlFile, config.deployHtmlDir);

  console.log(`Copy client version file to ${config.deployRootDir}`);
  shell.cp(config.targetVersionFile, config.deployRootDir);
}

/**
 * Generate required files for production.
 * Pass command argument `--prod=true` will copy
 * js and css files to production directory.
 * @param config
 */
export async function deploy(config: Config) {
  await generateServerHtml({
    to: config.targetHtmlFile,
    from: config.sourceHtmlFile,
    prefix: config.staticPrefix,
  });

  const pkg = await readPkgFile(config.packageDir);

  await generateVersionFile(
    config.targetVersionFile,
    pkg.version,
  );

  await copyFiles(config);
}
