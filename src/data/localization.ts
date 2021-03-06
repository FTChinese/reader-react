import { Cycle, PaymentKind, SubStatus, Tier } from './enum';
import { Edition } from './edition';
import { cycleOfYMD, YearMonthDay } from './period';

const tiers: Record<Tier, string> = {
  standard: '标准会员',
  premium: '高端会员'
};

export function localizeTier(tier: Tier): string {
  return tiers[tier];
}

const cycles: Record<Cycle, string> = {
  month: '月',
  year: '年'
};

export function localizeCycle(c: Cycle): string {
  return cycles[c];
}

const paymentMethods: Record<PaymentKind, string> = {
  alipay: '支付宝',
  wechat: '微信',
  stripe: 'Stripe订阅',
  apple: '苹果App内购',
  b2b: '企业订阅'
};

export function localizePaymentMethod(m?: PaymentKind): string {
  if (!m) {
    return '未知来源';
  }

  return paymentMethods[m];
}

export function localizedEdition(e: Edition): string {
  return `${localizeTier(e.tier)}/${localizeCycle(e.cycle)}`;
}

export function formatEdition(t: Tier, ymd: YearMonthDay): string {
  return localizedEdition({
    tier: t,
    cycle: cycleOfYMD(ymd)
  });
}

export function formatMoney(currency: string, amount: number): string {
  return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    })
    .format(amount);
}

export type MoneyParts = {
  symbol: string;
  integer: string;
  decimal: string;
};

export type PriceParts = MoneyParts & {
  cycle: string;
}

export function newMoneyParts(currency: string, amount: number): MoneyParts {
  return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    })
    .formatToParts(amount)
    .reduce<MoneyParts>((prev, curr) => {
      switch (curr.type) {
        case 'currency':
          prev.symbol = curr.value;
          break;

        case 'integer':
          prev.integer += curr.value;
          break;

        case 'decimal':
        case 'fraction':
          prev.decimal += curr.value;
          break;
      }

      return prev;
    }, {
      symbol: '',
      integer: '',
      decimal: '',
    })
}


const subsStatus: Record<SubStatus, string> = {
  'active': '活跃',
  'canceled': '已取消',
  'incomplete': '待支付',
  'incomplete_expired': '未支付，已过支付期',
  'past_due': '未在应付期内支付',
  'trialing': '试用',
  'unpaid': '支付失败'
}

export function localizeSubsStatus(s: SubStatus): string {
  return subsStatus[s];
}
