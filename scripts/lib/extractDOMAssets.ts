import { JSDOM } from 'jsdom';
import { basename } from 'path';

/**
 * @description Each element in the array represents all attributes of a tag.
 */
export interface Assets {
  styles: Array<Map<string, string>>;
  scripts: Array<Map<string, string>>;
}

/**
 * @description Collect all the attributes of an Element into a map.
 */
function collectAttributes(elem: Element): Map<string, string> {
  const result: Map<string, string> = new Map();

  if (elem.hasAttributes()) {
    const attrs = elem.attributes;

    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      // It is bothering that vite.js uses absolute path.
      if (['src', 'href'].includes(attr.name)) {
        result.set(attr.name, basename(attr.value))
      } else {
        result.set(attr.name, attr.value);
      }
    }
  }

  return result;
}

/**
 * @description Extract all attributes of all link and script tags.
 */
export async function extractDOMAssets(fileName: string): Promise<Assets> {
  const assets: Assets = {
    styles: [],
    scripts: []
  };

  const dom = await JSDOM.fromFile(fileName);

  const document = dom.window.document;

  document.querySelectorAll('link')
    .forEach(link => {
      // Ignore link tags with href starting with external link and favicon.
      const href = link.getAttribute('href');
      if (!href) {
        return;
      }
      if (href.startsWith('https') || href.startsWith('favicon')) {
        return;
      }

      assets.styles.push(collectAttributes(link));
    });

  document.querySelectorAll('script')
    .forEach(script => {
      assets.scripts.push(collectAttributes(script));
    });

  return assets;
}
