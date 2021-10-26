// Test if an attribute is a link.
function isLink(name: string): boolean {
  return ['href', 'src'].includes(name);
}

/**
 * @description HTMLTag is used to build a string of HTML element.
 */
export class HTMLTagBuilder {
  private selfClosing = false;
  private attrs: Map<string, string> = new Map();
  private pathPrefix: string = '';

  constructor(readonly name: string) {}

  // Determine whether the  tag is self closing.
  withSelfClosing(): HTMLTagBuilder {
    this.selfClosing = true;
    return this;
  }

  withPathPrefix(prefix: string): HTMLTagBuilder {
    this.pathPrefix = prefix;
    return this;
  }

  withAttributes(attrs: Map<string, string>): HTMLTagBuilder {
    this.attrs = attrs;
    return this;
  }

  private buildAttributes(): string {
    return Array.from(this.attrs.entries())
      .map(([name, value]) => {
        // Turn each key-value pair to `key="value"`
        // or key if value if empty.
        if (isLink(name) && !value.startsWith('http') && this.pathPrefix) {
          value = this.pathPrefix + value;
        }

        return value ? `${name}="${value}"` : name;
      })
      .join(' ');
  }

  render(): string {
    let str = `<${this.name}`;
    if (this.attrs.size > 0) {
      str += ' ';
      str += this.buildAttributes();
    }
    if (this.selfClosing) {
      str += '>';
      return str;
    }

    str += `></${this.name}>`;

    return str;
  }
}
