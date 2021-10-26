/**
 * @description CLIParse parse command line arguments:
 * --a=b --c=d --e=true
 */
export class CLIParser {
  readonly args: Map<string, string> = new Map();

  parse(): CLIParser {
    process.argv
      .slice(2)
      .forEach(arg => {
        const parts = arg.split('=');

        const key = parts[0];
        const value = parts[1] || 'true';

        this.args.set(key, value);
      });

    return this;
  }

  get isProd(): boolean {
    return this.args.has('--prod');
  }

  display() {
    console.log('%o', this.args);
  }
}
