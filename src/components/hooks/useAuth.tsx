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
  const [ loadingAuth, setLoadingAuth ] = useState(true);

    // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
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

    login(cached, () =>{
      setLoadingAuth(false);
      console.log('Passport loaded');
    });
  }, []);

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
      refreshLogin({
        ...passport,
        userName: n,
      })
    }
  }

  function setCustomerId(id: string) {
    if (passport) {
      refreshLogin({
        ...passport,
        stripeId: id,
      });
    }
  }

  function setMembership(m: Membership) {
    if (passport) {
      refreshLogin({
        ...passport,
        membership: m,
      });
    }
  }

  function setBaseAccount(a: BaseAccount) {
    if (passport) {
      refreshLogin({
        ...passport,
        ...a,
      })
    }
  }

  return {
    passport,
    loadingAuth,
    login,
    logout,
    refreshLogin,
    setDisplayName,
    setCustomerId,
    setMembership,
    setBaseAccount,
  };
}
