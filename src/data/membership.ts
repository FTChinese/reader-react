import { isBefore, parseISO, startOfDay } from 'date-fns';
import { isExpired } from '../utils/now';
import { OrderKind, PaymentMethod, SubStatus } from './enum';
import { Edition } from './paywall';


export type Membership =  Partial<Edition> & {
  ftcId: string | null;
  unionId: string | null;
  expireDate: string | null;
  payMethod: PaymentMethod | null;
  ftcPlanId: string | null;
  stripeSubsId: string | null;
  autoRenew: boolean;
  status: SubStatus | null;
  appleSubsId: string | null;
  b2bLicenceId: string | null;
  standardAddOn: number;
  premiumAddOn: number;
  vip: boolean;
}

export function isMemberExpired(m: Membership): boolean {
  if (!m.expireDate) {
    return true;
  }

  const expireOn = parseISO(m.expireDate);

  return isExpired(expireOn) && !m.autoRenew;
}

export function isMembershipZero(m: Membership): boolean {
  return m.tier == null;
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
