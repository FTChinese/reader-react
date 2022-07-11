import { localizeCycle, PriceParts } from './localization';
import { cycleOfYMD } from './period';
import { formatCouponAmount, newStripePriceParts, StripePayMethod } from './stripe';
import { CartItemFtc, CartItemStripe } from './paywall-product';
import { newFtcPriceParts } from './price';

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
  original?: {
    description: string;
    crossed: boolean;
    parts: PriceParts;
  }; // The original price if a coupon exists.
  isAutoRenew: boolean
};

export function priceCardParamsOfFtc(item: CartItemFtc): CartItemUIParams {

  const header = item.isIntro
    ? '试用'
    : `包${localizeCycle(cycleOfYMD(item.price.periodCount))}`;

  if (item.discount) {

    return {
      header,
      title: item.discount.description || '限时折扣',
      payable: newFtcPriceParts(item.price, item.discount),
      original: {
        description: '原价',
        crossed: true,
        parts: newFtcPriceParts(item.price),
      },
      isAutoRenew: false,
    };
  }

  return {
    header,
    title: item.price.title || '',
    payable: newFtcPriceParts(item.price),
    isAutoRenew: false,
  };
}

export function priceCardParamsOfStripe(item: CartItemStripe): CartItemUIParams {

  const header = `连续包${localizeCycle(cycleOfYMD(item.recurring.periodCount))}`;

  const recurPriceParts = newStripePriceParts(
    item.recurring,
    true
  );

  // Price with trial.
  if (item.trial) {
    return {
      header,
      title: '新会员首次试用',
      payable: newStripePriceParts(
        item.trial,
        false
      ),
      original: {
        description: '试用结束后自动续订',
        crossed: false,
        parts: newStripePriceParts(
          item.recurring,
          true
        ),
      },
      isAutoRenew: true,
    };
  }

  // Price with coupon. Mutally execlusive with trial price.
  if (item.coupon) {
    return {
      header,
      title: `现在订阅优惠 -${formatCouponAmount(item.coupon)}`,
      payable: newStripePriceParts(
        item.recurring,
        false,
        item.coupon
      ),
      original: {
        description: '自动续订下一付款周期恢复原价',
        crossed: false,
        parts: recurPriceParts,
      },
      isAutoRenew: true,
    }
  }

  return {
    header,
    title: '',
    payable: newStripePriceParts(
      item.recurring,
      true
    ),
    isAutoRenew: true,
  };
}




