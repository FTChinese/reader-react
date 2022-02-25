import { atom, useRecoilState } from 'recoil';
import { BaseAccount, isLoginExpired, ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { authSession } from '../../store/authSession';

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
  setBaseAccount: (a: BaseAccount) => void;
}

export function useAuth(): AuthState {

  const [passport, setPassport] = useRecoilState(passportState);

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

  // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  // useEffect(() => {
  //   load();
  //   console.log('Passport loaded');
  //   // return function cleanup() {};
  // }, [passport?.expiresAt, passport?.token]);

  return {
    passport,
    login,
    logout,
    refreshLogin,
    setDisplayName,
    setCustomerId,
    setMembership,
    setBaseAccount,
  };
}
