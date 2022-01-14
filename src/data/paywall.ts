import { Tier } from './enum';
import { PaywallPrice, Price } from './price';
import { formatMoney } from './localization';
import { cycleOfYMD, isValidPeriod, OptionalPeriod, totalDaysOfYMD } from './period';

type DailyPrice = {
  holder: string;
  replacer: string;
}

export function dailyPrice(price: Price): DailyPrice {
  const days = totalDaysOfYMD(price.periodCount) || 1;

  const avg = price.unitAmount / days;

  const dailyAmount = formatMoney(price.currency, avg);

  switch (cycleOfYMD(price.periodCount)) {
    case 'year':
      return {
        holder: '{{dailyAverageOfYear}}',
        replacer: dailyAmount,
      };

    case 'month':
      return {
        holder: '{{dailyAverageOfMonth}}',
        replacer: dailyAmount,
      };
  }
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

export interface Paywall {
  id: number;
  banner: Banner;
  liveMode: boolean;
  promo: Promo;
  products: PaywallProduct[];
}

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

/**
 * @description PaywallProduct contains the human-readable text of a product, and a list of prices attached to it.
 */
export type PaywallProduct = Product & {
  prices: PaywallPrice[];
};

export function productDesc(product: PaywallProduct): string[] {
  if (!product.description) {
    return [];
  }

  let desc = product.description;

  product.prices
    .map(price => dailyPrice(price))
    .forEach(dp => desc = desc.replace(dp.holder, dp.replacer));

  return desc.split('\n');
}



