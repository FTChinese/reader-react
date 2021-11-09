import { differenceInDays, getDate, getMonth, parseISO, startOfDay } from 'date-fns';
import { StringPair } from '../components/list/pair';
import { isExpired } from '../utils/now';
import { Cycle, isInvalidSubStatus, SubStatus } from './enum';
import { localizedCycle, localizedTier, localizePaymentMethod } from './localization';
import { Membership } from './membership';

/**
 * @description Describes the UI used to present Membership.
 */
 export type MemberStatus = {
  reminder?: string;
  productName: string;
  details: StringPair[];
  reactivateStripe?: boolean;
}

const expirationTitle = '到期时间';

function getRemainingDays(date: Date): number {
  const today = startOfDay(new Date());
  return differenceInDays(date, today);
}

function formatRemainingDays(expiresAt?: Date, subStatus?: SubStatus | null): string | undefined {
  if (!expiresAt) {
    return undefined;
  }

  const n = getRemainingDays(expiresAt);

  if (n < 0) {
    return '会员已过期';
  }

  if (n === 0) {
    return '会员将于今天过期';
  }

  if (n <= 7) {
    return `会员还有${n}天过期，请及时续订`;
  }

  if (subStatus && isInvalidSubStatus(subStatus)) {
    return '订阅状态异常，请刷新或联系客服'
  }

  return undefined;
}


function formatAutoRenewMoment(expiresAt?: Date, cycle?: Cycle): string {
  if (!expiresAt || !cycle) {
    return ''
  }

  switch (cycle) {
    case 'year':
      return `${getMonth(expiresAt)}月${getDate(expiresAt)}日/${localizedCycle(cycle)}`

    case 'month':
      return `${getDate(expiresAt)}/${localizedCycle(cycle)}`
  }
}

const vipSubsStatus: MemberStatus = {
  productName: '超级会员',
    details: [
      [expirationTitle, '无限期']
    ],
};

function onetimeSubsStatus(m: Membership): MemberStatus {
  return {
    reminder: m.expireDate
      ? formatRemainingDays(parseISO(m.expireDate))
      : undefined,
    productName: m.tier ? localizedTier(m.tier) : '',
    details: [
      [expirationTitle, m.expireDate || '未知'],
    ],
  };
}

/**
 * @description Build card like:
 *       标准会员
 * 订阅方式       企业订阅
 * 到期时间       2021-11-11
 */
function b2bMemberStatus(m: Membership): MemberStatus {
  return {
    reminder: '企业订阅续订或升级请联系所属机构的管理人员',
    productName: m.tier ? localizedTier(m.tier) : '',
    details: [
      ['订阅方式', localizePaymentMethod(m.payMethod)],
      [expirationTitle, m.expireDate || '未知'],
    ],
  };
}

/**
 * @description Build a card like:
 *      标准会员
 * 订阅方式     Stripe订阅
 * 自动续订     xx月xx日/年
 * if auto renew if off
 *      标准会员
 * 订阅方式     Stripe订阅
 * 到期时间     2021-11-11
 * 自动续订     已关闭
 */
function stripeSubsStatus(m: Membership): MemberStatus {
  const productName = m.tier ? localizedTier(m.tier) : '';

  const expiresAt = m.expireDate ? parseISO(m.expireDate) : undefined;

  if (m.autoRenew) {
    return {
      productName,
      details: [
        ['订阅方式', 'Stripe订阅'],
        ['自动续订', formatAutoRenewMoment(expiresAt, m.cycle)]
      ]
    };
  }

  const expired = expiresAt ? isExpired(expiresAt) : false;

  return {
    reminder: formatRemainingDays(expiresAt, m.status),
    productName,
    details: [
      ['订阅方式', 'Stripe订阅'],
      ['到期时间', m.expireDate || '未知'],
      ['自动续订', '已关闭'],
    ],
    reactivateStripe: !expired, // If auto renew is off and expiration date is not past.
  };
}

function appleMemberStatus(m: Membership): MemberStatus {
  const payMethod = '苹果App内购';
  const productName = m.tier ? localizedTier(m.tier) : '';

  const expiresAt = m.expireDate ? parseISO(m.expireDate) : undefined;

  if (m.autoRenew) {
    return {
      productName,
      details: [
        ['订阅方式', payMethod],
        ['自动续订', formatAutoRenewMoment(expiresAt, m.cycle)]
      ]
    };
  }

  return {
    reminder: formatRemainingDays(expiresAt, m.status),
    productName,
    details: [
      ['订阅方式', 'Stripe订阅'],
      ['到期时间', m.expireDate || '未知'],
      ['自动续订', '已关闭'],
    ],
  };
}

export function buildMemberStatus(m: Membership): MemberStatus {
  if (m.vip) {
    return vipSubsStatus;
  }

  switch (m.payMethod) {
    case 'alipay':
    case 'wechat':
      return onetimeSubsStatus(m);

    case 'stripe':
      return stripeSubsStatus(m);

    case 'apple':
      return appleMemberStatus(m);

    case 'b2b':
      return b2bMemberStatus(m);

    default:
      return {
        reminder: '',
        productName: m.tier ? localizedTier(m.tier) : '',
        details: [],
      }
  }
}

