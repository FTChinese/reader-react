import { Tier, Cycle, PriceSource } from './enum';

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
export type Price = Edition & {
  id: string;
  active: boolean;
  currency: string;
  nickname: string | null;
  productId: string;
  source: PriceSource;
  unitAmount: number;
}

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

export interface Paywall {
  products: ProductGroup[];
}
