import { ReaderPassport } from '../data/account';

const key = 'fta-reader';

export const authSession = {
  save(pp: ReaderPassport) {
    localStorage.setItem(key, JSON.stringify(pp));
  },

  load(): ReaderPassport | null {
    const ppStr = localStorage.getItem(key);

    if (!ppStr) {
      return null;
    }

    try {
      return JSON.parse(ppStr) as ReaderPassport;
    } catch (e) {
      localStorage.removeItem(key);
      console.error(e);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(key);
  },
}
