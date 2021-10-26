import { resolve as resolvePath } from 'path';
import { configure, render } from 'nunjucks';

configure(
  [resolvePath(process.cwd(), 'bin/template')],
  {
    autoescape: false,
    noCache: true,
    watch: false,
  }
);

export default function promisifiedRender(name: string, context?: object): Promise<string> {
  return new Promise((resolve, reject) => {
    render(name, context, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      if (res == null) {
        reject('no rendered result');
        return;
      }

      resolve(res);
    });
  });
}
