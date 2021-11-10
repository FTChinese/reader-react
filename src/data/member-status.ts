import { getDate, getMonth, parseISO } from 'date-fns';
import { StringPair } from '../components/list/pair';
import { diffToday, isExpired } from '../utils/now';
import { Cycle, isInvalidSubStatus, PaymentMethod, SubStatus } from './enum';
import { localizedCycle, localizedTier, localizePaymentMethod } from './localization';
import { isMembershipZero, Membership } from './membership';

/**
 * @description Describes the UI used to present Membership.
 */
export type MemberStatus = {
  productName: string;
  details: StringPair[];
  reminder?: string;
  reactivateStripe?: boolean;
}

function formatRemainingDays(expiresAt?: Date, subStatus?: SubStatus | null): string | undefined {
  if (!expiresAt) {
    return undefined;
  }

  const n = diffToday(expiresAt);

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

function rowSubsSource(pm: PaymentMethod | null): StringPair {
  return ['订阅方式', localizePaymentMethod(pm)];
}

function rowExpiration(date: string | null, isVip: boolean = false): StringPair {
  return [
    '到期时间',
    isVip ? '无限期' : (date || '-')
  ];
}

function rowAutoRenewDate(expiresAt: Date, cycle: Cycle): StringPair {
  return ['自动续订', formatAutoRenewMoment(expiresAt, cycle)];
}

function rowAutoRenewOn(): StringPair {
  return ['自动续订', '已开启'];
}

function rowAutoRenewOff(): StringPair {
  return ['自动续订', '已关闭'];
}

/**
 * @description Build card like:
 *        标准会员
 * 到期时间       2021-11-11
 */
function onetimeSubsStatus(m: Membership): MemberStatus {
  return {
    productName: m.tier ? localizedTier(m.tier) : '',
    details: [
      rowExpiration(m.expireDate),
    ],
    reminder: m.expireDate
      ? formatRemainingDays(parseISO(m.expireDate))
      : undefined,
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
    productName: m.tier ? localizedTier(m.tier) : '',
    details: [
      rowSubsSource(m.payMethod),
      rowExpiration(m.expireDate),
    ],
    reminder: '企业订阅续订或升级请联系所属机构的管理人员',
  };
}

/**
 * @description Build a card for stripe or apple like:
 *      标准会员
 * 订阅方式     Stripe订阅 | 苹果App内购
 * 自动续订     xx月xx日/年
 *
 * or if either expireDate or cycle is missing:
 *      标准会员
 * 订阅方式     Stripe订阅 | 苹果App内购
 * 自动续订     已开启
 * 到期时间     2021-11-11
 *
 * or if auto renew is off
 *      标准会员
 * 订阅方式     Stripe订阅 | 苹果App内购
 * 自动续订     已关闭
 * 到期时间     2021-11-11
 */
function autoRenewalSubsStatus(m: Membership): MemberStatus {
  const productName = m.tier ? localizedTier(m.tier) : '';

  const expiresAt = m.expireDate ? parseISO(m.expireDate) : undefined;

  if (m.autoRenew) {
    if (!expiresAt || !m.cycle) {
      return {
        productName,
        details: [
          rowSubsSource(m.payMethod),
          rowAutoRenewOn(),
          rowExpiration(m.expireDate)
        ]
      };
    }

    return {
      productName,
      details: [
        rowSubsSource(m.payMethod),
        rowAutoRenewDate(expiresAt, m.cycle),
      ]
    };
  }

  const expired = expiresAt ? isExpired(expiresAt) : true;

  return {
    productName,
    details: [
      rowSubsSource(m.payMethod),
      rowAutoRenewOff(),
      rowExpiration(m.expireDate),
    ],
    reminder: formatRemainingDays(expiresAt, m.status),
    // For stripe, if auto renew is off and expiration date is not past.
    // You could only reactivate stripe subscripiton if
    // if is not auto renewal and not expired yet.
    // After expiration, this subscription is gone and to
    // re-subscribe, you should create a new subscription.
    reactivateStripe: (m.payMethod === 'stripe') && !expired,
  };
}


export function buildMemberStatus(m: Membership): MemberStatus {
  if (isMembershipZero(m)) {
    return {
      productName: '未订阅',
      details: [],
      reminder: '您尚未订阅FT中文网服务'
    }
  }

  /**
   *      超级会员
   * 到期时间    无限期
   */
  if (m.vip) {
    return {
      productName: '超级会员',
      details: [
        rowExpiration(null, true)
      ],
    };
  }

  switch (m.payMethod) {
    case 'alipay':
    case 'wechat':
      return onetimeSubsStatus(m);

    case 'stripe':
    case 'apple':
      return autoRenewalSubsStatus(m);

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

