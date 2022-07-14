import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { BaseAccount, ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { authSession } from '../../store/authSession';

const passportState = atom<ReaderPassport | undefined>({
  key: 'authState',
  default: undefined,
});

export function useAuth() {

  const [passport, setPassport] = useRecoilState(passportState);
  // Indicating whether data is being fetched
  // from localStorage.
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  // Use this upon page initial loading
  const loadAccount = () => {
    if (passport) {
      setLoadingAuth(false);
      return;
    }

    setLoadingAuth(true);

    const cached = authSession.load();

    if (!cached) {
      setLoadingAuth(false);
      return;
    }

    setLoggedIn(cached, () =>{
      setLoadingAuth(false);
      console.log('Passport loaded');
    });
  }

  const setLoggedIn = (pp: ReaderPassport, callback: VoidFunction) => {
    setPassport(pp);
    authSession.save(pp);
    callback();
  };

  const refreshLogin = (pp: ReaderPassport) => {
    setPassport(pp);
    authSession.save(pp);
  }

  const logout = (callback: VoidFunction) => {
    authSession.clear();
    setPassport(undefined);
    callback();
  }

  const setDisplayName = (n: string) => {
    if (passport) {
      refreshLogin({
        ...passport,
        userName: n,
      });
    }
  }

  const setCustomerId = (id: string) => {
    if (passport) {
      refreshLogin({
        ...passport,
        stripeId: id,
      });
    }
  }

  const setMembership = (m: Membership) => {
    if (passport) {
      refreshLogin({
        ...passport,
        membership: m,
      });
    }
  }

  const setBaseAccount = (a: BaseAccount) => {
    if (passport) {
      refreshLogin({
        ...passport,
        ...a,
      });
    }
  }

  return {
    passport,
    loadingAuth,
    setLoggedIn,
    logout,
    refreshLogin,
    setDisplayName,
    setCustomerId,
    setMembership,
    setBaseAccount,
  };
}
