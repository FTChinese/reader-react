import { Cycle, PaymentMethod, Tier } from './enum';
import { Edition } from './paywall';

const tiers: Record<Tier, string> = {
  standard: '标准版',
  premium: '高端版'
};

export function localizedTier(tier: Tier): string {
  return tiers[tier];
}

const cycles: Record<Cycle, string> = {
  month: '月',
  year: '年'
};

export function localizedCycle(c: Cycle): string {
  return cycles[c];
}

const paymentMethods: Record<PaymentMethod, string> = {
  alipay: '支付宝',
  wechat: '微信',
  stripe: 'Stripe',
  apple: '苹果App Store',
  b2b: '企业订阅'
};

export function localizePaymentMethod(m: PaymentMethod): string {
  return paymentMethods[m];
}

export function formatEdition(e: Edition): string {
  return `${localizedTier(e.tier)}/${localizedCycle(e.cycle)}`;
}


