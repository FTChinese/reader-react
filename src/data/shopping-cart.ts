import {
  Price,
  Discount,
  StripePrice,
  isIntro,
} from './price';
import { formatMoneyParts, localizeCycle, PriceParts } from './localization';
import { Membership, applicableOfferKinds } from './membership';
import { applicableOffer, PaywallPrice, PaywallProduct } from './paywall';
import { cycleOfYMD, formatPeriods, isValidPeriod, isZeroYMD } from './period';
import { CheckoutIntent, IntentKind, newOneTimeOrderIntent, newStripeOrderIntent } from './chekout-intent';

type StripePriceIDs = {
  recurrings: string[];
  trial?: string;
}

type StripePriceGroup = {
  recurring: StripePrice;
  trial?: StripePrice;
}

type ProductPrices = {
  ftcPrices: PaywallPrice[];
  stripeIds: StripePriceIDs;
}
/**
 * @description Collect all ftc prices applicable to
 * current user, together with stripe ids associated with
 * each price
 */
 export function collectPaywallPrices(pp: PaywallProduct, isNewMember: boolean): ProductPrices {

  const stripeRecurIds = pp.prices.map(p => p.stripePriceId);

  if (!pp.introductory || !isValidPeriod(pp.introductory) || !isNewMember) {
    return {
      ftcPrices: pp.prices,
      stripeIds: {
        recurrings: stripeRecurIds,
      },
    };
  }

  const intro: PaywallPrice = {
    ...pp.introductory,
    offers: [],
  };

  return {
    ftcPrices: [intro, ...pp.prices], // Put introductory price ahead of daily price.
    stripeIds: {
      recurrings: stripeRecurIds,
      trial: pp.introductory.stripePriceId,
    }
  }
}

export function collectStripePrices(ids: StripePriceIDs, prices: Map<string, StripePrice>): StripePriceGroup[] {
  if (prices.size == 0) {
    return [];
  }

  const trial = ids.trial
    ? prices.get(ids.trial)
    : undefined

  const items: StripePriceGroup[] = [];

  for (const id of ids.recurrings) {
    const p = prices.get(id);
    if (p) {
      items.push({
        recurring: p,
        trial,
      });
    } else {
      console.error('Stripe price %s missing', id)
    }
  }

  return items;
}

/**
 * @description FtcCartItem represents the item
 * user want to buy.
 */
export type CartItemFtc = {
  intent: CheckoutIntent;
  price: Price;
  discount?: Discount;
  isIntro: boolean;
};

export function newCartItemFtc(p: PaywallPrice, m: Membership): CartItemFtc {
  if (isIntro(p)) {
    return {
      intent: {
        kind: IntentKind.Create,
        message: ''
      },
      price: p,
      discount: undefined,
      isIntro: true,
    };
  }

  return {
    intent: newOneTimeOrderIntent(
      m,
      p,
    ),
    price: p,
    discount: applicableOffer(
      p,
      applicableOfferKinds(m),
    ),
    isIntro: false,
  };
}

export type OrderParams = {
  priceId: string;
  discountId?: string;
};

export function newOrderParams(item: CartItemFtc): OrderParams {
  return {
    priceId: item.price.id,
    discountId: item.discount?.id,
  };
}

export type CartItemStripe = {
  intent: CheckoutIntent;
  recurring: StripePrice;
  trial?: StripePrice;
}

export function newCarItemStripe(pg: StripePriceGroup, m: Membership): CartItemStripe {
  return {
    intent: newStripeOrderIntent(m, pg.recurring),
    ...pg,
  };
}

export type SubsParams = {
  priceId: string;
  introductoryPriceId?: string;
  defaultPaymentMethod?: string;
};

export type ShoppingCart = {
  ftc?: CartItemFtc;
  stripe?: CartItemStripe;
};

/**
 * @description describes the UI of an item to buy.
 */
export type CartItemUIParams = {
  header: string;
  title: string;
  payable: PriceParts;
  original?: PriceParts;
  isAutoRenew: boolean
};

export function newFtcCartItemUIParams(item: CartItemFtc): CartItemUIParams {

  const header = isIntro(item.price)
    ? '试用'
    : `包${localizeCycle(cycleOfYMD(item.price.periodCount))}`;

  if (item.discount) {
    const period = isZeroYMD(item.discount.overridePeriod)
      ? item.price.periodCount
      : item.discount.overridePeriod;

    return {
      header,
      title: item.discount.description || '新会员首次试用',
      payable: {
        ...formatMoneyParts(
          item.price.currency,
          item.price.unitAmount - item.discount.priceOff,
        ),
        cycle: '/' + formatPeriods(period, false),
      },
      original: {
        ...formatMoneyParts(item.price.currency, item.price.unitAmount),
        cycle: '/' + formatPeriods(item.price.periodCount, false),
      },
      isAutoRenew: false,
    };
  }

  return {
    header,
    title: item.price.title || '',
    payable: {
      ...formatMoneyParts(item.price.currency, item.price.unitAmount),
      cycle: '/' + formatPeriods(item.price.periodCount, false),
    },
    isAutoRenew: false,
  };
}

export function newStripeCartItemParams(item: CartItemStripe): CartItemUIParams {

  const header = `连续包${localizeCycle(cycleOfYMD(item.recurring.periodCount))}`;

  const recurPriceParts: PriceParts = {
    ...formatMoneyParts(
      item.recurring.currency,
      item.recurring.unitAmount / 100,
    ),
    cycle: '/' + formatPeriods(item.recurring.periodCount, true),
  };

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
      original: recurPriceParts,
      isAutoRenew: true,
    };
  }

  return {
    header,
    title: '',
    payable: recurPriceParts,
    original: undefined,
    isAutoRenew: true,
  };
}




