import { getDate, getMonth } from 'date-fns';
import { isAccountWxOnly, isMobileDerivedEmail, ReaderAccount } from '../../data/account';
import { Cycle, PaymentMethod, Tier } from '../../data/enum';
import { localizedCycle, localizedTier, localizePaymentMethod } from '../../data/localization';

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
 * @description Pick identifiable row of an account
 */
export function rowAccountIdentifier(a: ReaderAccount): StringPair {
  if (isAccountWxOnly(a)) {
    return pairWxName(a.wechat.nickname);
  }

  if (isMobileDerivedEmail(a.email)) {
    return pairMobile(a.mobile);
  }

  return pairEmail(a.email);
}

/**
 * @description Show auto renewal date
 * @example 11月11日/年 or 11日/月 depending on the value of cycle.
 */
 function formatAutoRenewMoment(expiresAt: Date, cycle: Cycle): string {
  switch (cycle) {
    case 'year':
      return `${getMonth(expiresAt)}月${getDate(expiresAt)}日/${localizedCycle(cycle)}`

    case 'month':
      return `${getDate(expiresAt)}/${localizedCycle(cycle)}`
  }
}

export function rowTier(tier: Tier | null): StringPair {
  return ['会员类型', tier ? localizedTier(tier) : '-']
}

export function rowSubsSource(pm: PaymentMethod | null): StringPair {
  return ['订阅方式', localizePaymentMethod(pm)];
}

export function rowExpiration(date: string | null, isVip: boolean = false): StringPair {
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
