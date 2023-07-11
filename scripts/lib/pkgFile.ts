import { readFile } from 'fs/promises';
import { resolve } from 'path';

interface PkgFile {
  name: string;
  version: string;
  devDependencies: {
    bootstrap: string;
  };
}

/**
 * Read package.json file relative to parentDir.
 */
export async function readPkgFile(parentDir: string): Promise<PkgFile> {
  const pkgStr = await readFile(
    resolve(parentDir, 'package.json'),
    { encoding: 'utf8'}
  );

  return JSON.parse(pkgStr);
}
