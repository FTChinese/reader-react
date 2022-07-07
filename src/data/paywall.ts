import { isValidPeriod, OptionalPeriod } from './period';
import { StripePaywallItem } from './stripe';
import { Tier } from './enum';
import { Discount, Price } from './price';

export type Banner = {
  id: string;
  heading: string;
  subHeading?: string;
  coverUrl?: string;
  content?: string;
  terms?: string;
};

export type Promo = Banner & OptionalPeriod;

export function isPromoValid(promo: Promo): Boolean {
  if (!promo.id) {
    return false
  }

  return isValidPeriod(promo);
}

export type Product = {
  id: string;
  active: boolean;
  description: string;
  heading: string;
  introductory?: Price;
  liveMode: boolean;
  smallPrint?: string;
  tier: Tier;
};

/**
 * @description PaywallPrice contains a price and a list of
 * opitonal discounts.
 */
 export type PaywallPrice = Price & {
  offers: Discount[];
};

/**
 * @description PaywallProduct contains the human-readable text of a product, and a list of prices attached to it.
 */
 export type PaywallProduct = Product & {
  prices: PaywallPrice[];
};

export interface Paywall {
  id: number;
  banner: Banner;
  liveMode: boolean;
  promo: Promo;
  products: PaywallProduct[];
  stripe: StripePaywallItem[];
}







