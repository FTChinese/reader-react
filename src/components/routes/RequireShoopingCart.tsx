import { useEffect } from 'react';
import { useShoppingCart } from '../hooks/useShoppingCart';
import { Loading } from '../progress/Loading';

export function RequireShoppingCart(
  props: {
    children: JSX.Element;
  }
) {
  const { isEmptyCart, loadingCart } = useShoppingCart();

  useEffect(() => {
    if (!isEmptyCart()) {
      return;
    }

    if (loadingCart) {
      return;
    }
  }, [loadingCart]);

  return (
    <Loading loading={loadingCart}>
      {props.children}
    </Loading>
  );
}
