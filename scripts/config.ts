import { resolve } from 'path';

export interface Config {
  projectNameServer: string;
  projectNameClient: string;
  staticPrefix: string; // Used when rendering html template.
  goTemplateFile: string; // Intermediate file for html template.
  versionFile: string;
}

function buildConfig(): Config {

  const clientName = 'reader';
  const backendName = 'ftacademy';

  return {
    projectNameClient: clientName,
    projectNameServer: backendName,
    staticPrefix: `/static/frontend/${clientName}`,
    goTemplateFile: resolve(process.cwd(), 'dist/home.html'),
    versionFile: resolve(process.cwd(), 'dist/client_version_reader'),
  }
}

export const config = buildConfig();
