import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { CartItemFtc, CartItemStripe, ShoppingCart } from '../../data/shopping-cart';
import { cartSession } from '../../store/cartSession';

const shoppingCartState = atom<ShoppingCart>({
  key: 'shoppingCartState',
  default: {},
});

export function useShoppingCart() {
  const [ cart, setCart] = useRecoilState(shoppingCartState);
  const [ loadingCart, setLoadingCart ] = useState(true);

  useEffect(() => {
    if (cart.ftc || cart.stripe) {
      setLoadingCart(false);
      return;
    }

    const cached = cartSession.load();

    if (!cached) {
      setLoadingCart(false);
      return;
    }

    setCart(cached);
    setLoadingCart(false);
  }, []);

  const isEmptyCart = (): boolean => {
    return !cart.ftc && !cart.stripe;
  };

  const putFtcItem = (item: CartItemFtc) => {
    const data: ShoppingCart = {
      ftc: item,
      stripe: undefined,
    }
    setCart(data);
    cartSession.save(data);
  }

  const putStripeItem = (item: CartItemStripe) => {
    const data: ShoppingCart = {
      ftc: undefined,
      stripe: item,
    }

    setCart(data);
    cartSession.save(data);
  }

  // Only call clearCart after successful payment.
  // This means you shouldn't use it in useEffect
  // of any component you like.
  // Only cleanup in components showing successful
  // payment results.
  const clearCart = () => {
    cartSession.clear();
    setCart({});
  };

  return {
    cart,
    loadingCart,
    putFtcItem,
    putStripeItem,
    isEmptyCart,
    clearCart,
  }
}
