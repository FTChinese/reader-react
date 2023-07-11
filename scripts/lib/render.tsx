import { renderToStaticMarkup } from 'react-dom/server';
import { readPkgFile } from './pkgFile';
import { Index } from '../template/IndexPage';
import { resolve } from 'path';
import { footerMatrix, meta } from './data';
import React from 'react';
import { writeFile } from 'node:fs/promises';

/**
 * Render's React component to html string.
 * Usually used to generate index.html in a project's root.
 */
export function render(page: JSX.Element): string {
  const htmlStr = renderToStaticMarkup(page);

  return `<!DOCTYPE html>
  ${htmlStr}
  `;
}

export async function renderIndex(
  props: {
    baseHref: string;
    title: string;
    footerMatrix: boolean;
    stripe: boolean;
    gtag: boolean;
    to: string;
  }
) {
  const pkg = await readPkgFile(resolve(__dirname, '../../'));

  const bsv = pkg.devDependencies.bootstrap.replace('^', '');

  const htmlStr = render(
    <Index
      baseHref={props.baseHref}
      title={props.title}
      bootstrapVersion={bsv}
      iconBaseUrl={meta.baseUrl}
      iconSizes={meta.iconSizes}
      footer={props.footerMatrix ? footerMatrix : undefined}
      stripe={props.stripe}
      gtag={props.gtag}
    />
  );

  await writeFile(props.to, htmlStr, { encoding: 'utf8' });
}
