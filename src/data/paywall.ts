import { Tier, Cycle, PriceSource, PriceKind, DiscountStatus, OfferKind } from './enum';
import { YearMonthDay } from './period';

export interface Edition {
  tier: Tier;
  cycle: Cycle;
}

export function isEditionEqual(a: Edition, b: Edition): boolean {
  return a.tier === b.tier && a.cycle === b.cycle;
}

/**
 * @description Price determines how much a product cost.
 */
export type Price = {
  id: string;
  tier: Tier;
  cycle?: Cycle;
  active: boolean;
  archived: boolean;
  currency: string;
  kind: PriceKind;
  liveMode: boolean;
  nickname: string | null;
  periodCount: YearMonthDay;
  productId: string;
  stripePriceId: string;
  title?: string;
  unitAmount: number;
  startUtc?: string;
  endUtc?: string;
}

export type Discount = {
  id: string;
  description?: string;
  kind: OfferKind;
  liveMode: boolean;
  overridePeriod: YearMonthDay;
  priceId: string;
  priceOff: number;
  recurring: boolean;
  status: DiscountStatus;
  startUtc?: string; // ISO
  endUtc?: string;
};

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

export type PaywallPrice = Price & {
  offers: Discount[];
};

export type PaywallProduct = Product & {
  prices: PaywallPrice[];
};

/**
 * @ProductGroup aggregates products of the same tier.
 * A product group may contains multiple prices based
 * on subscription renewal cycle.
 */
export interface ProductGroup {
  id: string;
  tier: Tier;
  heading: string;
  description: string | null;
  smallPrint: string | null;
  prices: Price[];
}

export type Banner = {
  id: string;
  heading: string;
  subHeading?: string;
  coverUrl?: string;
  content?: string;
  terms?: string;
};

export type Promo = Banner & {
  startUtc: string;
  endUtc: string;
};

export interface Paywall {
  id: number;
  banner: Banner;
  liveMode: boolean;
  promo: Promo;
  products: PaywallProduct[];
}
