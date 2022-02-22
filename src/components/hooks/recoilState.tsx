import { atom } from 'recoil';
import { StripePrice } from '../../data/price';

export const stripePricesState = atom<Map<string, StripePrice>>({
  key: 'stripePricesState',
  default: new Map(),
});

export const logoutState = atom<boolean>({
  key: 'logoutState',
  default: false,
});

