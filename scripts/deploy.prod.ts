
import { resolve } from 'path';
import { Config } from './lib/config';
import { deploy } from './lib/deploy';
import { homedir } from 'node:os';

export function buildConfig(props: {
  clientName: string;
  backendName: string;
  prod: boolean;
}): Config {

  // ~/GolandProjects/superyard
  // ~/GolandProjects/ftacademy
  const deployRootDir = resolve(
    homedir(),
    'GolandProjects',
    props.backendName,
  );

  // ~/GolandProjects/ftacademy/web/template/reader/home.html
  const deployHtmlDir = resolve(
    deployRootDir,
    'web/template',
    props.clientName
  );

  const deployAssetDir = props.prod
    // To server.
    // ~/svn-online/ftac/frontend/reader
  ? resolve(
      homedir(),
      'svn-online/ftac/frontend',
      props.clientName,
    )
  // To dev folder
  : resolve(
      deployRootDir,
      'build/public/static/frontend',
      props.clientName
    );

  return {
    sourceHtmlFile: resolve(process.cwd(), 'dist/index.html'),
    sourceJsFile: `dist/assets/*.js`,
    sourceCssFile: `dist/assets/*.css`,

    deployRootDir,
    deployHtmlDir,
    deployAssetDir,

    staticPrefix: `/static/frontend/${props.clientName}`,
    packageDir: process.cwd(),

    targetHtmlFile: resolve(process.cwd(), 'dist/home.html'),
    targetVersionFile: resolve(process.cwd(), `dist/client_version_${props.clientName}`),
  }
}

deploy(buildConfig({
  clientName: 'reader',
  backendName: 'ftacademy',
  prod: true,
}))
  .catch(err => {
    console.error(err)
  });
