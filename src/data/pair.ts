import { localizeSubsStatus } from './localization';
import { StripeSubs } from './stripe';

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

export function stripeSubsDetails(subs: StripeSubs): StringPair[] {
  return [
    ['本周期开始时间', `${subs.currentPeriodStart}`],
    ['本周期结束时间', subs.currentPeriodEnd],
    ['订阅状态', localizeSubsStatus(subs.status)]
  ];
}
