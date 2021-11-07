import { useContext } from 'react';
import { useEffect } from 'react';
import { createContext, useState } from 'react';
import { isLoginExpired, ReaderPassport } from '../data/account';
import { storeKeyAccount } from './keys';

interface AuthState {
  passport?: ReaderPassport;
  setLoggedIn: (p: ReaderPassport) => void;
  setLoggedOut: () => void;
  setDisplayName: (n: string) => void
}

const AuthContext = createContext<AuthState>({
  passport: undefined,
  setLoggedIn: (p: ReaderPassport) => {},
  setLoggedOut: () => {},
  setDisplayName: (n: string) => {},
});

export function AuthProvider(props: {children: JSX.Element}) {

  const [passport, setPassport] = useState<ReaderPassport>();

  function load() {
    if (passport) {
      if (isLoginExpired(passport)) {
        localStorage.removeItem(storeKeyAccount);
        setPassport(undefined);
      }
      return;
    }

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

  const ctxValue: AuthState = {
    passport,
    setLoggedIn: (p: ReaderPassport) => {
      localStorage.setItem(storeKeyAccount, JSON.stringify(p));
      setPassport(p);
    },
    setLoggedOut: () => {
      localStorage.removeItem(storeKeyAccount);
      setPassport(undefined);
    },
    setDisplayName: (n: string) => {
      if (passport) {
        const newPassport: ReaderPassport = {
          ...passport,
          userName: n,
        };
        localStorage.setItem(storeKeyAccount, JSON.stringify(newPassport));
        setPassport(newPassport);
      }
    }
  };

  return <AuthContext.Provider value={ctxValue}>
    {props.children}
  </AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
