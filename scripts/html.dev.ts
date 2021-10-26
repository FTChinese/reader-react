import { promises } from 'fs';
import render from './lib/render';
import { defaultIcon, Icon } from './lib/icon';
import { buildFooter, Footer } from './lib/footer';
import { readPkgFile } from './lib/readPkgFile';

const { writeFile } = promises;

interface CtxIndex {
  icon: Icon;
  bootstrapVersion: string;
  footer: Footer;
}

async function renderIndex(): Promise<string> {
  const pkg = await readPkgFile();

  const ctx: CtxIndex = {
    icon: defaultIcon,
    bootstrapVersion: pkg.devDependencies.bootstrap.replace('^', ''),
    footer: buildFooter(pkg.version),
  };

  return await render('index.html', ctx);
}

renderIndex()
  .then(content => {
    return writeFile(
      'index.html',
      content,
      { encoding: 'utf8'}
    );
  })
  .then(() => {
    console.log('Done');
  })
  .catch(err => {
    console.log(err);
  });

