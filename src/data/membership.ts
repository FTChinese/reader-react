import { isBefore, parseISO, startOfDay } from 'date-fns';
import { OrderKind, PaymentMethod, SubStatus } from './enum';
import { Edition } from './paywall';


export interface Membership extends Edition {
  compoundId: string;
  ftcId: string | null;
  unionId: string | null;
  expireDate: string;
  payMethod: PaymentMethod;
  ftcPlanId: string | null;
  stripeSubsId: string | null;
  autoRenewal: boolean;
  status: SubStatus;
  appleSubsId: string | null;
  b2bLicenceId: string | null;
  standardAddOn: number;
  premiumAddOn: number;
  vip: boolean
}

export function isMembershipZero(m: Membership): boolean {
  return m.tier == null;
}

export function isAutoRenewSubs(m: Membership): boolean {
  if (m.autoRenewal) {
    return true;
  }

  return !isMemberExpired(m);
}

export function isMemberExpired(m: Membership): boolean {
  if (!m.expireDate) {
    return true;
  }

  const expireOn = parseISO(m.expireDate);
  const today = startOfDay(new Date());

  return isBefore(expireOn, today) && !m.autoRenewal;
}

export function isOneTimePurchase(m: Membership): boolean {
  // Backward compatible.
  if (m.tier != null && m.payMethod == null) {
    return true;
  }

  return m.payMethod === 'alipay' || m.payMethod === 'wechat';
}

export function isConvertableToAddOn(m: Membership): boolean {
  return isOneTimePurchase(m) && !isMemberExpired(m);
}

/**
 * @todo Modify for API.
 */
export interface MemberSnapshot {
  id: string;
  createdBy: string;
  createdUtc: string;
  orderId: string | null;
  membership: Membership;
}

export interface Invoice extends Edition {
  id: string;
  compoundId: string;
  years: number;
  months: number;
  days: number;
  addOnSource: 'carry_over' | 'compensation' | 'user_purchase';
  appleTxId: string | null;
  orderId: string | null;
  orderKind: OrderKind;
  paidAmount: number;
  priceId: string | null;
  stripeSubsId: string | null;
  createdUtc: string | null;
  consumedUtc: string | null;
  startUtc: string | null;
  endUtc: string | null;
  carriedOverUtc: string | null;
}
