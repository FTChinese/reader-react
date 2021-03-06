import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';
import { useStripePaySetting } from '../hooks/useStripePaySetting';
import { useShoppingCart } from '../hooks/useShoppingCart';

export function Logout() {

  const navigate = useNavigate();
  const { logout, passport } = useAuth();
  const { clearCart } = useShoppingCart();
  const { clearPaymentSetting } = useStripePaySetting();

  const handleLogout = () => {
    logout(() => {
      clearCart();
      clearPaymentSetting();
      navigate(sitemap.login);
    });
  };

  if (!passport) {
    return null;
  }

  return (
    <Button
      variant="link"
      onClick={handleLogout}
    >
      退出
    </Button>
  );
}
