import { addYears, isAfter, parseISO } from 'date-fns';
import { isExpired } from '../utils/now';
import { Cycle, OrderKind, PaymentKind, SubStatus, Tier } from './enum';
import { Edition } from './edition';

export type Membership =  {
  ftcId?: string;
  unionId?: string;
  tier?: Tier;
  cycle?: Cycle;
  expireDate?: string;
  payMethod?: PaymentKind;
  ftcPlanId?: string;
  stripeSubsId?: string;
  autoRenew: boolean;
  status?: SubStatus;
  appleSubsId?: string;
  b2bLicenceId?: string;
  standardAddOn: number;
  premiumAddOn: number;
  vip: boolean;
}

export function normalizePayMethod(m: Membership): PaymentKind | undefined {
  if (m.payMethod) {
    return m.payMethod;
  }

  if (m.tier) {
    return 'alipay';
  }

  return undefined;
}

export function isMembershipZero(m: Membership): boolean {
  return m.tier == null && !m.vip;
}

export function isOneTimePurchase(m: Membership): boolean {
  return m.payMethod === 'alipay' || m.payMethod === 'wechat';
}

export function isRenewalSubs(m: Membership): boolean {
  return m.payMethod === 'stripe' || m.payMethod === 'wechat';
}

export function isMemberExpired(m: Membership): boolean {
  if (!m.expireDate) {
    return true;
  }

  const expireOn = parseISO(m.expireDate);

  return isExpired(expireOn) && !m.autoRenew;
}

export function isBeyondMaxRenewalPeriod(expireDate?: string): boolean {
  if (!expireDate) {
    return true;
  }

  const expireOn = parseISO(expireDate);
  const threeYearslater = addYears(new Date(), 3);

  return isAfter(expireOn, threeYearslater);
}



/**
 * @description Manipulate addon
 */
function hasAddOn(m: Membership): boolean {
  return m.standardAddOn > 0 || m.premiumAddOn > 0;
}

function hasStdAddOn(m: Membership): boolean {
  return m.standardAddOn > 0;
}

function hasPrmAddOn(m: Membership): boolean {
  return m.premiumAddOn > 0;
}

function shouldUseAddOn(m: Membership): boolean {
  return isMemberExpired(m) && hasAddOn(m);
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
