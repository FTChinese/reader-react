import { isLoginExpired, ReaderPassport } from '../data/account';

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
      const pp = JSON.parse(ppStr) as ReaderPassport;
      if (isLoginExpired(pp)) {
        localStorage.removeItem(key);
        return null;
      }

      return pp;
    } catch (e) {
      console.error(e);
      localStorage.removeItem(key);

      return null;
    }
  },

  clear() {
    localStorage.removeItem(key);
  },
}
