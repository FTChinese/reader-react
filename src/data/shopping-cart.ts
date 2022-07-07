import { newMoneyParts, localizeCycle, PriceParts } from './localization';
import { cycleOfYMD, formatPeriods, isZeroYMD } from './period';
import { newStripePriceParts, StripePayMethod } from './stripe';
import { CartItemFtc, CartItemStripe } from './paywall-product';

export type OrderParams = {
  priceId: string;
  discountId?: string;
};

export type AliOrderParams = OrderParams & {
  returnUrl: string
}

export function newOrderParams(item: CartItemFtc): OrderParams {
  return {
    priceId: item.price.id,
    discountId: item.discount?.id,
  };
}

export type SubsParams = {
  priceId: string;
  introductoryPriceId?: string;
  coupon?: string;
  defaultPaymentMethod?: string;
};

export function newSubsParams(
  item: CartItemStripe,
  payMethod: StripePayMethod,
): SubsParams {
  return {
    priceId: item.recurring.id,
    introductoryPriceId: item.trial?.id,
    coupon: item.coupon?.id,
    defaultPaymentMethod: payMethod.id,
  };
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
  crossed?: PriceParts; // The original price if a discount exists.
  postTrial?: PriceParts; // The original price if a trial exists
  isAutoRenew: boolean
};

export function priceCardParamsOfFtc(item: CartItemFtc): CartItemUIParams {

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
      crossed: {
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

  const recurPriceParts = newStripePriceParts(
    item.recurring,
    true
  );

  if (item.trial) {
    return {
      header,
      title: '新会员首次试用',
      payable: newStripePriceParts(
        item.trial,
        false
      ),
      postTrial: recurPriceParts,
      isAutoRenew: true,
    };
  }

  // if (item.coupon) {
  //   return {
  //     header,
  //     title: '现在订阅领取优惠券',
  //     payable: {

  //     },
  //     crossed: {

  //     },
  //     isAutoRenew: true,
  //   }
  // }

  return {
    header,
    title: '',
    payable: recurPriceParts,
    isAutoRenew: true,
  };
}




