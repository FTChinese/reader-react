import { addYears, isAfter, parseISO } from 'date-fns';
import { isExpired } from '../utils/now';
import { Cycle, OfferKind, OrderKind, PaymentKind, SubStatus, Tier } from './enum';
import { Edition } from './edition';
import { localizeCycle } from './localization';

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
};

export class MemberParsed {

  readonly ftcId?: string;
  readonly unionId?: string;
  readonly tier?: Tier;
  readonly cycle?: Cycle;
  readonly expireDate?: Date;
  readonly payMethod?: PaymentKind;
  readonly stripeSubsId?: string;
  readonly autoRenew: boolean = false;
  readonly status?: SubStatus;
  readonly appleSubsId?: string;
  readonly b2bLicenceId?: string;
  readonly standardAddOn: number = 0;
  readonly premiumAddOn: number = 0;
  readonly vip: boolean = false;

  constructor(m: Membership) {
    this.ftcId = m.ftcId;
    this.unionId = m.unionId;
    this.tier = m.tier;
    this.cycle = m.cycle;
    if (m.expireDate) {
      this.expireDate = parseISO(m.expireDate);
    }
    this.payMethod = m.payMethod;
    this.stripeSubsId = m.stripeSubsId;
    this.autoRenew = m.autoRenew;
    this.status = m.status;
    this.appleSubsId = m.appleSubsId;
    this.b2bLicenceId = m.b2bLicenceId;
    this.standardAddOn = m.standardAddOn;
    this.premiumAddOn = m.premiumAddOn;
    this.vip = m.vip;
  }
}

export function zeroMembership(): Membership {
  return {
    autoRenew: false,
    standardAddOn: 0,
    premiumAddOn: 0,
    vip: false,
  }
}

export function hasStripeSubs(m: Membership): boolean {
  return m.payMethod === 'stripe' && !!m.stripeSubsId
}

export type AutoRenewMoment = {
  year: string;
  month: string;
  date: string;
  cycle: Cycle;
};

export function parseAutoRenewMoment(m: Membership): AutoRenewMoment | null {
  if (!m.expireDate) {
    return null;
  }

  if (!m.cycle) {
    return null;
  }

  const parts = m.expireDate.split('-');
  if (parts.length < 3) {
    return null;
  }

  return {
    year: parts[0],
    month: parts[1],
    date: parts[2],
    cycle: m.cycle,
  };
}

export function concatAutoRenewMoment(m: AutoRenewMoment): string {
  const dateCycle = `${m.date}日/${localizeCycle(m.cycle)}`;

  switch (m.cycle) {
    case 'year':
      return `${m.month}月${dateCycle}`;

    case 'month':
      return dateCycle;
  }
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
  return m.payMethod === 'stripe' || m.payMethod === 'apple';
}

export function isStripeRenewOn(m: Membership): boolean {
  return m.payMethod === 'stripe' && m.autoRenew
}

export function isStripeCancelled(m: Membership): boolean {
  return m.payMethod === 'stripe' && !m.autoRenew && !isMemberExpired(m);
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
export function hasAddOn(m: Membership): boolean {
  return m.standardAddOn > 0 || m.premiumAddOn > 0;
}

export function isConvertableToAddOn(m: Membership): boolean {
  return isOneTimePurchase(m) && !isMemberExpired(m);
}

export function applicableOfferKinds(m: Membership): OfferKind[] {
  if (isMembershipZero(m)) {
    return [
      'promotion'
    ];
  }

  if (isMemberExpired(m)) {
    return [
      'promotion',
      'win_back'
    ];
  }

  return [
    'promotion',
    'retention'
  ];
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
