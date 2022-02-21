import { Tier } from './enum';
import { isBeyondMaxRenewalPeriod, Membership, normalizePayMethod } from './membership';
import { cycleOfYMD } from './period';
import { Price, StripePrice } from './price';

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
}

export type CheckoutIntent = {
  kind: IntentKind;
  message: string;
};

export const intentVip: CheckoutIntent = {
  kind: IntentKind.Forbidden,
  message: 'VIP无需订阅',
};

export const intentNewMember: CheckoutIntent = {
  kind: IntentKind.Create,
  message: '累加一个订阅周期',
};

export function intentOneTimeRenewal(expireDate?: string): CheckoutIntent {
  if (expireDate && isBeyondMaxRenewalPeriod(expireDate)) {
    return {
      kind: IntentKind.Forbidden,
      message: `剩余时间(${expireDate})超出允许的最长续订期限，无法继续使用支付宝/微信再次购买`,
    };
  }

  return {
    kind: IntentKind.Renew,
    message: '累加一个订阅周期',
  };
}

export function intentOneTimeDiffTier(target: Tier): CheckoutIntent {
  switch (target) {
    case 'premium':
      return {
        kind: IntentKind.Upgrade,
        message: '马上升级高端会员，当前标准版剩余时间将在高端版结束后继续使用'
      }

    case 'standard':
      return {
        kind: IntentKind.AddOn,
        message: '购买的标准版订阅期限将在当前高端订阅结束后启用'
      }
  }
}

export const intentUnknown: CheckoutIntent = {
  kind: IntentKind.Forbidden,
  message: '仅支持新建订阅、续订、标准会员升级和购买额外订阅期限，不支持其他操作。\n当前会员购买方式未知，因此无法确定您可以执行哪些操作，请联系客服完善您的数据'
};

export const intentAutoRenewAddOn: CheckoutIntent = {
  kind: IntentKind.AddOn,
  message: '当前订阅为自动续订，购买额外时长将在自动续订关闭并结束后启用',
};

export function newOneTimeOrderIntent(m: Membership, p: Price): CheckoutIntent {
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
            kind: IntentKind.Forbidden,
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
          kind: IntentKind.Forbidden,
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

  return intentUnknown;
}

export function newStripeOrderIntent(m: Membership, p: StripePrice): CheckoutIntent {
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
        kind: IntentKind.OneTimeToAutoRenew,
        message: '使用Stripe转为自动续订，当前剩余时间将在新订阅失效后再次启用。'
      };

    // Stripe -> Stripe
    case 'stripe':
      if (m.tier === p.tier) {
        if (m.cycle === cycleOfYMD(p.periodCount)) {
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

      switch (p.tier) {
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
