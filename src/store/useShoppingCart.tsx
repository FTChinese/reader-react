import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { CartItemFtc, CartItemStripe, ShoppingCart } from '../data/shopping-cart';

const key = "ftc_shopping_cart";

const shoppingCartState = atom<ShoppingCart>({
  key: 'shoppingCartState',
  default: {},
});

export function useShoppingCart() {
  const [ cart, setCart] = useRecoilState(shoppingCartState);

  useEffect(() => {
    if (cart.ftc || cart.stripe) {
      return;
    }

    const cached = localStorage.getItem(key);
    if (!cached) {
      return;
    }

    try {
      const data: ShoppingCart = JSON.parse(cached);

      setCart(data);
    } catch (e) {
      localStorage.removeItem(key);
    }
  }, []);

  const putFtcItem = (item: CartItemFtc) => {
    const data: ShoppingCart = {
      ftc: item,
      stripe: undefined,
    }
    setCart(data);
    localStorage.setItem(key, JSON.stringify(data));
  }

  const putStripeItem = (item: CartItemStripe) => {
    const data: ShoppingCart = {
      ftc: undefined,
      stripe: item,
    }

    setCart(data);
    localStorage.setItem(key, JSON.stringify(data));
  }

  const clear = () => {
    setCart({});
    localStorage.removeItem(key);
  }

  return {
    cart,
    setCart,
    putFtcItem,
    putStripeItem,
    clear,
  }
}
