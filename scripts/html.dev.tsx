import { renderIndex } from './lib/render';
import { resolve } from 'node:path';

async function generateFiles() {
  const to = resolve(process.cwd(), 'index.html');

  await renderIndex({
    baseHref: 'reader',
    title: '用户中心 - FT中文网',
    footerMatrix: true,
    stripe: true,
    gtag: true,
    to,
  });

  console.log(`Dev html updated: ${to}`);
}

generateFiles()
  .catch(err => {
    console.error(err)
  });
