import {
  Price,
  Discount,
} from './price';
import { newMoneyParts, localizeCycle, PriceParts } from './localization';
import { cycleOfYMD, formatPeriods, isZeroYMD } from './period';
import { CheckoutIntent } from './chekout-intent';
import { StripeCoupon, StripePrice } from './stripe';

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
  coupon?: StripeCoupon;
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

export function cartItemUiOfFtc(item: CartItemFtc): CartItemUIParams {

  const header = item.isIntro
    ? '试用'
    : `包${localizeCycle(cycleOfYMD(item.price.periodCount))}`;

  if (item.discount) {
    const period = isZeroYMD(item.discount.overridePeriod)
      ? item.price.periodCount
      : item.discount.overridePeriod;

    return {
      header,
      title: item.discount.description || '限时折扣',
      payable: {
        ...newMoneyParts(
          item.price.currency,
          item.price.unitAmount - item.discount.priceOff,
        ),
        cycle: '/' + formatPeriods(period, false),
      },
      original: {
        ...newMoneyParts(
          item.price.currency,
          item.price.unitAmount
        ),
        cycle: '/' + formatPeriods(item.price.periodCount, false),
      },
      isAutoRenew: false,
    };
  }

  return {
    header,
    title: item.price.title || '',
    payable: {
      ...newMoneyParts(item.price.currency, item.price.unitAmount),
      cycle: '/' + formatPeriods(item.price.periodCount, false),
    },
    isAutoRenew: false,
  };
}

export function priceCardParamsOfStripe(item: CartItemStripe): CartItemUIParams {

  const header = `连续包${localizeCycle(cycleOfYMD(item.recurring.periodCount))}`;

  const recurPriceParts: PriceParts = {
    ...newMoneyParts(
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
        ...newMoneyParts(
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




