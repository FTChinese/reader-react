import { useEffect } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { isLoginExpired, ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { authSession } from '../../store/authSession';
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
        authSession.clear();
        setLogout(true);
      }
      return;
    }

    const pp = authSession.load();

    if (!pp) {
      return;
    }

    if (isLoginExpired(pp)) {
      authSession.clear();
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

      localStorage.setItem(accountKey, JSON.stringify(newPassport));
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
