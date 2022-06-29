import { parseISO } from 'date-fns';
import { SubStatus, isInvalidSubStatus, PaymentKind, Tier, isTrialing } from '../../data/enum';
import { localizePaymentMethod, localizeSubsStatus, localizeTier } from '../../data/localization';
import { Membership, isMembershipZero, concatAutoRenewMoment, parseAutoRenewMoment, hasAddOn, isStripeRenewOn, isStripeCancelled } from '../../data/membership';
import { diffToday } from '../../utils/now';
import { StringPair } from '../../data/pair';

/**
 * @description Describes the UI used to present Membership.
 */
export type MemberStatus = {
  productName: string;
  details: StringPair[];
  reminder?: string;
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

function rowSubsSource(pm?: PaymentKind): StringPair {
  return ['订阅方式', localizePaymentMethod(pm)];
}

function rowSubsStatus(m: Membership): StringPair {
  const head = '订阅状态';

  if (!m.status) {
    return [head, '-'];
  }

  if (isTrialing(m.status)) {
    return [head, `${localizeSubsStatus(m.status)}(${m.expireDate}结束)`];
  }

  return [head, localizeSubsStatus(m.status)]
}

export function rowExpiration(date?: string, isVip: boolean = false): StringPair {
  return [
    '到期时间',
    isVip ? '无限期' : (date || '-')
  ];
}

export function rowTier(tier?: Tier): StringPair {
  return ['会员类型', tier ? localizeTier(tier) : '-']
}

/**
 * @description Build card like:
 *        标准会员
 * 到期时间       2021-11-11
 */
function onetimeSubsStatus(m: Membership): MemberStatus {
  return {
    productName: m.tier ? localizeTier(m.tier) : '',
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
    productName: m.tier ? localizeTier(m.tier) : '',
    details: [
      rowSubsSource(m.payMethod),
      rowExpiration(m.expireDate),
    ],
    reminder: '企业订阅续订或升级请联系所属机构的管理人员',
  };
}


/**
 * @description Build a card for stripe or apple subscription
 */
function autoRenewalSubsStatus(m: Membership): MemberStatus {
  const productName = m.tier ? localizeTier(m.tier) : '';

  if (m.autoRenew) {
    const renewMoment = parseAutoRenewMoment(m);

    /**
     * or if either expireDate or cycle is missing:
     *      标准会员
     * 订阅方式     Stripe订阅 | 苹果App内购
     * 自动续订     已开启
     * 到期时间     2021-11-11
     */
    if (!renewMoment) {
      return {
        productName,
        details: [
          rowSubsSource(m.payMethod),
          ['自动续订', '已开启'],
          rowExpiration(m.expireDate),
          rowSubsStatus(m)
        ],
      };
    }

    /**
     *   标准会员
     * 订阅方式     Stripe订阅 | 苹果App内购
     * 自动续订     xx月xx日/年
     * 订阅状态     xxxxxx
     */
    return {
      productName,
      details: [
        rowSubsSource(m.payMethod),
        ['自动续订', concatAutoRenewMoment(renewMoment)],
        rowSubsStatus(m)
      ]
    };
  }

  /**
   * or if auto renew is off
   *      标准会员
   * 订阅方式     Stripe订阅 | 苹果App内购
   * 自动续订     已关闭
   * 到期时间     2021-11-11
   */
  const expiresAt = m.expireDate
    ? parseISO(m.expireDate)
    : undefined;

  return {
    productName,
    details: [
      rowSubsSource(m.payMethod),
      ['自动续订', '已关闭'],
      rowExpiration(m.expireDate),
      rowSubsStatus(m)
    ],
    reminder: formatRemainingDays(expiresAt, m.status),
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
        rowExpiration(undefined, true)
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
        productName: m.tier ? localizeTier(m.tier) : '',
        details: [],
      }
  }
}

export function buildAddOnRows(m: Membership): StringPair[] {
  if (!hasAddOn(m)) {
    return [];
  }

  return [
    ['高端版', `${m.premiumAddOn}天`],
    ['标准版', `${m.standardAddOn}天`],
  ];
}

// For stripe, if auto renew is off and expiration date is not past.
// You could only reactivate stripe subscripiton if
// if is not auto renewal and not expired yet.
// After expiration, this subscription is gone and to
// re-subscribe, you should create a new subscription.
export enum StripeAction {
  None,
  Cancel,
  Activate,
}

export function getStripeAction(m: Membership): StripeAction {
  if (isStripeRenewOn(m)) {
    return StripeAction.Cancel;
  }

  if (isStripeCancelled(m)) {
    return StripeAction.Activate;
  }

  return StripeAction.None;
}
