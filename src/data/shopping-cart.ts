import {
  Price,
  Discount,
  applicableOffer,
  applicableOfferKinds,
  ftcRegularPriceParts,
  ftcRegularCharge,
  StripePrice,
  stripeRecurringCharge,
  stripeRecurringPriceParts,
  isIntro
} from './price';
import { formatMoneyParts, localizeCycle, PriceParts } from './localization';
import { Membership, isMembershipZero } from './membership';
import { PaywallProduct } from './paywall';
import { cycleOfYMD, formatPeriods, isValidPeriod, isZeroYMD } from './period';
import { CheckoutIntent, IntentKind, newOneTimeOrderIntent, newStripeOrderIntent } from './chekout-intent';

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

/**
 * @description Create a new instance of FtcShelfItem
 * for introductory price only.
 */
 function getFtcIntroItem(pp: PaywallProduct, m: Membership): CartItemFtc | undefined {
  if (!pp.introductory) {
    return undefined;
  }

  if (!isValidPeriod(pp.introductory)) {
    return undefined;
  }

  if (!isMembershipZero(m)) {
    return undefined;
  }

  return {
    intent: {
      kind: IntentKind.Create,
      message: ''
    },
    price: pp.introductory,
    discount: undefined,
    isIntro: true,
  };
}

export function buildFtcCartItems(product: PaywallProduct, m: Membership): CartItemFtc[] {
  const intro = getFtcIntroItem(product, m);

  const recurrings = product.prices.map<CartItemFtc>(price => {
    return {
      intent: newOneTimeOrderIntent(
        m,
        price,
      ),
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

type StripePriceIDs = {
  recurrings: string[];
  trial?: string;
}

function gatherStripePriceIDs(pp: PaywallProduct): StripePriceIDs {

  return {
    recurrings: pp.prices.map(p => p.stripePriceId),
    trial: pp.introductory ? pp.introductory.stripePriceId : undefined,
  };
}

export type CartItemStripe = {
  intent: CheckoutIntent;
  recurring: StripePrice;
  trial?: StripePrice;
}

export function buildStripeCartItems({
  product,
  m,
  prices,
}:{
  product: PaywallProduct;
  m: Membership;
  prices: Map<string, StripePrice>;
}): CartItemStripe[] {
  const ids = gatherStripePriceIDs(product);

  const trial = ids.trial
    ? prices.get(ids.trial)
    : undefined;

  const items: CartItemStripe[] = [];

  for (const id of ids.recurrings) {
    const p = prices.get(id);
    if (p) {
      items.push({
        intent: newStripeOrderIntent(m, p),
        recurring: p,
        trial,
      });
    } else {
      console.error('Stripe price %s missing', id)
    }
  }

  return items;
}

export type SubsParams = {
  priceId: string;
  introductoryPriceId?: string;
  defaultPaymentMethod?: string;
};

function newSubsParams(item: CartItemStripe, paymentMethodId?: string): SubsParams {
  return {
    priceId: item.recurring.id,
    introductoryPriceId: item.trial?.id,
    defaultPaymentMethod: paymentMethodId,
  }
}

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
  crossed?: string;
  offerDesc?: string;
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
    header,
    title: item.price.title || '',
    payable: ftcRegularPriceParts(item.price),
    crossed: undefined,
    offerDesc: undefined,
  };
}

export function newStripeCartItemParams(item: CartItemStripe): CartItemUIParams {
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




