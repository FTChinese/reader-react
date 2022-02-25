import { isLoginExpired, ReaderPassport } from '../data/account';

const key = 'fta-reader';

export const authSession = {
  save(pp: ReaderPassport) {
    localStorage.setItem(key, JSON.stringify(pp));
  },

  load(): Promise<ReaderPassport | null> {
    const ppStr = localStorage.getItem(key);

    if (!ppStr) {
      return Promise.resolve(null);
    }

    try {
      const pp = JSON.parse(ppStr) as ReaderPassport;
      if (isLoginExpired(pp)) {
        localStorage.removeItem(key);
        return Promise.resolve(null);
      }

      return Promise.resolve(pp);
    } catch (e) {
      localStorage.removeItem(key);
      console.error(e);
      return Promise.resolve(null);
    }
  },

  clear() {
    localStorage.removeItem(key);
  },
}
