import { resolve } from 'path';

export interface Config {
  projectNameServer: string;
  projectNameClient: string;
  staticPrefix: string; // Used when rendering html template.
  goTemplateSource: string; // Intermediate file for html template.
}

function buildConfig(): Config {

  const clientName = 'b2b';
  const backendName = 'ftacademy';

  return {
    projectNameClient: clientName,
    projectNameServer: backendName,
    staticPrefix: `/static/frontend/${clientName}/`,
    goTemplateSource: resolve(process.cwd(), 'dist/home.html'),
  }
}

export const config = buildConfig();
