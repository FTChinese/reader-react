import { useEffect } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { isLoginExpired, ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { logoutState } from './recoilState';

const accountKey = 'fta-reader';

const passportState = atom<ReaderPassport | undefined>({
  key: 'authState',
  default: undefined,
});

interface AuthState {
  passport?: ReaderPassport;
  setLoggedIn: (p: ReaderPassport) => void;
  clearAuth: () => void;
  setDisplayName: (n: string) => void;
  setCustomerId: (id: string) => void;
  setMembership: (m: Membership) => void;
}

export function useAuth(): AuthState {

  const setLogout = useSetRecoilState(logoutState);
  const [passport, setPassport] = useRecoilState(passportState);

  function load() {
    if (passport) {
      if (isLoginExpired(passport)) {
        setLogout(true);
      }
      return;
    }

    const ppStr = localStorage.getItem(accountKey);

    if (!ppStr) {
      return;
    }

    try {
      const pp: ReaderPassport = JSON.parse(ppStr);
      if (isLoginExpired(pp)) {
        localStorage.removeItem(accountKey);
      }

      setPassport(JSON.parse(ppStr));
      console.log('Passport loaded');
    } catch (e) {
      localStorage.removeItem(accountKey);
    }
  }

  function setLoggedIn(p: ReaderPassport) {
    localStorage.setItem(accountKey, JSON.stringify(p));
    setPassport(p);
  }

  function setDisplayName(n: string) {
    if (passport) {
      const newPassport: ReaderPassport = {
        ...passport,
        userName: n,
      };
      localStorage.setItem(accountKey, JSON.stringify(newPassport));
      setPassport(newPassport);
    }
  }

  function setCustomerId(id: string) {
    if (passport) {
      const newPassport: ReaderPassport = {
        ...passport,
        stripeId: id,
      };
      localStorage.setItem(accountKey, JSON.stringify(newPassport));
      setPassport(newPassport);
    }
  }

  function setMembership(m: Membership) {
    if (passport) {
      const newPassport: ReaderPassport = {
        ...passport,
        membership: m,
      };

      localStorage.setItems(accountKey, JSON.stringify(newPassport));
      setPassport(newPassport);
    }
  }

  function clearAuth() {
    localStorage.removeItem(accountKey);
    setPassport(undefined);
  }

  // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
    load();
    // return function cleanup() {};
  }, [passport?.expiresAt, passport?.token]);

  return {
    passport,
    setLoggedIn,
    clearAuth,
    setDisplayName,
    setCustomerId,
    setMembership,
  };
}
