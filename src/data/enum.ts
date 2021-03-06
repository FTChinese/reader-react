export type LoginMethod = 'email' | 'mobile' | 'wechat';
export type PaymentKind = 'alipay' | 'wechat' | 'stripe' | 'apple' | 'b2b';
export type Tier = 'standard' | 'premium';
export type Cycle = 'month' | 'year';
export type Gender = 'M' | 'F';
export type Platform = 'web' | 'ios' | 'android';
export type SubStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
export type OrderKind = 'create' | 'renew' | 'upgrade' | 'downgrade' | 'add_on';
export type AccountKind = 'ftc' | 'mobile' | 'wechat' | 'linked';
export type PriceKind = 'recurring' | 'one_time';
export type OfferKind = 'promotion' | 'retention' | 'win_back';
export type DiscountStatus = 'active' | 'paused' | 'cancelled';
export type WxOAuthKind = 'login' | 'link';
export type WxUnlinkAnchor = 'ftc' | 'wechat';

export const tiers: Tier[] = ['standard', 'premium'];
export const cycles: Cycle[] = ['month', 'year'];

export function isInvalidSubStatus(s?: SubStatus): boolean {
  if (s === 'incomplete_expired' || s === 'past_due' || s === 'unpaid') {
    return true;
  }

  return false;
}

export function isTrialing(s: SubStatus): boolean {
  return s === 'trialing';
}

export const paymentMethodIcons: Record<PaymentKind, string> = {
  'alipay': 'https://www.ftacademy.cn/images/alipay-68x24.png',
  'wechat': 'https://www.ftacademy.cn/images/wxpay-113x24.png',
  'stripe': 'https://www.ftacademy.cn/images/stripe-58x24.png',
  'apple': '',
  'b2b': '',
};

