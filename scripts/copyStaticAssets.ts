import { homedir } from 'os';
import { resolve } from 'path';
import * as shell from 'shelljs';
import { config } from './config';
import { CLIParser } from './lib/CLIParser';

const golandDir = `GolandProjects`;

const cli = (new CLIParser()).parse();

const htmlOutDir = resolve(
  homedir(),
  golandDir,
  config.projectNameServer,
  'web/template/reader'
);

const jsCssOutDir = cli.isProd
  // To server.
  ? resolve(
      homedir(),
      'svn-online/ftac/frontend/',
      config.projectNameClient
    )
  // To dev folder
  : resolve(
      homedir(),
      'GolangProjects',
      config.projectNameServer,
      'build/public/static/frontend',
      config.projectNameClient
    );

console.log(`Copy frontend assets to ${jsCssOutDir}`);

shell.mkdir('-p', htmlOutDir);
shell.mkdir('-p', jsCssOutDir);

shell.cp(`dist/assets/*.js`, jsCssOutDir);
shell.cp(`dist/assets/*.css`, jsCssOutDir);

console.log(`Copy go templates to ${htmlOutDir}`);

shell.cp(config.goTemplateSource, htmlOutDir);


