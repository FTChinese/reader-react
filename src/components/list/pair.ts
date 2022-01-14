import { getDate, getMonth } from 'date-fns';
import { Cycle, PaymentMethod, Tier } from '../../data/enum';
import { localizeCycle, localizeTier, localizePaymentMethod } from '../../data/localization';

export type StringPair = [string, string];

export function pairWxName(nickname: string | null): StringPair {
  return ['微信', nickname || '-'];
}

export function pairMobile(mobile: string | null): StringPair {
  return ['手机', mobile || ''];
}

export function pairEmail(email: string): StringPair {
  return ['邮箱', email];
}

/**
 * @description Show auto renewal date
 * @example 11月11日/年 or 11日/月 depending on the value of cycle.
 */
function formatAutoRenewMoment(expiresAt: Date, cycle: Cycle): string {
  switch (cycle) {
    case 'year':
      return `${getMonth(expiresAt)}月${getDate(expiresAt)}日/${localizeCycle(cycle)}`

    case 'month':
      return `${getDate(expiresAt)}/${localizeCycle(cycle)}`
  }
}

export function rowTier(tier?: Tier): StringPair {
  return ['会员类型', tier ? localizeTier(tier) : '-']
}

export function rowSubsSource(pm?: PaymentMethod): StringPair {
  return ['订阅方式', localizePaymentMethod(pm)];
}

export function rowExpiration(date?: string, isVip: boolean = false): StringPair {
  return [
    '到期时间',
    isVip ? '无限期' : (date || '-')
  ];
}

export function rowAutoRenewDate(expiresAt: Date, cycle: Cycle): StringPair {
  return ['自动续订', formatAutoRenewMoment(expiresAt, cycle)];
}

export function rowAutoRenewOn(): StringPair {
  return ['自动续订', '已开启'];
}

export function rowAutoRenewOff(): StringPair {
  return ['自动续订', '已关闭'];
}
