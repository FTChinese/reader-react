import { getDate, getMonth, getYear, parseISO } from 'date-fns';
import { isExceedingYear, isExpired } from '../utils/now';
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

  constructor(m?: Membership) {
    if (m) {
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

  isStripe(): boolean {
    return this.payMethod === 'stripe' && !!this.stripeSubsId
  }

  autoRenewMoment(): AutoRenewMoment | null {
    if (!this.expireDate) {
      return null;
    }

    if (!this.cycle) {
      return null;
    }

    return {
      year: `${getYear(this.expireDate)}`,
      month: `${getMonth(this.expireDate)}`,
      date: `${getDate(this.expireDate)}`,
      cycle: this.cycle,
    };
  }

  normalizePayMethod(): PaymentKind | undefined {
    if (this.payMethod) {
      return this.payMethod;
    }

    if (this.tier) {
      return 'alipay';
    }

    return undefined;
  }

  isZero(): boolean {
    return this.tier == null && !this.vip;
  }

  isExpired(): boolean {
    if (!this.expireDate) {
      return true;
    }

    return isExpired(this.expireDate) && !this.autoRenew;
  }

  isOneOff(): boolean {
    return this.payMethod === 'alipay' || this.payMethod === 'wechat';
  }

  isSubs(): boolean {
    return this.payMethod === 'stripe' || this.payMethod === 'apple';
  }

  isStripeRenewOn(): boolean {
    return this.payMethod === 'stripe' && this.autoRenew
  }

  isStripeCancelled(): boolean {
    return this.payMethod === 'stripe' && !this.autoRenew && !this.isExpired();
  }

  isBeyondMaxRenewal(): boolean {
    if (!this.expireDate) {
      return false;
    }

    return isExceedingYear(this.expireDate, 3);
  }

  /**
   * @description Manipulate addon
   */
  hasAddOn(): boolean {
    return this.standardAddOn > 0 || this.premiumAddOn > 0;
  }

  isConvertableToAddOn(): boolean {
    return this.isOneOff() && !this.isExpired;
  }

  applicableOfferKinds(): OfferKind[] {
    if (this.isZero()) {
      return [
        'promotion'
      ];
    }

    if (this.isExpired()) {
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
