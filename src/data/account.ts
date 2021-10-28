import { LoginMethod } from './enum';
import { Membership } from './membership';

export class Wechat {
  nickname?: string;
  avatarUrl?: string;
}
export interface BaseAccount {
  id: string;
  unionId: string | null;
  stripeId: string | null;
  email: string;
  mobile: string | null;
  userName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  campaignCode: string | null;
}

export function isMobileDerivedEmail(email: string): boolean {
  return email.endsWith('@ftchinese.user')
}

export function isEmailMissing(a: string): boolean {
  if (a === '') {
    return true;
  }

  return isMobileDerivedEmail(a);
}

export function isTestAccount(a: BaseAccount): boolean {
  return a.email.endsWith('.test@ftchinese.com');
}

export type ReaderAccount = BaseAccount & {
  loginMethod: LoginMethod;
  wechat: Wechat;
  membership: Membership;
}

export function getDisplayName(account: ReaderAccount): string {
  if (account.userName) {
    return account.userName;
  }

  if (account.wechat.nickname) {
    return account.wechat.nickname;
  }

  if (account.email) {
    return account.email.split('@')[0];
  }

  return '';
}

export interface ReaderPassport extends ReaderAccount {
  expiresAt: number;
  token: string;
}

export function authHeader(p: ReaderPassport): { [key: string]: string } {
  return {
    'Authorization': `Bearer ${p.token}`,
  };
}

export function isLoginExpired(pp: ReaderPassport): boolean {
  return (Date.now() / 1000) > pp.expiresAt;
}

export type SearchResult = {
  id: string | null;
}
