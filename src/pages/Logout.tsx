import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { logoutState } from '../components/hooks/recoilState';
import { useAuth } from '../components/hooks/useAuth';
import { usePaymentSetting } from '../components/hooks/usePaymentSetting';
import { useShoppingCart } from '../components/hooks/useShoppingCart';

export function Logout() {
  const shouldLogout = useRecoilValue(logoutState);

  const { clearAuth: setLoggedOut } = useAuth();
  const { clearCart } = useShoppingCart();
  const { clearPaymentSetting } = usePaymentSetting();

  useEffect(() => {
    if (!shouldLogout) {
      return;
    }

    setLoggedOut();
    clearCart();
    clearPaymentSetting();

  }, [shouldLogout]);

  return null;
}
