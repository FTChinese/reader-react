import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { isLoginExpired, ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { authSession } from '../../store/authSession';

const accountKey = 'fta-reader';

const passportState = atom<ReaderPassport | undefined>({
  key: 'authState',
  default: undefined,
});

interface AuthState {
  passport?: ReaderPassport;
  login: (pp: ReaderPassport, cb: VoidFunction) => void;
  logout: (cb: VoidFunction) => void;
  refreshLogin: (pp: ReaderPassport) => void;
  setDisplayName: (n: string) => void;
  setCustomerId: (id: string) => void;
  setMembership: (m: Membership) => void;
}

export function useAuth(): AuthState {

  const [passport, setPassport] = useRecoilState(passportState);

  function load() {
    if (passport) {
      if (isLoginExpired(passport)) {
        authSession.clear();
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

  function login(pp: ReaderPassport, callback: VoidFunction) {
    setPassport(pp);
    authSession.save(pp);
    callback();
  }

  function refreshLogin(pp: ReaderPassport) {
    setPassport(pp);
    authSession.save(pp);
  }

  function logout(callback: VoidFunction) {
    authSession.clear();
    setPassport(undefined);
    callback();
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

  // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
    load();
    // return function cleanup() {};
  }, [passport?.expiresAt, passport?.token]);

  return {
    passport,
    login,
    logout,
    refreshLogin,
    setDisplayName,
    setCustomerId,
    setMembership,
  };
}
