import { useState } from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { BaseAccount, isTestAccount, ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { authSession } from '../../store/authSession';

const passportState = atom<ReaderPassport | undefined>({
  key: 'authState',
  default: undefined,
});

const liveAccountState = selector<boolean>({
  key: 'liveAccountState',
  get: ({ get }) => {
    return !isTestAccount(get(passportState));
  }
})

export function useAuth() {

  const [passport, setPassport] = useRecoilState(passportState);
  // Indicating whether data is being fetched
  // from localStorage.
  const [loadingAuth, setLoadingAuth] = useState(false);
  const liveAccount = useRecoilValue(liveAccountState);


  // useEffect(() => {
  //   if (passport) {
  //     setLoadingAuth(false);
  //     return;
  //   }

  //   setLoadingAuth(true);
  //   const cached = authSession.load();

  //   if (!cached) {
  //     setLoadingAuth(false);
  //     return;
  //   }

  //   login(cached, () =>{
  //     setLoadingAuth(false);
  //     console.log('Passport loaded');
  //   });
  // }, []);

  // Use this upon page initial loading
  const loadAccount = () => {
    if (passport) {
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

  function login(pp: ReaderPassport, callback: VoidFunction) {
    setPassport(pp);
    authSession.save(pp);
    callback();
  }

  const setLoggedIn = (pp: ReaderPassport, callback: VoidFunction) => {
    setPassport(pp);
    authSession.save(pp);
    callback();
  };

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
    liveAccount,
    loadAccount,
    setLoggedIn,
    logout,
    refreshLogin,
    setDisplayName,
    setCustomerId,
    setMembership,
    setBaseAccount,
  };
}
