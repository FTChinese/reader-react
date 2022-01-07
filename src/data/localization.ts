import { Cycle, PaymentMethod, Tier } from './enum';
import { Edition } from './paywall';
import { cycleOfYMD, isDayOnly, isMonthOnly, isYearOnly, YearMonthDay } from './period';

const tiers: Record<Tier, string> = {
  standard: '标准会员',
  premium: '高端会员'
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
  stripe: 'Stripe订阅',
  apple: '苹果App内购',
  b2b: '企业订阅'
};

export function localizePaymentMethod(m: PaymentMethod | null): string {
  if (!m) {
    return '未知来源';
  }

  return paymentMethods[m];
}

export function localizedEdition(e: Edition): string {
  return `${localizedTier(e.tier)}/${localizedCycle(e.cycle)}`;
}


export function formatYMD(ymd: YearMonthDay): string {
  const str: string[] = [];

  if (ymd.years > 0) {
    str.push(`${ymd.years}年}`);
  }

  if (ymd.months > 0) {
    str.push(`${ymd.months}个月`);
  }


  if (ymd.days > 0) {
    str.push(`${ymd.days}天}`);
  }

  return str.join('');
}

export function formatTrialPeriod(ymd: YearMonthDay): string {
  if (isYearOnly(ymd)) {
    return ymd.years > 1 ? `前${ymd.years}年` : '首年';
  }

  if (isMonthOnly(ymd)) {
    return ymd.months > 1 ? `前${ymd.months}` : '首月';
  }

  if (isDayOnly(ymd)) {
    return `前${ymd.days}天`;
  }

  return formatYMD(ymd);
}

export function formatRegularPeriod(ymd: YearMonthDay): string {
  if (isYearOnly(ymd)) {
    return ymd.years > 1 ? `${ymd.years}年` : '年';
  }

  if (isMonthOnly(ymd)) {
    return ymd.months > 1 ? `${ymd.months}` : '月';
  }

  if (isDayOnly(ymd)) {
    return `${ymd.days}天`;
  }

  return formatYMD(ymd);
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
