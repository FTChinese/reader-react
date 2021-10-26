import { readFile } from "fs/promises";
import { resolve } from 'path';

interface PkgFile {
  name: string;
  version: string;
  dependencies: {

  };
  devDependencies: {
    bootstrap: string;
  };
}

export async function readPkgFile(): Promise<PkgFile> {
  const pkgStr = await readFile(
    resolve(process.cwd(), 'package.json'),
    { encoding: 'utf8'}
  );

  return JSON.parse(pkgStr);
}
