import { localizeDate } from '../utils/format-time';
import { isExceedingYear, isExpired } from '../utils/now';
import { Cycle, PaymentKind, Tier } from './enum';
import { MemberParsed } from './membership';
import { cycleOfYMD } from './period';
import { Price } from './price';
import { StripePrice } from './stripe';

export enum IntentKind {
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
  // When a coupon exists, auto-renewal user could apply it
  // existing subscription.
  ApplyCoupon,
}

export type CheckoutIntent = {
  kind: IntentKind;
  message: string;
};

const intentVip: CheckoutIntent = {
  kind: IntentKind.Forbidden,
  message: 'VIP无需订阅',
};

export const intentNewMember: CheckoutIntent = {
  kind: IntentKind.Create,
  message: '累加一个订阅周期',
};

const intentUnknown: CheckoutIntent = {
  kind: IntentKind.Forbidden,
  message: '仅支持新建订阅、续订、标准会员升级和购买额外订阅期限，不支持其他操作。\n当前会员购买方式未知，因此无法确定您可以执行哪些操作，请联系客服完善您的数据'
};

const intentAutoRenewAddOn: CheckoutIntent = {
  kind: IntentKind.AddOn,
  message: '当前订阅为自动续订，购买额外时长将在自动续订关闭并结束后启用',
};

function newFtcCheckoutIntent(source: IntentSourceCondition, target: IntentTargetCondition): CheckoutIntent {
  if (source.isVip) {
    return intentVip;
  }

  // IntentKind.Create
  if (!source.tier) {
    return intentNewMember;
  }

  switch (source.payMethod) {
    case 'alipay':
    case 'wechat':
      // IntentKind.Renew
      // IntentKind.Forbidden
      if (source.tier == target.tier) {

        if (source.expireDate && isExceedingYear(source.expireDate, 3)) {
          return {
            kind: IntentKind.Forbidden,
            message: `到期时间(${localizeDate(source.expireDate)})超出允许的最长续订期限，无法继续使用支付宝/微信再次购买`,
          };
        }

        return {
          kind: IntentKind.Renew,
          message: '累加一个订阅周期',
        };
      }

      // IntentKind.Upgrade
      // IntentKind.AddOn
      switch (target.tier) {
        // Standard -> Premium
        case 'premium':
          return {
            kind: IntentKind.Upgrade,
            message: '马上升级高端会员，当前标准版剩余时间将在高端版结束后继续使用'
          }

        // Premium -> Standard
        case 'standard':
          return {
            kind: IntentKind.AddOn,
            message: '购买的标准版订阅期限将在当前高端订阅结束后启用'
          }
      }

    case 'stripe':
      // Stripe standard -> Onetime standard
      // Stripe premium -> Onetime premium
      // IntentKind.AddOn
      if (source.tier === target.tier) {
        return intentAutoRenewAddOn;
      }

      switch (target.tier) {
        // Stripe standard -> Onetime premium
        // IntentKind.Forbidden
        case 'premium':
          return {
            kind: IntentKind.Forbidden,
            message: 'Stripe标准版订阅不能使用支付宝/微信购买高端版'
          }

        // Stripe premium -> Onetime standard
        // IntentKind.AddOn
        case 'standard':
          return intentAutoRenewAddOn;
      }

    case 'apple':
      // Apple standard -> Onetime premium
      // IntentKind.Forbidden
      if (source.tier === 'standard' && target.tier === 'premium') {
        return {
          kind: IntentKind.Forbidden,
          message: '当前标准会员会员来自苹果内购，升级高端会员需要在您的苹果设备上，使用原有苹果账号登录后，在FT中文网APP内操作'
        };
      }

      // Apple standard -> Onetime standard
      // Apple premium -> Onetime premium
      // Apple premium -> Onetime standard
      // IntentKind.AddOn
      return intentAutoRenewAddOn;

    case 'b2b':
      // IntentKind.Forbidden
      if (source.tier === 'standard' && target.tier === 'premium') {
        return {
          kind: IntentKind.Forbidden,
          message: '当前订阅来自企业版授权，升级高端订阅请联系您所属机构的管理人员',
        };
      }

      // B2B standard -> Onetime standard
      // B2B premium -> Onetime premium
      // B2B premium -> Onetime premium
      return {
        kind: IntentKind.AddOn,
        message: '当前订阅来自企业版授权，个人购买的订阅时长将在授权取消或过期后启用',
      };
  }

  // IntentKind.Forbidden
  return intentUnknown;
}

function newStripeCheckoutIntent(source: IntentSourceCondition, target: IntentTargetCondition): CheckoutIntent {
  if (source.isVip) {
    return intentVip;
  }

  if (!source.tier) {
    return {
      kind: IntentKind.Create,
      message: '',
    };
  }

  switch (source.payMethod) {
    // Onetime purchase -> Stripe.
    case 'alipay':
    case 'wechat':
      if (source.expireDate && isExpired(source.expireDate)) {
        return {
          kind: IntentKind.Create,
          message: ''
        };
      }

      return {
        kind: IntentKind.OneTimeToAutoRenew,
        message: '使用Stripe转为自动续订，当前剩余时间将在新订阅失效后再次启用。'
      };

    // Stripe -> Stripe
    case 'stripe':
      if (source.tier === target.tier) {
        if (source.cycle === target.cycle) {

          if (target.hasCoupon) {
            return {
              kind: IntentKind.ApplyCoupon,
              message: '优惠券将从下一次付款的发票总额中扣除，一个付款周期内仅可使用一次优惠券'
            }
          }

          return {
            kind: IntentKind.Forbidden,
            message: '自动续订不能重复订阅',
          };
        }

        // month -> year
        // year -> month
        return {
          kind: IntentKind.SwitchInterval,
          message: '更改Stripe自动扣款周期，建议您订阅年度版更划算。',
        };
      }

      // Purchase a different tier.
      switch (target.tier) {
        // standard -> premium
        case 'premium':
          return {
            kind: IntentKind.Upgrade,
            message: '升级高端会员后Stripe将自动调整您的扣款额度',
          };

        // premium -> standard
        case 'standard':
          return {
            kind: IntentKind.Downgrade,
            message: '降级为标准版订阅',
          };
      }

    case 'apple':
      return {
        kind: IntentKind.Forbidden,
        message: '为避免重复订阅，苹果自动续订不能使用Stripe',
      };

    case 'b2b':
      return {
        kind: IntentKind.Forbidden,
        message: '为避免重复订阅，企业版授权订阅不能使用Stripe'
      };
  }

  return intentUnknown;
}

type IntentSourceCondition = {
  isVip: boolean;
  tier?: Tier;
  cycle?: Cycle;
  payMethod?: PaymentKind;
  isAutoRenew: boolean;
  expireDate?: Date;
};

export function newIntentSource(m: MemberParsed): IntentSourceCondition {
  return {
    isVip: m.vip,
    tier: m.tier,
    cycle: m.cycle,
    payMethod: m.normalizePayMethod(),
    isAutoRenew: m.autoRenew,
    expireDate: m.expireDate,
  };
}

type IntentTargetCondition = {
  tier: Tier;
  cycle: Cycle;
  payMethod: PaymentKind;
  // For stripe coupon.
  // A coupon could only be used when
  // - No trial price;
  // - Coupon exists.
  hasCoupon: boolean;
};

export function newOneOffTarget(price: Price): IntentTargetCondition {
  return {
    tier: price.tier,
    cycle: cycleOfYMD(price.periodCount),
    payMethod: 'alipay',
    hasCoupon: false,
  };
}

export function newStripeTarget(price: StripePrice, hasCoupon: boolean): IntentTargetCondition {
  return {
    tier: price.tier,
    cycle: cycleOfYMD(price.periodCount),
    payMethod: 'stripe',
    hasCoupon: hasCoupon,
  };
}

export function buildCheckoutIntent(source: IntentSourceCondition, target: IntentTargetCondition): CheckoutIntent {
  switch (target.payMethod) {
    case 'alipay':
    case 'wechat':
      return newFtcCheckoutIntent(source, target);

    case 'stripe':
      return newStripeCheckoutIntent(source, target);

    default:
      return intentUnknown;
  }
}

export function stripeBtnText(k: IntentKind): string {
  switch (k) {
    case IntentKind.SwitchInterval:
      return '更改订阅周期';

    case IntentKind.Upgrade:
      return '转为高端会员';

    case IntentKind.Downgrade:
      return '转为标准会员';

    case IntentKind.ApplyCoupon:
      return '领取优惠券';

    default:
      return '订阅';
  }
}
