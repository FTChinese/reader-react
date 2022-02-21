import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { isLoginExpired, ReaderPassport } from '../data/account';

const storeKeyAccount = 'fta-reader';

const passportState = atom<ReaderPassport | undefined>({
  key: 'authState',
  default: undefined,
});

interface AuthState {
  passport?: ReaderPassport;
  setLoggedIn: (p: ReaderPassport) => void;
  setLoggedOut: () => void;
  setDisplayName: (n: string) => void;
  setCustomerId: (id: string) => void;
}

export function useAuth(): AuthState {

  const [passport, setPassport] = useRecoilState(passportState);

  async function load() {
    if (passport) {
      if (isLoginExpired(passport)) {
        localStorage.removeItem(storeKeyAccount);
        setPassport(undefined);
      }
      return;
    }

    console.log('Loading passport...');
    const ppStr = localStorage.getItem(storeKeyAccount);

    if (!ppStr) {
      return;
    }

    try {
      const pp: ReaderPassport = JSON.parse(ppStr);
      if (isLoginExpired(pp)) {
        localStorage.removeItem(storeKeyAccount);
      }

      setPassport(JSON.parse(ppStr));
      console.log('Passport loaded');
    } catch (e) {
      localStorage.removeItem(storeKeyAccount);
    }
  }

  // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
    load();
    // return function cleanup() {};
  }, [passport?.expiresAt, passport?.token]);

  function setLoggedIn(p: ReaderPassport) {
    localStorage.setItem(storeKeyAccount, JSON.stringify(p));
    setPassport(p);
  }

  function setLoggedOut() {
    localStorage.removeItem(storeKeyAccount);
    setPassport(undefined);
  }

  function setDisplayName(n: string) {
    if (passport) {
      const newPassport: ReaderPassport = {
        ...passport,
        userName: n,
      };
      localStorage.setItem(storeKeyAccount, JSON.stringify(newPassport));
      setPassport(newPassport);
    }
  }

  function setCustomerId(id: string) {
    if (passport) {
      const newPassport: ReaderPassport = {
        ...passport,
        stripeId: id,
      };
      localStorage.setItem(storeKeyAccount, JSON.stringify(newPassport));
      setPassport(newPassport);
    }
  }

  return {
    passport,
    setLoggedIn,
    setLoggedOut,
    setDisplayName,
    setCustomerId,
  };
}
