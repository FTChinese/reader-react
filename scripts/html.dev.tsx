import { writeFile } from 'fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { footerMatrix } from './lib/footer';
import { readPkgFile } from './lib/readPkgFile';
import { Index } from './template/Index';

const baseUrl = 'https://www.ftacademy.cn/images/favicons';
const iconSizes = ['180x180', '152x152', '120x120', '76x76']

async function renderIndex(): Promise<string> {
  const pkg = await readPkgFile();
  const bsv = pkg.devDependencies.bootstrap.replace('^', '');
  const htmlStr = renderToStaticMarkup(
    <Index
      bootstrapVersion={bsv}
      iconBaseUrl={baseUrl}
      iconSizes={iconSizes}
      footer={footerMatrix}
    />
  );

  return `<!DOCTYPE html>
  ${htmlStr}
  `;
}

renderIndex()
  .then(content => {
    return writeFile(
      'index.html',
      content,
      { encoding: 'utf8' }
    );
  })
  .then(() => {
    console.log('Done');
  })
  .catch(err => {
    console.log(err);
  });
