import { ShoppingCart } from '../data/shopping-cart';

const key = 'cart_sess';

export const cartSession = {
  save(cart: ShoppingCart) {
    localStorage.setItem(key, JSON.stringify(cart));
  },

  load(): ShoppingCart | null {
    const v = localStorage.getItem(key);
    if (!v) {
      return null;
    }

    try {
      return JSON.parse(v) as ShoppingCart;
    } catch (e) {
      console.log(e);
      localStorage.removeItem(key);
      return null
    }
  },

  clear() {
    localStorage.removeItem(key);
    console.log('Shopping cart cleared');
  },
};
