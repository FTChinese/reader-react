import { Order } from '../data/order';

const key = 'otp_sess';

export const aliwxPaySession = {
  save(order: Order) {
    localStorage.setItem(key, JSON.stringify(order));
  },

  load(): Order | null {
    const v = localStorage.getItem(key);
    if (!v) {
      return null;
    }

    return JSON.parse(v) as Order;
  },

  clear() {
    localStorage.removeItem(key);
  }
};
