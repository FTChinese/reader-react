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
import { Membership, isMembershipZero, normalizePayMethod, isBeyondMaxRenewalPeriod } from './membership';
import { PaywallProduct } from './paywall';
import { cycleOfYMD, formatPeriods, isValidPeriod, isZeroYMD } from './period';
import { Tier } from './enum';
import { Order, OrderParams } from './order';

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
  Downgrade,
  // One time purchase:
  // * Premium -> standard
  // Auto-renewal:
  // * Standard -> standard
  // * Premium -> standard
  // * Premium -> premium
  AddOn,
  // One time purchase switching to auto renewal mode.
  OneTimeToAutoRenew,
  // For auto-renewal mode, a user could switch
  // from monthly billing interval to year, or vice versus.
  SwitchInterval,
}

type OrderIntent = {
  kind: SubsKind;
  message: string;
};

const intentVip: OrderIntent = {
  kind: SubsKind.Forbidden,
  message: 'VIP无需订阅',
};

const intentNewMember: OrderIntent = {
  kind: SubsKind.Create,
  message: '累加一个订阅周期',
};

function intentOneTimeRenewal(expireDate?: string): OrderIntent {
  if (expireDate && isBeyondMaxRenewalPeriod(expireDate)) {
    return {
      kind: SubsKind.Forbidden,
      message: `剩余时间(${expireDate})超出允许的最长续订期限，无法继续使用支付宝/微信再次购买`,
    };
  }

  return {
    kind: SubsKind.Renew,
    message: '累加一个订阅周期',
  };
}

function intentOneTimeDiffTier(target: Tier): OrderIntent {
  switch (target) {
    case 'premium':
      return {
        kind: SubsKind.Upgrade,
        message: '马上升级高端会员，当前标准版剩余时间将在高端版结束后继续使用'
      }

    case 'standard':
      return {
        kind: SubsKind.AddOn,
        message: '购买的标准版订阅期限将在当前高端订阅结束后启用'
      }
  }
}

const intentUnknown: OrderIntent = {
  kind: SubsKind.Forbidden,
  message: '仅支持新建订阅、续订、标准会员升级和购买额外订阅期限，不支持其他操作。\n当前会员购买方式未知，因此无法确定您可以执行哪些操作，请联系客服完善您的数据'
};

const intentAutoRenewAddOn: OrderIntent = {
  kind: SubsKind.AddOn,
  message: '当前订阅为自动续订，购买额外时长将在自动续订关闭并结束后启用',
};

function newOneTimeOrderIntent(m: Membership, p: Price): OrderIntent {
  if (m.vip) {
    return intentVip;
  }

  if (!m.tier) {
    return intentNewMember;
  }

  switch (normalizePayMethod(m)) {
    case 'alipay':
    case 'wechat':
      if (m.tier == p.tier) {
        return intentOneTimeRenewal(m.expireDate);
      }

      return intentOneTimeDiffTier(m.tier);

    case 'stripe':
      // Stripe standard -> Onetime standard
      // Stripe premium -> Onetime premium
      if (m.tier === p.tier) {
        return intentAutoRenewAddOn;
      }

      switch (p.tier) {
        // Stripe standard -> Onetime premium
        case 'premium':
          return {
            kind: SubsKind.Forbidden,
            message: 'Stripe标准版订阅不能使用支付宝/微信购买高端版'
          }

        // Stripe premium -> Onetime standard
        case 'standard':
          return intentAutoRenewAddOn;
      }

    case 'apple':
      // Apple standard -> Onetime premium
      if (m.tier === 'standard' && p.tier === 'premium') {
        return {
          kind: SubsKind.Forbidden,
          message: '当前标准会员会员来自苹果内购，升级高端会员需要在您的苹果设备上，使用原有苹果账号登录后，在FT中文网APP内操作'
        };
      }

      // Apple standard -> Onetime standard
      // Apple premium -> Onetime premium
      // Apple premium -> Onetime standard
      return intentAutoRenewAddOn;

    case 'b2b':
      if (m.tier === 'standard' && p.tier === 'premium') {
        return {
          kind: SubsKind.Forbidden,
          message: '当前订阅来自企业版授权，升级高端订阅请联系您所属机构的管理人员',
        };
      }

      // B2B standard -> Onetime standard
      // B2B premium -> Onetime premium
      // B2B premium -> Onetime premium
      return {
        kind: SubsKind.AddOn,
        message: '当前订阅来自企业版授权，个人购买的订阅时长将在授权取消或过期后启用',
      };
  }

  return intentUnknown;
}

function newStripeOrderIntent(m: Membership, p: StripePrice): OrderIntent {
  if (m.vip) {
    return intentVip;
  }

  if (!m.tier) {
    return intentNewMember;
  }

  switch (normalizePayMethod(m)) {
    // Onetime purchase -> Stripe.
    case 'alipay':
    case 'wechat':
      return {
        kind: SubsKind.OneTimeToAutoRenew,
        message: '使用Stripe转为自动续订，当前剩余时间将在新订阅失效后再次启用。'
      };

    // Stripe -> Stripe
    case 'stripe':
      if (m.tier === p.tier) {
        if (m.cycle === cycleOfYMD(p.periodCount)) {
          return {
            kind: SubsKind.Forbidden,
            message: '自动续订不能重复订阅',
          };
        }

        // month -> year
        // year -> month
        return {
          kind: SubsKind.SwitchInterval,
          message: '更改Stripe自动扣款周期，建议您订阅年度版更划算。',
        };
      }

      switch (p.tier) {
        // standard -> premium
        case 'premium':
          return {
            kind: SubsKind.Upgrade,
            message: '升级高端会员后Stripe将自动调整您的扣款额度',
          };

        // premium -> standard
        case 'standard':
          return {
            kind: SubsKind.Downgrade,
            message: '降级为标准版订阅',
          };
      }

    case 'apple':
      return {
        kind: SubsKind.Forbidden,
        message: '为避免重复订阅，苹果自动续订不能使用Stripe',
      };

    case 'b2b':
      return {
        kind: SubsKind.Forbidden,
        message: '为避免重复订阅，企业版授权订阅不能使用Stripe'
      };
  }

  return intentUnknown;
}

/**
 * @description FtcCartItem represents the item
 * user want to buy.
 */
export type FtcShelfItem = {
  intent: OrderIntent;
  price: Price;
  discount?: Discount;
  isIntro: boolean;
};

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

  if (!isMembershipZero(m)) {
    return undefined;
  }

  return {
    intent: {
      kind: SubsKind.Create,
      message: ''
    },
    price: pp.introductory,
    discount: undefined,
    isIntro: true,
  };
}

export function buildFtcShelfItems(product: PaywallProduct, m: Membership): FtcShelfItem[] {
  const intro = getIntroItem(product, m);

  const recurrings = product.prices.map<FtcShelfItem>(price => {
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

export function newOrderParams(item: FtcShelfItem): OrderParams {
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

export type StripeShelfItem = {
  intent: OrderIntent;
  recurring: StripePrice;
  trial?: StripePrice;
}

export function buildStripeShelfItems({
  product,
  m,
  prices,
}:{
  product: PaywallProduct;
  m: Membership;
  prices: Map<string, StripePrice>;
}): StripeShelfItem[] {
  const ids = gatherStripePriceIDs(product);

  const trial = ids.trial
    ? prices.get(ids.trial)
    : undefined;

  const items: StripeShelfItem[] = [];

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

export type ShelfItemParams = {
  header: string;
  title: string;
  payable: PriceParts;
  crossed?: string;
  offerDesc?: string;
};

export function newFtcShelfItemParams(item: FtcShelfItem): ShelfItemParams {
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

export function newStripeShelfItemParams(item: StripeShelfItem): ShelfItemParams {
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

/**
 * Order response from API.
 */
type PayIntent = {
  price: Price;
  order: Order;
};


export type WxPayIntent = PayIntent & {
  params: {
    desktopQr: string;
    mobileRedirect:  string;
  };
};

export type AliPayIntent = PayIntent & {
  params: {
    browserRedirect: string;
  };
};

export type PubKey = {
  key: string;
};
