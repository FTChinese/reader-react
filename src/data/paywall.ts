import { Tier } from './enum';
import { applicableOffer, applicableOfferKinds, ftcRegularCharge, ftcRegularPriceParts, FtcShelfItem, PaywallPrice, Price } from './ftc-price';
import { formatMoney, formatMoneyParts, localizeCycle, PriceParts } from './localization';
import { isMembershipZero, Membership } from './membership';
import { cycleOfYMD, formatPeriods, isValidPeriod, isZeroYMD, OptionalPeriod, totalDaysOfYMD } from './period';
import { stripeRecurringCharge, stripeRecurringPriceParts, StripeShelfItem } from './stripe-price';

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

/**
 * @description Create a new instance of FtcShelfItem
 * for introductory price only.
 */
function getIntroItem(pp: PaywallProduct, m: Membership): FtcShelfItem | undefined {
  if (!pp.introductory) {
    return undefined;
  }

  if (!isValidPeriod(pp.introductory)) {
    return undefined;
  }

  if (isMembershipZero(m)) {
    return undefined;
  }

  return {
    price: pp.introductory,
    discount: undefined,
    isIntro: true,
  };
}

export function ftcShelfItems(pp: PaywallProduct, m: Membership): FtcShelfItem[] {
  const intro = getIntroItem(pp, m);

  const recurrings = pp.prices.map<FtcShelfItem>(price => {
    return {
      price: price,
      discount: applicableOffer(
        price,
        applicableOfferKinds(m),
      ),
      isIntro: false,
    }
  });

  return intro
    ? [intro].concat(recurrings)
    : recurrings;
}

type StripePriceIDs = {
  recurrings: string[];
  trial?: string;
}

export function collectStripePriceIDs(pp: PaywallProduct): StripePriceIDs {

  return {
    recurrings: pp.prices.map(p => p.stripePriceId),
    trial: pp.introductory ? pp.introductory.stripePriceId : undefined,
  };
}

export type ShelfItemParams = {
  header?: string;
  title: string;
  payable: PriceParts;
  crossed?: string;
  offerDesc?: string;
};

export function ftcShelfItemParams(item: FtcShelfItem): ShelfItemParams {
  if (item.discount) {
    const period = isZeroYMD(item.discount.overridePeriod)
      ? item.price.periodCount
      : item.discount.overridePeriod;

    return {
      title: item.discount.description || '',
      payable: {
        ...formatMoneyParts(
          item.price.currency,
          item.price.unitAmount - item.discount.priceOff,
        ),
        cycle: '/' + formatPeriods(period, false)
      },
      crossed: ftcRegularCharge(item.price),
      offerDesc: undefined,
    };
  }

  return {
    title: item.price.title || '',
    payable: ftcRegularPriceParts(item.price),
    crossed: undefined,
    offerDesc: undefined,
  };
}

export function stripeShelfItemParams(item: StripeShelfItem): ShelfItemParams {
  const header = `连续包${localizeCycle(cycleOfYMD(item.recurring.periodCount))}*`;

  if (item.trial) {
    return {
      header,
      title: '新会员首次试用',
      payable: {
        ...formatMoneyParts(
          item.trial.currency,
          item.trial.unitAmount / 100,
        ),
        cycle: '/' + formatPeriods(
          item.trial.periodCount,
          false
        ),
      },
      crossed: '',
      offerDesc: `试用结束后自动续订${stripeRecurringCharge(item.recurring)}`
    };
  }

  return {
    header,
    title: '',
    payable: stripeRecurringPriceParts(item.recurring),
    crossed: undefined,
    offerDesc: undefined,
  };
}

enum SubsKind {
  // VIP;
  // iOS -> Stripe
  Forbidden,
  // One-time purchase:
  // * new membership;
  // Auto-renewal:
  // * One-time purchase -> auto renewal
  // * new membership
  Create,
  // For membership of the same tier.
  Renew,
  // From standard to premium
  Upgrade,
  // One time purchase:
  // * Premium -> standard
  // Auto-renewal:
  // * Standard -> standard
  // * Premium -> standard
  // * Premium -> premium
  AddOn,
  // For auto-renewal mode, a user could switch
  // from monthly billing interval to year, or vice versus.
  SwitchInterval,
}

type OrderIntent = {
  kind: SubsKind;
  message: string;
}
